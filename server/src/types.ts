export interface Player {
    id: string;
    name: string;
    score: number;
}

export interface Game {
    pin: string;
    hostId: string;
    players: Player[];
    status: 'lobby' | 'playing' | 'finished';
    currentQuestionIndex: number;
}

export interface Question {
    text: string;
    options: string[];
    correctIndex: number;
}
