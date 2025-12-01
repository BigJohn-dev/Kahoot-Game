import { Game, Player } from './types';

export class GameManager {
    private games: Map<string, Game> = new Map();

    createGame(hostId: string): string {
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        this.games.set(pin, {
            pin,
            hostId,
            players: [],
            status: 'lobby',
            currentQuestionIndex: 0
        });
        return pin;
    }

    joinGame(pin: string, playerId: string, name: string): boolean {
        const game = this.games.get(pin);
        if (!game || game.status !== 'lobby') return false;

        game.players.push({ id: playerId, name, score: 0 });
        return true;
    }

    getGame(pin: string): Game | undefined {
        return this.games.get(pin);
    }

    removePlayer(playerId: string) {
        for (const game of this.games.values()) {
            const index = game.players.findIndex(p => p.id === playerId);
            if (index !== -1) {
                game.players.splice(index, 1);
            }
        }
    }

    startGame(pin: string): boolean {
        const game = this.games.get(pin);
        if (!game) return false;
        game.status = 'playing';
        return true;
    }

    submitAnswer(pin: string, playerId: string, answerIndex: number): number {
        const game = this.games.get(pin);
        if (!game || game.status !== 'playing') return 0;

        // Placeholder for score calculation
        // In a real game, check against current question's correct index
        // For now, just give 100 points for any answer
        const player = game.players.find(p => p.id === playerId);
        if (player) {
            player.score += 100;
            return player.score;
        }
        return 0;
    }
}
