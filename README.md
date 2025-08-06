# Rock Paper Scissors Multiplayer Game

A real-time multiplayer Rock Paper Scissors game built with React (frontend) and Node.js with WebSockets (backend).

## Features

- Real-time multiplayer gameplay
- WebSocket-based communication
- Best of 3 rounds
- Modern UI with Tailwind CSS
- Toast notifications
- Responsive design

## Project Structure

```
├── backend/          # Node.js WebSocket server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   ├── Dockerfile    # Backend Docker configuration
│   └── .dockerignore # Docker ignore file
├── frontend/         # React frontend
│   ├── src/          # Source files
│   ├── package.json  # Frontend dependencies
│   ├── Dockerfile    # Frontend Docker configuration
│   ├── nginx.conf    # Nginx configuration
│   └── .dockerignore # Docker ignore file
└── docker-compose.yml # Docker Compose configuration
```

## Docker Setup (Recommended)

### Prerequisites
- Docker
- Docker Compose

### Running with Docker Compose

1. Clone the repository:
```bash
git clone <repository-url>
cd rock-paper-scissors-game
```

2. Build and start all services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend WebSocket: ws://localhost:3001

### Individual Docker Commands

#### Backend Only
```bash
cd backend
docker build -t rps-backend .
docker run -p 3001:3001 rps-backend
```

#### Frontend Only
```bash
cd frontend
docker build -t rps-frontend .
docker run -p 3000:3000 rps-frontend
```

## Local Development Setup

### Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on http://localhost:3001

### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173 (Vite default)

## How to Play

1. Open the application in your browser
2. Click "Find Opponent" to join the matchmaking queue
3. Wait for another player to join
4. Choose Rock, Paper, or Scissors
5. See the results and play best of 3 rounds
6. Play again or return to lobby

## Game Rules

- Rock beats Scissors
- Scissors beats Paper
- Paper beats Rock
- Best of 3 rounds wins the match

## Technologies Used

### Backend
- Node.js
- Express.js
- WebSocket (ws)
- UUID for unique IDs

### Frontend
- React 18
- Vite
- Tailwind CSS
- Custom UI components

### DevOps
- Docker
- Docker Compose
- Nginx (for production frontend)

## Environment Variables

### Backend
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

### Frontend
- `NODE_ENV`: Environment mode (development/production)

## Docker Configuration Details

### Backend Dockerfile
- Uses Node.js 18 Alpine image
- Runs as non-root user for security
- Exposes port 3001
- Optimized for production with `npm ci --only=production`

### Frontend Dockerfile
- Multi-stage build for optimization
- Build stage: Node.js 18 Alpine
- Production stage: Nginx Alpine
- Serves static files with Nginx
- Includes security headers and caching

### Docker Compose
- Orchestrates both frontend and backend
- Includes health checks
- Automatic restart policies
- Network isolation

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000 and 3001 are available
2. **WebSocket connection issues**: Ensure backend is running before frontend
3. **Build failures**: Check Docker logs with `docker-compose logs`

### Docker Commands

```bash
# View logs
docker-compose logs

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Remove all containers and images
docker-compose down --rmi all
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## License

MIT License