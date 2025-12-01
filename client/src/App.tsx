import { useState } from 'react'
import './App.css'
import { HostLobby } from './components/HostLobby'
import { PlayerJoin } from './components/PlayerJoin'
import { HostGame } from './components/HostGame'
import { PlayerGame } from './components/PlayerGame'

function App() {
  const [view, setView] = useState<'landing' | 'host' | 'player' | 'game'>('landing');
  const [role, setRole] = useState<'host' | 'player' | null>(null);
  const [gamePin, setGamePin] = useState<string>('');

  const handleStartGame = (pin: string) => {
    setGamePin(pin);
    setView('game');
  };

  const handleJoinGame = (pin: string, name: string) => {
    setGamePin(pin);
    setView('game');
  };

  return (
    <div className="app-container">
      {view === 'landing' && (
        <div className="landing">
          <h1>Kahoot Clone</h1>
          <div className="buttons">
            <button onClick={() => { setView('host'); setRole('host'); }}>Host Game</button>
            <button onClick={() => { setView('player'); setRole('player'); }}>Join Game</button>
          </div>
        </div>
      )}

      {view === 'host' && (
        <HostLobby onStartGame={handleStartGame} />
      )}

      {view === 'player' && (
        <PlayerJoin onJoin={handleJoinGame} />
      )}

      {view === 'game' && (
        <div className="game-screen">
          {role === 'host' ? (
            <HostGame pin={gamePin} />
          ) : (
            <PlayerGame pin={gamePin} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
