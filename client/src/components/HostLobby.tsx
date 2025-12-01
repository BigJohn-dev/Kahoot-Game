import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import type { Player } from '../types';

interface HostLobbyProps {
    onStartGame: (pin: string) => void;
}

export const HostLobby: React.FC<HostLobbyProps> = ({ onStartGame }) => {
    const socket = useSocket();
    const [pin, setPin] = useState<string>('');
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('create_game', (response: { pin: string }) => {
            setPin(response.pin);
        });

        socket.on('player_joined', (player: Player) => {
            setPlayers((prev) => [...prev, player]);
        });

        return () => {
            socket.off('player_joined');
        };
    }, [socket]);

    const handleStartGame = () => {
        if (socket && pin) {
            socket.emit('start_game', { pin });
            onStartGame(pin);
        }
    };

    return (
        <div className="host-lobby">
            <h1>Join at kahoot.it</h1>
            <div className="pin-display">
                <h2>Game PIN:</h2>
                <div className="pin-number">{pin || 'Loading...'}</div>
            </div>

            <div className="players-list">
                <h3>Players: {players.length}</h3>
                <ul>
                    {players.map((p) => (
                        <li key={p.id}>{p.name}</li>
                    ))}
                </ul>
            </div>

            <button onClick={handleStartGame} disabled={players.length === 0}>
                Start Game
            </button>
        </div>
    );
};
