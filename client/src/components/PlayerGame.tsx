import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';

interface PlayerGameProps {
    pin: string;
}

export const PlayerGame: React.FC<PlayerGameProps> = ({ pin }) => {
    const socket = useSocket();
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    const handleAnswer = (index: number) => {
        if (!socket || submitted) return;

        socket.emit('submit_answer', { pin, answerIndex: index });
        setSubmitted(true);

        socket.once('answer_result', (result: { correct: boolean; score: number }) => {
            setScore(result.score);
        });
    };

    if (submitted) {
        return (
            <div className="player-game waiting">
                <h2>Answer Submitted!</h2>
                {score !== null && <h3>Current Score: {score}</h3>}
                <p>Waiting for next question...</p>
            </div>
        );
    }

    return (
        <div className="player-game">
            <div className="controller-grid">
                <button className="btn-shape red" onClick={() => handleAnswer(0)}>▲</button>
                <button className="btn-shape blue" onClick={() => handleAnswer(1)}>◆</button>
                <button className="btn-shape yellow" onClick={() => handleAnswer(2)}>●</button>
                <button className="btn-shape green" onClick={() => handleAnswer(3)}>■</button>
            </div>
        </div>
    );
};
