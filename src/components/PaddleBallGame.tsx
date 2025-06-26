import { useEffect, useRef, useState } from 'react';

interface PaddleBallGameProps {
  onBackToSelection: () => void;
}

const PaddleBallGame = ({ onBackToSelection }: PaddleBallGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef({
    isPlaying: false,
    animationId: 0
  });

  // Game constants
  const PADDLE_WIDTH = 15;
  const PADDLE_HEIGHT = 120;
  const BALL_RADIUS = 12;
  const PADDLE_SPEED = 8;
  const BALL_SPEED = 6;

  // Game objects
  const gameObjectsRef = useRef({
    leftPaddle: { x: 30, y: 0, width: PADDLE_WIDTH, height: PADDLE_HEIGHT },
    rightPaddle: { x: 0, y: 0, width: PADDLE_WIDTH, height: PADDLE_HEIGHT },
    ball: { x: 0, y: 0, vx: 0, vy: 0, radius: BALL_RADIUS }
  });

  // Touch tracking
  const touchStateRef = useRef({
    leftTouch: null as { id: number; startY: number; currentY: number } | null,
    rightTouch: null as { id: number; startY: number; currentY: number } | null
  });

  const [scores, setScores] = useState({ left: 0, right: 0 });

  const initializeGame = (canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Initialize paddle positions
    gameObjectsRef.current.leftPaddle.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    gameObjectsRef.current.rightPaddle.x = canvas.width - 45;
    gameObjectsRef.current.rightPaddle.y = canvas.height / 2 - PADDLE_HEIGHT / 2;

    // Initialize ball position and velocity
    gameObjectsRef.current.ball.x = canvas.width / 2;
    gameObjectsRef.current.ball.y = canvas.height / 2;
    
    // Random initial direction
    const direction = Math.random() > 0.5 ? 1 : -1;
    gameObjectsRef.current.ball.vx = BALL_SPEED * direction;
    gameObjectsRef.current.ball.vy = (Math.random() - 0.5) * BALL_SPEED;
  };

  const drawGame = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.fillStyle = '#0f172a';
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

    const { leftPaddle, rightPaddle, ball } = gameObjectsRef.current;

    // Draw left paddle
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

    // Draw right paddle
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const updateBall = (canvas: HTMLCanvasElement) => {
    const { ball } = gameObjectsRef.current;
    
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top and bottom walls
    if (ball.y <= ball.radius || ball.y >= canvas.height - ball.radius) {
      ball.vy = -ball.vy;
    }
  };

  const updatePaddles = (canvas: HTMLCanvasElement) => {
    const { leftPaddle, rightPaddle } = gameObjectsRef.current;

    // Keep paddles within bounds
    leftPaddle.y = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, leftPaddle.y));
    rightPaddle.y = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, rightPaddle.y));
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStateRef.current.isPlaying) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateBall(canvas);
    updatePaddles(canvas);
    drawGame(ctx, canvas.width, canvas.height);

    gameStateRef.current.animationId = requestAnimationFrame(gameLoop);
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (x < canvas.width / 2 && !touchStateRef.current.leftTouch) {
        // Left side touch
        touchStateRef.current.leftTouch = {
          id: touch.identifier,
          startY: y,
          currentY: y
        };
      } else if (x >= canvas.width / 2 && !touchStateRef.current.rightTouch) {
        // Right side touch
        touchStateRef.current.rightTouch = {
          id: touch.identifier,
          startY: y,
          currentY: y
        };
      }
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const y = touch.clientY - rect.top;

      if (touchStateRef.current.leftTouch && touch.identifier === touchStateRef.current.leftTouch.id) {
        const deltaY = y - touchStateRef.current.leftTouch.startY;
        gameObjectsRef.current.leftPaddle.y = Math.max(0, 
          Math.min(canvas.height - PADDLE_HEIGHT, 
            canvas.height / 2 - PADDLE_HEIGHT / 2 + deltaY));
        touchStateRef.current.leftTouch.currentY = y;
      }

      if (touchStateRef.current.rightTouch && touch.identifier === touchStateRef.current.rightTouch.id) {
        const deltaY = y - touchStateRef.current.rightTouch.startY;
        gameObjectsRef.current.rightPaddle.y = Math.max(0, 
          Math.min(canvas.height - PADDLE_HEIGHT, 
            canvas.height / 2 - PADDLE_HEIGHT / 2 + deltaY));
        touchStateRef.current.rightTouch.currentY = y;
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      if (touchStateRef.current.leftTouch && touch.identifier === touchStateRef.current.leftTouch.id) {
        touchStateRef.current.leftTouch = null;
      }

      if (touchStateRef.current.rightTouch && touch.identifier === touchStateRef.current.rightTouch.id) {
        touchStateRef.current.rightTouch = null;
      }
    }
  };

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameStateRef.current.isPlaying = true;
    initializeGame(canvas);
    gameLoop();
  };

  const stopGame = () => {
    gameStateRef.current.isPlaying = false;
    if (gameStateRef.current.animationId) {
      cancelAnimationFrame(gameStateRef.current.animationId);
    }
  };

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
        
        if (!gameStateRef.current.isPlaying) {
          // Draw initial static state
          initializeGame(canvas);
          drawGame(ctx, canvas.width, canvas.height);
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Add touch event listeners
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      stopGame();
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Score Display */}
      <div className="flex justify-between items-center p-8 z-10">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-2">PLAYER 1</div>
          <div className="text-6xl md:text-7xl font-bold text-white bg-blue-600/20 px-6 py-3 rounded-2xl border border-blue-400/30">
            {scores.left}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-white mb-4">LEFT vs RIGHT</div>
          <div className="text-xl md:text-2xl text-slate-300">PADDLE BALL</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-red-300 mb-2">PLAYER 2</div>
          <div className="text-6xl md:text-7xl font-bold text-white bg-red-600/20 px-6 py-3 rounded-2xl border border-red-400/30">
            {scores.right}
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex-1 p-4 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full border-2 border-slate-600/50 rounded-2xl bg-slate-900/50 shadow-2xl touch-none"
        />
        
        {/* Game Instructions Overlay - Only show when not playing */}
        {!gameStateRef.current.isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm px-8 py-6 rounded-2xl border border-slate-500/30 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Play!</div>
              <div className="text-lg md:text-xl text-slate-300 mb-2">Left Player: Use LEFT side of screen</div>
              <div className="text-lg md:text-xl text-slate-300 mb-4">Right Player: Use RIGHT side of screen</div>
              <div className="text-base md:text-lg text-slate-400">Touch and drag to move your paddle</div>
            </div>
          </div>
        )}
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
          onClick={gameStateRef.current.isPlaying ? stopGame : startGame}
          className="bg-green-600 hover:bg-green-500 text-white px-12 py-4 rounded-xl text-2xl font-bold transition-colors shadow-lg"
        >
          {gameStateRef.current.isPlaying ? 'STOP GAME' : 'START GAME'}
        </button>
      </div>
    </div>
  );
};

export default PaddleBallGame;
