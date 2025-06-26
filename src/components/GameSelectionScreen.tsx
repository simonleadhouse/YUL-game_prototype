
import { useState, useEffect } from 'react';

interface GameSelectionScreenProps {
  onUserInteraction: () => void;
  onGameSelect: (gameId: string) => void;
}

const GameSelectionScreen = ({ onUserInteraction, onGameSelect }: GameSelectionScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGameClick = (gameId: string) => {
    onUserInteraction();
    if (gameId === 'paddle-ball') {
      onGameSelect(gameId);
    }
  };

  const games = [
    {
      id: 'paddle-ball',
      title: 'Left vs Right Paddle Ball',
      description: 'Classic two-player paddle game',
      available: true,
      gradient: 'from-blue-500 to-purple-600'
    },
    ...Array(5).fill(null).map((_, index) => ({
      id: `game-${index + 2}`,
      title: 'Coming Soon',
      description: 'Exciting gameplay awaits',
      available: false,
      gradient: 'from-slate-600 to-slate-700'
    }))
  ];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className={`text-center space-y-12 z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold text-white">
            Choose Your Game
          </h1>
          <p className="text-2xl md:text-3xl text-blue-200 font-light max-w-3xl mx-auto">
            Select a game to start playing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">
          {games.map((game) => (
            <div
              key={game.id}
              className={`bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700 transform transition-all duration-300 ${
                game.available 
                  ? 'hover:scale-105 cursor-pointer hover:border-blue-500' 
                  : 'opacity-75 cursor-not-allowed'
              }`}
              onClick={() => handleGameClick(game.id)}
            >
              <div className={`w-full h-32 bg-gradient-to-br ${game.gradient} rounded-xl mb-4 flex items-center justify-center relative`}>
                {game.available && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    AVAILABLE
                  </div>
                )}
                <span className="text-2xl font-bold text-white text-center px-2">
                  {game.id === 'paddle-ball' ? '🏓' : `Game ${game.id.split('-')[1] || ''}`}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
              <p className="text-blue-300">{game.description}</p>
              {game.available && (
                <div className="mt-4 text-center">
                  <span className="text-green-400 font-semibold">▶ Tap to Play</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
        <div className="w-3 h-3 bg-amber-400 rounded-full opacity-50"></div>
        <div className="w-3 h-3 bg-amber-400 rounded-full opacity-50"></div>
        <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
      </div>

      <div className="absolute bottom-8 left-8 text-blue-400/50 text-lg font-light">
        Step 3 of 3 - Game Selection
      </div>
    </div>
  );
};

export default GameSelectionScreen;
