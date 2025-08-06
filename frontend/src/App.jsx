import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Result from './components/Result';

function App() {
  const [playerId, setPlayerId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('lobby'); // lobby, waiting, playing, result
  const [roomId, setRoomId] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const [choices, setChoices] = useState({ player: null, opponent: null });
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    // Initialize WebSocket connection
    // const ws = new WebSocket('ws://localhost:3001');
    const ws = new WebSocket('https://game-backend-kfqq.onrender.com/');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);

      switch (data.type) {
        case 'connected':
          setPlayerId(data.playerId);
          break;

        case 'matchFound':
          setRoomId(data.roomId);
          setOpponent(data.opponentId);
          setPlayerNumber(data.playerNumber);
          setGameState('playing');
          setScores({ player: 0, opponent: 0 });
          setRound(1);
          setGameOver(false);
          toast({
            title: 'Match Found!',
            description: `You're playing against ${data.opponentId.slice(0, 8)}`,
          });
          break;

        case 'opponentMadeChoice':
          toast({
            description: 'Opponent has made their choice',
          });
          break;

        case 'roundResult':
          setChoices({
            player: data.yourChoice,
            opponent: data.opponentChoice
          });
          setResult(data.result);
          setScores({
            player: data.scores.you,
            opponent: data.scores.opponent
          });
          setRound(data.round);
          setGameOver(data.gameOver);
          setGameState('result');
          break;

        case 'opponentDisconnected':
          toast({
            title: 'Opponent Disconnected',
            description: 'Your opponent has left the game',
            variant: 'destructive'
          });
          setGameState('lobby');
          break;

        case 'newGame':
          setGameState('playing');
          setChoices({ player: null, opponent: null });
          setResult(null);
          setScores({ player: 0, opponent: 0 });
          setRound(1);
          setGameOver(false);
          break;

        default:
          console.log('Unknown message type:', data.type);
          break;
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, [toast]);

  const joinQueue = () => {
    if (socket && playerId) {
      socket.send(JSON.stringify({ type: 'joinQueue' }));
      setGameState('waiting');
      toast({
        description: 'Finding an opponent...',
      });
    }
  };

  const makeChoice = (choice) => {
    if (socket && roomId) {
      socket.send(JSON.stringify({ type: 'makeChoice', choice }));
    }
  };

  const playAgain = () => {
    if (socket && roomId) {
      socket.send(JSON.stringify({ type: 'playAgain' }));
    }
  };

  const backToLobby = () => {
    setGameState('lobby');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">Rock Paper Scissors</h1>
          <p className="opacity-80">Multiplayer Battle</p>
        </div>

        <div className="p-6">
          {gameState === 'lobby' && (
            <Lobby onJoinQueue={joinQueue} playerId={playerId} />
          )}

          {gameState === 'waiting' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold mb-2">Finding an opponent...</h2>
              <p className="text-gray-600">Please wait while we match you with another player</p>
              <button
                onClick={backToLobby}
                className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium"
              >
                Cancel
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <Game
              onChoice={makeChoice}
              playerNumber={playerNumber}
              opponent={opponent}
              round={round}
              scores={scores}
            />
          )}

          {gameState === 'result' && (
            <Result
              choices={choices}
              result={result}
              scores={scores}
              round={round}
              gameOver={gameOver}
              onPlayAgain={playAgain}
              onBackToLobby={backToLobby}
            />
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;