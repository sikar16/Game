import React from 'react';
import { Button } from './ui/button';

const Result = ({ choices, result, scores, round, gameOver, onPlayAgain, onBackToLobby }) => {
    const getResultMessage = () => {
        if (result.winner === 0) return "It's a draw!";
        if (result.winner === 1) return "You win this round!";
        return "Opponent wins this round!";
    };

    const getGameResult = () => {
        if (scores.player > scores.opponent) return "You win the game!";
        if (scores.opponent > scores.player) return "Opponent wins the game!";
        return "The game ended in a draw!";
    };

    const getEmoji = (choice) => {
        switch (choice) {
            case 'rock': return '✊';
            case 'paper': return '✋';
            case 'scissors': return '✌️';
            default: return '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                    {gameOver ? getGameResult() : getResultMessage()}
                </h2>
                <p className="text-gray-600">{result.message}</p>
            </div>

            <div className="flex justify-between items-center">
                <div className="text-center w-1/3">
                    <div className="font-medium mb-2">You</div>
                    <div className="text-5xl">{getEmoji(choices.player)}</div>
                    <div className="mt-2 text-sm text-gray-600 capitalize">{choices.player}</div>
                </div>

                <div className="text-2xl font-bold text-gray-400">vs</div>

                <div className="text-center w-1/3">
                    <div className="font-medium mb-2">Opponent</div>
                    <div className="text-5xl">{getEmoji(choices.opponent)}</div>
                    <div className="mt-2 text-sm text-gray-600 capitalize">{choices.opponent}</div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Your Score</div>
                        <div className="text-3xl font-bold text-indigo-600">{scores.player}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Opponent Score</div>
                        <div className="text-3xl font-bold text-purple-600">{scores.opponent}</div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                {!gameOver ? (
                    <Button
                        className="flex-1 py-6"
                        onClick={onPlayAgain}
                    >
                        Next Round
                    </Button>
                ) : (
                    <Button
                        className="flex-1 py-6 bg-gradient-to-r from-indigo-600 to-purple-600"
                        onClick={onPlayAgain}
                    >
                        Play Again
                    </Button>
                )}

                <Button
                    variant="outline"
                    className="flex-1 py-6"
                    onClick={onBackToLobby}
                >
                    Back to Lobby
                </Button>
            </div>
        </div>
    );
};

export default Result;