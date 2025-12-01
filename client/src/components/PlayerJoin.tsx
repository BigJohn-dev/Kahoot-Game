import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';

interface PlayerJoinProps {
    onJoin: (pin: string, name: string) => void;
}

export const PlayerJoin: React.FC<PlayerJoinProps> = ({ onJoin }) => {
    const socket = useSocket();
    const [pin, setPin] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleJoin = () => {
        if (!socket) return;
        if (!pin || !name) {
            setError('Please enter both PIN and Nickname');
            return;
        }

        socket.emit('join_game', { pin, name }, (response: { success: boolean; error?: string }) => {
            if (response.success) {
                onJoin(pin, name);
            } else {
                setError(response.error || 'Failed to join');
            }
        });
    };

    return (
        <div className="player-join">
            <h1>Kahoot!</h1>
            <input
                type="text"
                placeholder="Game PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
            />
            <input
                type="text"
                placeholder="Nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleJoin}>Enter</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};
