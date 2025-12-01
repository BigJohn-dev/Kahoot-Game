import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameManager } from './GameManager';

dotenv.config();

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const gameManager = new GameManager();
const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('create_game', (callback) => {
        const pin = gameManager.createGame(socket.id);
        socket.join(pin);
        callback({ pin });
    });

    socket.on('join_game', ({ pin, name }, callback) => {
        const success = gameManager.joinGame(pin, socket.id, name);
        if (success) {
            socket.join(pin);
            io.to(pin).emit('player_joined', { id: socket.id, name, score: 0 });
            callback({ success: true });
        } else {
            callback({ success: false, error: 'Game not found or started' });
        }
    });

    socket.on('start_game', ({ pin }) => {
        const success = gameManager.startGame(pin);
        if (success) {
            io.to(pin).emit('game_started');
        }
    });

    socket.on('submit_answer', ({ pin, answerIndex }) => {
        const score = gameManager.submitAnswer(pin, socket.id, answerIndex);
        socket.emit('answer_result', { correct: true, score });
        io.to(pin).emit('score_update', { playerId: socket.id, score });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        gameManager.removePlayer(socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('Kahoot Clone Server is running');
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
