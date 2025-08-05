const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;

// Game state management
const rooms = {};
const players = {};
const queue = [];

wss.on('connection', (ws) => {
  const playerId = uuidv4();
  players[playerId] = { ws, playerId, roomId: null, choice: null, score: 0 };
  
  console.log(`Player connected: ${playerId}`);
  
  // Send player their ID
  ws.send(JSON.stringify({ type: 'connected', playerId }));
  
  // Handle messages from client
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    switch (data.type) {
      case 'joinQueue':
        handleJoinQueue(playerId);
        break;
      case 'makeChoice':
        handleMakeChoice(playerId, data.choice);
        break;
      case 'playAgain':
        handlePlayAgain(playerId);
        break;
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log(`Player disconnected: ${playerId}`);
    handleDisconnect(playerId);
    delete players[playerId];
  });
});

function handleJoinQueue(playerId) {
  queue.push(playerId);
  
  // Try to match players
  if (queue.length >= 2) {
    const player1Id = queue.shift();
    const player2Id = queue.shift();
    
    const roomId = uuidv4();
    rooms[roomId] = {
      roomId,
      players: [player1Id, player2Id],
      choices: { [player1Id]: null, [player2Id]: null },
      scores: { [player1Id]: 0, [player2Id]: 0 },
      round: 1,
      maxRounds: 3
    };
    
    players[player1Id].roomId = roomId;
    players[player2Id].roomId = roomId;
    
    // Notify players
    sendToPlayer(player1Id, { 
      type: 'matchFound', 
      roomId, 
      opponentId: player2Id,
      playerNumber: 1
    });
    
    sendToPlayer(player2Id, { 
      type: 'matchFound', 
      roomId, 
      opponentId: player1Id,
      playerNumber: 2
    });
  }
}

function handleMakeChoice(playerId, choice) {
  const player = players[playerId];
  if (!player || !player.roomId) return;
  
  const room = rooms[player.roomId];
  if (!room) return;
  
  room.choices[playerId] = choice;
  
  // Notify opponent that choice was made
  const opponentId = room.players.find(id => id !== playerId);
  sendToPlayer(opponentId, { type: 'opponentMadeChoice' });
  
  // Check if both players have made choices
  const bothMadeChoice = Object.values(room.choices).every(choice => choice !== null);
  
  if (bothMadeChoice) {
    // Determine winner
    const result = determineWinner(
      room.choices[room.players[0]], 
      room.choices[room.players[1]]
    );
    
    // Update scores
    if (result.winner === 1) {
      room.scores[room.players[0]]++;
    } else if (result.winner === 2) {
      room.scores[room.players[1]]++;
    }
    
    // Send results to both players
    room.players.forEach((id, index) => {
      sendToPlayer(id, {
        type: 'roundResult',
        yourChoice: room.choices[id],
        opponentChoice: room.choices[room.players[1 - index]],
        result: index === 0 ? result : reverseResult(result),
        scores: {
          you: room.scores[id],
          opponent: room.scores[room.players[1 - index]]
        },
        round: room.round,
        gameOver: room.round >= room.maxRounds
      });
    });
    
    // Reset choices for next round
    room.choices[room.players[0]] = null;
    room.choices[room.players[1]] = null;
    room.round++;
  }
}

function handlePlayAgain(playerId) {
  const player = players[playerId];
  if (!player || !player.roomId) return;
  
  const room = rooms[player.roomId];
  if (!room) return;
  
  // Reset room for new game
  room.choices[room.players[0]] = null;
  room.choices[room.players[1]] = null;
  room.scores[room.players[0]] = 0;
  room.scores[room.players[1]] = 0;
  room.round = 1;
  
  // Notify both players to start new game
  room.players.forEach(id => {
    sendToPlayer(id, {
      type: 'newGame'
    });
  });
}

function handleDisconnect(playerId) {
  // Remove from queue if present
  const index = queue.indexOf(playerId);
  if (index !== -1) {
    queue.splice(index, 1);
  }
  
  // Handle if player was in a room
  const player = players[playerId];
  if (player && player.roomId) {
    const room = rooms[player.roomId];
    if (room) {
      const opponentId = room.players.find(id => id !== playerId);
      if (opponentId) {
        sendToPlayer(opponentId, { type: 'opponentDisconnected' });
      }
      delete rooms[player.roomId];
    }
  }
}

function determineWinner(choice1, choice2) {
  if (choice1 === choice2) {
    return { winner: 0, message: "It's a draw!" };
  }
  
  if (
    (choice1 === 'rock' && choice2 === 'scissors') ||
    (choice1 === 'paper' && choice2 === 'rock') ||
    (choice1 === 'scissors' && choice2 === 'paper')
  ) {
    return { winner: 1, message: `${choice1} beats ${choice2}` };
  }
  
  return { winner: 2, message: `${choice2} beats ${choice1}` };
}

function reverseResult(result) {
  if (result.winner === 0) return result;
  return {
    winner: result.winner === 1 ? 2 : 1,
    message: result.message
  };
}

function sendToPlayer(playerId, message) {
  const player = players[playerId];
  if (player && player.ws.readyState === WebSocket.OPEN) {
    player.ws.send(JSON.stringify(message));
  }
}

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
}
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});