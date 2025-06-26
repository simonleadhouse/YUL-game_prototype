
import { useState, useEffect } from 'react';

interface GameSelectionScreenProps {
  onUserInteraction: () => void;
}

const GameSelectionScreen = ({ onUserInteraction }: GameSelectionScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
            Game selection coming soon...
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">
          {[1, 2, 3, 4, 5, 6].map((game) => (
            <div
              key={game}
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700 transform transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={onUserInteraction}
            >
              <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">Game {game}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-blue-300">Exciting gameplay awaits</p>
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
        Step 2 of 3 - Game Selection
      </div>
    </div>
  );
};

export default GameSelectionScreen;
