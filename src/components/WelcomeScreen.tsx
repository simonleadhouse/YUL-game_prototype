
import { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';

interface WelcomeScreenProps {
  onTapToPlay: () => void;
}

const WelcomeScreen = ({ onTapToPlay }: WelcomeScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Reset animation state when component mounts
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className={`text-center space-y-12 z-10 transition-all duration-1000 ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
        {/* Logo/Brand Area */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <Plane className="w-24 h-24 text-amber-400 animate-bounce" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-ping"></div>
          </div>
          
          <h1 className="text-8xl md:text-9xl font-bold text-white tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-white to-amber-400 bg-clip-text text-transparent">
              YUL
            </span>
          </h1>
          
          <h2 className="text-4xl md:text-5xl font-light text-blue-100 tracking-wide">
            DUTY FREE GAMES
          </h2>
        </div>

        {/* Welcome Message */}
        <div className="space-y-6">
          <p className="text-3xl md:text-4xl text-blue-200 font-light max-w-4xl mx-auto leading-relaxed">
            Welcome to Montreal's Interactive Gaming Experience
          </p>
          <p className="text-xl md:text-2xl text-blue-300 font-light">
            Discover amazing games while you wait
          </p>
        </div>

        {/* Call to Action */}
        <div className="pt-8">
          <button
            onClick={onTapToPlay}
            className="group relative px-16 py-8 text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-amber-500/25 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center space-x-4">
              <span>TAP TO PLAY</span>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </span>
          </button>
        </div>

        {/* Instruction Text */}
        <p className="text-lg md:text-xl text-blue-300 font-light animate-pulse">
          Touch anywhere on the screen to begin your journey
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-8 left-8 text-blue-400/50 text-lg font-light">
        Montréal-Trudeau International Airport
      </div>
      
      <div className="absolute bottom-8 right-8 text-blue-400/50 text-lg font-light">
        Interactive Entertainment Hub
      </div>
    </div>
  );
};

export default WelcomeScreen;
