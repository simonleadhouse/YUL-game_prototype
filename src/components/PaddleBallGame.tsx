
import { useEffect, useRef } from 'react';

interface PaddleBallGameProps {
  onBackToSelection: () => void;
}

const PaddleBallGame = ({ onBackToSelection }: PaddleBallGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to fill the game area
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawInitialState(ctx, canvas.width, canvas.height);
      }
    };

    // Draw initial static elements
    const drawInitialState = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Clear canvas
      ctx.fillStyle = '#0f172a'; // Dark slate background
      ctx.fillRect(0, 0, width, height);

      // Draw center line
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 15]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw left paddle (Player 1)
      ctx.fillStyle = '#3b82f6'; // Blue
      ctx.fillRect(30, height / 2 - 60, 15, 120);

      // Draw right paddle (Player 2)
      ctx.fillStyle = '#ef4444'; // Red
      ctx.fillRect(width - 45, height / 2 - 60, 15, 120);

      // Draw ball (center)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 12, 0, Math.PI * 2);
      ctx.fill();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Score Display */}
      <div className="flex justify-between items-center p-8 z-10">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-2">PLAYER 1</div>
          <div id="scoreLeft" className="text-6xl md:text-7xl font-bold text-white bg-blue-600/20 px-6 py-3 rounded-2xl border border-blue-400/30">
            0
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-white mb-4">LEFT vs RIGHT</div>
          <div className="text-xl md:text-2xl text-slate-300">PADDLE BALL</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-red-300 mb-2">PLAYER 2</div>
          <div id="scoreRight" className="text-6xl md:text-7xl font-bold text-white bg-red-600/20 px-6 py-3 rounded-2xl border border-red-400/30">
            0
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex-1 p-4 relative">
        <canvas
          ref={canvasRef}
          id="gameCanvas"
          className="w-full h-full border-2 border-slate-600/50 rounded-2xl bg-slate-900/50 shadow-2xl"
        />
        
        {/* Game Instructions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 backdrop-blur-sm px-8 py-6 rounded-2xl border border-slate-500/30 text-center">
            <div className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Play!</div>
            <div className="text-lg md:text-xl text-slate-300 mb-2">Left Player: Use LEFT side of screen</div>
            <div className="text-lg md:text-xl text-slate-300 mb-4">Right Player: Use RIGHT side of screen</div>
            <div className="text-base md:text-lg text-slate-400">Touch and drag to move your paddle</div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="p-6 flex justify-center space-x-6">
        <button
          onClick={onBackToSelection}
          className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors border border-slate-600"
        >
          Back to Games
        </button>
        <button
          className="bg-green-600 hover:bg-green-500 text-white px-12 py-4 rounded-xl text-2xl font-bold transition-colors shadow-lg"
        >
          START GAME
        </button>
      </div>
    </div>
  );
};

export default PaddleBallGame;
