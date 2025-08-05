import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Game = ({ onChoice, playerNumber, opponent, round, scores }) => {
    const [selectedChoice, setSelectedChoice] = useState(null);

    const choices = [
        { id: 'rock', label: 'Rock', emoji: '✊' },
        { id: 'paper', label: 'Paper', emoji: '✋' },
        { id: 'scissors', label: 'Scissors', emoji: '✌️' },
    ];

    const handleChoice = (choice) => {
        setSelectedChoice(choice);
        onChoice(choice);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="text-center">
                    <div className="text-sm text-gray-500">Round</div>
                    <div className="text-2xl font-bold">{round}/3</div>
                </div>

                <div className="text-center">
                    <div className="text-sm text-gray-500">You</div>
                    <div className="text-2xl font-bold text-indigo-600">{scores.player}</div>
                </div>

                <div className="text-center">
                    <div className="text-sm text-gray-500">Opponent</div>
                    <div className="text-2xl font-bold text-purple-600">{scores.opponent}</div>
                </div>
            </div>

            <Card className="border border-indigo-100">
                <CardHeader>
                    <CardTitle className="text-center">Opponent</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-400">
                            {opponent ? (
                                <span className="font-bold text-xs">{opponent.slice(0, 5)}</span>
                            ) : (
                                <span className="text-3xl">?</span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="py-4">
                <h3 className="text-center font-medium text-lg mb-4">Make your choice</h3>

                <div className="grid grid-cols-3 gap-4">
                    {choices.map((choice) => (
                        <Button
                            key={choice.id}
                            variant={selectedChoice === choice.id ? 'default' : 'outline'}
                            className={`py-8 flex flex-col items-center justify-center text-lg ${selectedChoice === choice.id
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'hover:bg-indigo-50'
                                }`}
                            onClick={() => handleChoice(choice.id)}
                            disabled={selectedChoice !== null}
                        >
                            <span className="text-3xl mb-2">{choice.emoji}</span>
                            {choice.label}
                        </Button>
                    ))}
                </div>
            </div>

            {selectedChoice && (
                <div className="text-center py-4 text-indigo-600 font-medium">
                    You selected: <span className="capitalize font-bold">{selectedChoice}</span>
                </div>
            )}
        </div>
    );
};

export default Game;