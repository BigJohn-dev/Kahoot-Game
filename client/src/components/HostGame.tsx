import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import type { Player } from '../types';

interface HostGameProps {
    pin: string;
}

export const HostGame: React.FC<HostGameProps> = ({ pin }) => {
    const socket = useSocket();
    const [scores, setScores] = useState<{ playerId: string; score: number }[]>([]);
    // Mock question for now
    const question = {
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"]
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('score_update', (data: { playerId: string; score: number }) => {
            setScores((prev) => {
                const newScores = [...prev];
                const idx = newScores.findIndex(s => s.playerId === data.playerId);
                if (idx !== -1) {
                    newScores[idx] = data;
                } else {
                    newScores.push(data);
                }
                return newScores.sort((a, b) => b.score - a.score);
            });
        });

        return () => {
            socket.off('score_update');
        };
    }, [socket]);

    return (
        <div className="host-game">
            <div className="question-header">
                <h2>{question.text}</h2>
            </div>

            <div className="options-grid">
                {question.options.map((opt, idx) => (
                    <div key={idx} className={`option-card option-${idx}`}>
                        {opt}
                    </div>
                ))}
            </div>

            <div className="leaderboard">
                <h3>Live Scores</h3>
                <ul>
                    {scores.map((s) => (
                        <li key={s.playerId}>Player {s.playerId.substr(0, 4)}: {s.score}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
