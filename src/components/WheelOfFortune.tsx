
import { useEffect, useRef, useState } from 'react';

interface WheelOfFortuneProps {
  onBackToSelection: () => void;
}

const WheelOfFortune = ({ onBackToSelection }: WheelOfFortuneProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Wheel configuration
  const WHEEL_SEGMENTS = 8;
  const SEGMENT_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#FFA07A', // Light Salmon
    '#98D8C8'  // Mint
  ];
  
  const PRIZE_LABELS = [
    'Prize 1',
    'Prize 2', 
    'Prize 3',
    'Prize 4',
    'Prize 5',
    'Prize 6',
    'Prize 7',
    'Prize 8'
  ];

  const drawWheel = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    const anglePerSegment = (2 * Math.PI) / WHEEL_SEGMENTS;
    
    // Draw each segment
    for (let i = 0; i < WHEEL_SEGMENTS; i++) {
      const startAngle = i * anglePerSegment - Math.PI / 2; // Start from top
      const endAngle = (i + 1) * anglePerSegment - Math.PI / 2;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = SEGMENT_COLORS[i];
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw segment text
      const textAngle = startAngle + anglePerSegment / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.7);
      
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(PRIZE_LABELS[i], 0, 0);
      ctx.restore();
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#2C3E50';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const drawPointer = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    const pointerSize = 30;
    const pointerY = centerY - radius - 10;
    
    // Draw triangle pointer
    ctx.beginPath();
    ctx.moveTo(centerX, pointerY);
    ctx.lineTo(centerX - pointerSize / 2, pointerY - pointerSize);
    ctx.lineTo(centerX + pointerSize / 2, pointerY - pointerSize);
    ctx.closePath();
    ctx.fillStyle = '#E74C3C';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const renderWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    // Draw wheel and pointer
    drawWheel(ctx, centerX, centerY, radius);
    drawPointer(ctx, centerX, centerY, radius);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    
    // Placeholder for spin functionality
    setIsSpinning(true);
    console.log('Spin button clicked - functionality to be implemented');
    
    // Reset spinning state after a brief moment for now
    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        renderWheel();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-center items-center p-8 z-10">
        <div className="text-center">
          <div className="text-4xl md:text-6xl font-bold text-white mb-4">🎯 WHEEL OF FORTUNE 🎯</div>
          <div className="text-2xl md:text-3xl text-slate-300">Spin to Win Amazing Prizes!</div>
          <div className="text-lg md:text-xl text-slate-400 mt-2">Get ready for your reward</div>
        </div>
      </div>

      {/* Wheel Canvas Container */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="relative max-w-2xl max-h-2xl w-full h-full">
          <canvas
            ref={canvasRef}
            className="w-full h-full border-4 border-white/20 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 shadow-2xl"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="p-8 flex justify-center space-x-8">
        <button
          onClick={onBackToSelection}
          className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors border border-slate-600 disabled:opacity-50"
          disabled={isSpinning}
        >
          Back to Games
        </button>
        <button
          onClick={handleSpin}
          className={`px-16 py-6 rounded-xl text-3xl font-bold transition-all shadow-lg transform ${
            isSpinning 
              ? 'bg-gray-600 cursor-not-allowed opacity-75' 
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white hover:scale-105 shadow-yellow-500/25'
          }`}
          disabled={isSpinning}
        >
          {isSpinning ? 'SPINNING...' : '🎰 SPIN THE WHEEL! 🎰'}
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
          <div className="text-white text-lg font-semibold">Click the SPIN button to try your luck!</div>
          <div className="text-slate-300 text-sm">8 amazing prizes waiting for you</div>
        </div>
      </div>
    </div>
  );
};

export default WheelOfFortune;
