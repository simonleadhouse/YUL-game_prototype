
import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface ConfirmationScreenProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationScreen = ({ onConfirm, onCancel }: ConfirmationScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Smooth entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-400 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className={`text-center space-y-16 z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Confirmation Message */}
        <div className="space-y-8">
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
              Ready to Play?
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          </div>
          
          <p className="text-2xl md:text-3xl text-blue-200 font-light max-w-3xl mx-auto leading-relaxed">
            You're about to enter the YUL Duty Free gaming experience.<br />
            Get ready for an amazing adventure!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12 pt-8">
          
          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            className="group relative px-12 py-6 text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-green-500/25 active:scale-95 min-w-[280px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center space-x-3">
              <Check className="w-8 h-8" />
              <span>YES, I'M READY!</span>
            </span>
          </button>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="group relative px-12 py-6 text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-slate-500/25 active:scale-95 min-w-[280px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center space-x-3">
              <X className="w-8 h-8" />
              <span>NOT YET</span>
            </span>
          </button>
        </div>

        {/* Helper Text */}
        <div className="space-y-4 pt-8">
          <p className="text-lg md:text-xl text-blue-300 font-light">
            Choose your option by tapping one of the buttons above
          </p>
          <p className="text-base md:text-lg text-blue-400 font-light">
            You can always come back later if you're not ready now
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
        <div className="w-3 h-3 bg-amber-400 rounded-full opacity-50"></div>
        <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
        <div className="w-3 h-3 bg-amber-400 rounded-full opacity-50"></div>
      </div>

      {/* Back Navigation Hint */}
      <div className="absolute bottom-8 left-8 text-blue-400/50 text-lg font-light">
        Step 1 of 3 - Confirmation
      </div>
    </div>
  );
};

export default ConfirmationScreen;
