import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Lobby = ({ onJoinQueue, playerId }) => {
    return (
        <div className="space-y-6">
            <Card className="border border-indigo-100 bg-indigo-50">
                <CardHeader>
                    <CardTitle className="text-center">Your Player ID</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-white py-3 px-4 rounded-lg border border-indigo-200 flex items-center justify-center">
                        <span className="font-mono text-lg font-bold tracking-wider">
                            {playerId?.slice(0, 8) || '...'}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center py-4">
                <Button
                    size="lg"
                    className="w-full py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    onClick={onJoinQueue}
                >
                    🚀 Find Opponent
                </Button>
            </div>

            <div className="mt-8 bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">How to Play</h3>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                        <span className="bg-indigo-100 text-indigo-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                        Click "Find Opponent" to match with a player
                    </li>
                    <li className="flex items-start">
                        <span className="bg-indigo-100 text-indigo-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                        Choose Rock, Paper, or Scissors
                    </li>
                    <li className="flex items-start">
                        <span className="bg-indigo-100 text-indigo-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                        Best of 3 rounds wins the match!
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Lobby;