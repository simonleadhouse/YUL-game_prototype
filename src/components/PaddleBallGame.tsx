import { useEffect, useRef, useState } from 'react';

interface PaddleBallGameProps {
  onBackToSelection: () => void;
  onTransitionToWheelOfFortune: () => void;
}

const PaddleBallGame = ({ onBackToSelection, onTransitionToWheelOfFortune }: PaddleBallGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef({
    isPlaying: false,
    animationId: 0,
    gameOver: false,
    winner: null as 'left' | 'right' | null,
    ballResetTimer: null as NodeJS.Timeout | null,
    ballOutOfPlay: false // New flag to prevent multiple scores per event
  });

  // Game constants
  const PADDLE_WIDTH = 15;
  const PADDLE_HEIGHT = 120;
  const BALL_RADIUS = 12;
  const PADDLE_SPEED = 8;
  const BALL_SPEED = 6;
  const WINNING_SCORE = 3;

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

  // Input capability detection
  const inputCapabilityRef = useRef({
    isTouchDevice: false,
    touchActive: false,
    mouseControlEnabled: false
  });

  const [scores, setScores] = useState({ left: 0, right: 0 });
  const [showWinnerMessage, setShowWinnerMessage] = useState(false);
  const [winnerText, setWinnerText] = useState('');
  const [showInstructions, setShowInstructions] = useState(true); // New state for instruction modal

  const detectTouchCapability = () => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    inputCapabilityRef.current.isTouchDevice = hasTouch;
    inputCapabilityRef.current.mouseControlEnabled = !hasTouch;
    console.log('Touch device detected:', hasTouch);
  };

  const initializeGame = (canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Initialize paddle positions
    gameObjectsRef.current.leftPaddle.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    gameObjectsRef.current.rightPaddle.x = canvas.width - 45;
    gameObjectsRef.current.rightPaddle.y = canvas.height / 2 - PADDLE_HEIGHT / 2;

    // Initialize ball position and velocity
    resetBall(canvas);
  };

  const resetBall = (canvas: HTMLCanvasElement) => {
    gameObjectsRef.current.ball.x = canvas.width / 2;
    gameObjectsRef.current.ball.y = canvas.height / 2;

    // Random initial direction
    const direction = Math.random() > 0.5 ? 1 : -1;
    gameObjectsRef.current.ball.vx = BALL_SPEED * direction;
    gameObjectsRef.current.ball.vy = (Math.random() - 0.5) * BALL_SPEED;
    gameStateRef.current.ballOutOfPlay = false; // Allow scoring again
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
    // Don't update ball if game is over
    if (gameStateRef.current.gameOver) return;

    const { ball } = gameObjectsRef.current;

    // Update ball position
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top and bottom walls
    if (ball.y <= ball.radius || ball.y >= canvas.height - ball.radius) {
      ball.vy = -ball.vy;
      // Keep ball within bounds
      ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }

    // Paddle collision detection
    const { leftPaddle, rightPaddle } = gameObjectsRef.current;

    // Left paddle collision
    if (ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
        ball.x + ball.radius >= leftPaddle.x &&
        ball.y >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height &&
        ball.vx < 0) {
      ball.vx = -ball.vx;
      // Add some vertical velocity based on where ball hits paddle
      const hitPosition = (ball.y - (leftPaddle.y + leftPaddle.height / 2)) / (leftPaddle.height / 2);
      ball.vy += hitPosition * 2;
      // Keep ball outside paddle
      ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
    }

    // Right paddle collision
    if (ball.x + ball.radius >= rightPaddle.x &&
        ball.x - ball.radius <= rightPaddle.x + rightPaddle.width &&
        ball.y >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height &&
        ball.vx > 0) {
      ball.vx = -ball.vx;
      // Add some vertical velocity based on where ball hits paddle
      const hitPosition = (ball.y - (rightPaddle.y + rightPaddle.height / 2)) / (rightPaddle.height / 2);
      ball.vy += hitPosition * 2;
      // Keep ball outside paddle
      ball.x = rightPaddle.x - ball.radius;
    }

    // Scoring logic
    if (!gameStateRef.current.ballOutOfPlay) { // Check if ball is not already marked as out of play
      if (ball.x + ball.radius < 0) {
        // Ball passed left paddle, right player scores
        gameStateRef.current.ballOutOfPlay = true; // Mark ball as out of play to prevent multiple scores
        setScores(prev => {
          const newScores = { ...prev, right: prev.right + 1 };
          console.log('Right player scored! New scores:', newScores);

          // Check win condition
        if (newScores.right >= WINNING_SCORE) {
          gameStateRef.current.gameOver = true;
          gameStateRef.current.winner = 'right';
          gameStateRef.current.isPlaying = false;
          setWinnerText('PLAYER 2 WINS!');
          setShowWinnerMessage(true);
          transitionToWheelOfFortune();
        } else {
          // Reset ball after 1 second if game continues
          if (gameStateRef.current.ballResetTimer) {
            clearTimeout(gameStateRef.current.ballResetTimer);
          }
          gameStateRef.current.ballResetTimer = setTimeout(() => resetBall(canvas), 1000);
        }

        return newScores;
      });
    } else if (ball.x - ball.radius > canvas.width) {
      // Ball passed right paddle, left player scores
      gameStateRef.current.ballOutOfPlay = true; // Mark ball as out of play to prevent multiple scores
      setScores(prev => {
        const newScores = { ...prev, left: prev.left + 1 };
        console.log('Left player scored! New scores:', newScores);

        // Check win condition
        if (newScores.left >= WINNING_SCORE) {
          gameStateRef.current.gameOver = true;
          gameStateRef.current.winner = 'left';
          gameStateRef.current.isPlaying = false;
          setWinnerText('PLAYER 1 WINS!');
          setShowWinnerMessage(true);
          transitionToWheelOfFortune();
        } else {
          // Reset ball after 1 second if game continues
          if (gameStateRef.current.ballResetTimer) {
            clearTimeout(gameStateRef.current.ballResetTimer);
          }
          gameStateRef.current.ballResetTimer = setTimeout(() => resetBall(canvas), 1000);
        }

        return newScores;
      });
    } // This closing brace for if (!gameStateRef.current.ballOutOfPlay)
  } // This closing brace for the outer if (!gameStateRef.current.ballOutOfPlay) was removed.

  const updatePaddles = (canvas: HTMLCanvasElement) => {
    const { leftPaddle, rightPaddle } = gameObjectsRef.current;

    // Keep paddles within bounds
    leftPaddle.y = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, leftPaddle.y));
    rightPaddle.y = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, rightPaddle.y));
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStateRef.current.isPlaying || gameStateRef.current.gameOver) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateBall(canvas);
    updatePaddles(canvas);
    drawGame(ctx, canvas.width, canvas.height);

    gameStateRef.current.animationId = requestAnimationFrame(gameLoop);
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    inputCapabilityRef.current.touchActive = true;
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
    inputCapabilityRef.current.touchActive = true;
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

    // Check if all touches have ended
    if (!touchStateRef.current.leftTouch && !touchStateRef.current.rightTouch) {
      // Small delay to allow for quick touch sequences
      setTimeout(() => {
        inputCapabilityRef.current.touchActive = false;
      }, 100);
    }
  };

  // Mouse event handlers for testing purposes
  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only use mouse control if touch is not active and mouse control is enabled
    if (inputCapabilityRef.current.touchActive || !inputCapabilityRef.current.mouseControlEnabled) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Control left paddle with mouse on left half
    if (x < canvas.width / 2) {
      gameObjectsRef.current.leftPaddle.y = Math.max(0,
        Math.min(canvas.height - PADDLE_HEIGHT, y - PADDLE_HEIGHT / 2));
    }
    // Control right paddle with mouse on right half
    else {
      gameObjectsRef.current.rightPaddle.y = Math.max(0,
        Math.min(canvas.height - PADDLE_HEIGHT, y - PADDLE_HEIGHT / 2));
    }
  };

  const handleMouseEnter = () => {
    // Enable mouse control only if not a touch device and touch is not active
    if (!inputCapabilityRef.current.isTouchDevice && !inputCapabilityRef.current.touchActive) {
      inputCapabilityRef.current.mouseControlEnabled = true;
    }
  };

  const handleMouseLeave = () => {
    // Disable mouse control when mouse leaves canvas
    inputCapabilityRef.current.mouseControlEnabled = false;
  };

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset game state
    gameStateRef.current.isPlaying = true;
    setShowInstructions(false); // Hide instructions modal
    gameStateRef.current.gameOver = false;
    gameStateRef.current.winner = null;
    gameStateRef.current.ballOutOfPlay = false; // Reset flag
    setShowWinnerMessage(false);
    setWinnerText('');

    // Clear any existing ball reset timer
    if (gameStateRef.current.ballResetTimer) {
      clearTimeout(gameStateRef.current.ballResetTimer);
      gameStateRef.current.ballResetTimer = null;
    }

    initializeGame(canvas);
    gameLoop();
  };

  const stopGame = () => {
    gameStateRef.current.isPlaying = false;
    // gameStateRef.current.gameOver = false; // Don't reset gameOver here, it's set by winning condition
    if (!gameStateRef.current.gameOver) { // Only show instructions if game is not over
      setShowInstructions(true); // Show instructions if game stopped manually and not game over
    }
    if (gameStateRef.current.animationId) {
      cancelAnimationFrame(gameStateRef.current.animationId);
    }
    if (gameStateRef.current.ballResetTimer) {
      clearTimeout(gameStateRef.current.ballResetTimer);
      gameStateRef.current.ballResetTimer = null;
    }
  };

  const transitionToWheelOfFortune = () => {
    // Stop the game loop
    if (gameStateRef.current.animationId) {
      cancelAnimationFrame(gameStateRef.current.animationId);
    }

    // Clear any ball reset timer
    if (gameStateRef.current.ballResetTimer) {
      clearTimeout(gameStateRef.current.ballResetTimer);
      gameStateRef.current.ballResetTimer = null;
    }

    // After 3 seconds, transition to the wheel of fortune
    setTimeout(() => {
      // Reset game state for potential future games
      setScores({ left: 0, right: 0 });
      setShowWinnerMessage(false);
      setWinnerText('');
      gameStateRef.current.gameOver = false;
      gameStateRef.current.winner = null;
      gameStateRef.current.isPlaying = false;

      // Transition to Wheel of Fortune
      onTransitionToWheelOfFortune();
    }, 3000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect touch capability on initialization
    detectTouchCapability();

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

    // Add mouse event listeners for testing (conditional)
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      stopGame();
    };
  }, []);

  return (
    <div
      className="h-full w-full flex flex-col relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/game-background.png')" }}
    >
      {/* Fallback background color if image fails to load or for transparency in image */}
      <div className="absolute inset-0 bg-slate-900 opacity-75 -z-10"></div>

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
          <div className="text-lg text-slate-400 mt-2">First to {WINNING_SCORE} points wins!</div>
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

        {/* Winner Message Overlay */}
        {showWinnerMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-none z-20">
            <div className="text-center">
              <div className="text-6xl md:text-8xl font-bold text-white mb-4 animate-pulse">
                🏆
              </div>
              <div className="text-4xl md:text-6xl font-bold text-white mb-6">
                {winnerText}
              </div>
              <div className="text-2xl md:text-3xl text-slate-300 mb-4">
                Congratulations!
              </div>
              <div className="text-lg md:text-xl text-slate-400">
                Transitioning to next phase...
              </div>
            </div>
          </div>
        )}

        {/* Game Instructions Overlay - Controlled by showInstructions and showWinnerMessage */}
        {showInstructions && !showWinnerMessage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm px-8 py-6 rounded-2xl border border-slate-500/30 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Play!</div>
              <div className="text-lg md:text-xl text-slate-300 mb-2">Left Player: Use LEFT side of screen</div>
              <div className="text-lg md:text-xl text-slate-300 mb-4">Right Player: Use RIGHT side of screen</div>
              <div className="text-base md:text-lg text-slate-400 mb-2">
                {inputCapabilityRef.current.isTouchDevice ? 'Touch and drag to move your paddle' : 'Move mouse to control paddles'}
              </div>
              <div className="text-base md:text-lg text-amber-400 font-semibold">First to {WINNING_SCORE} points wins!</div>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="p-6 flex justify-center space-x-6">
        <button
          onClick={onBackToSelection}
          className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors border border-slate-600"
          disabled={showWinnerMessage}
        >
          Back to Games
        </button>
        <button
          onClick={gameStateRef.current.isPlaying ? stopGame : startGame}
          className="bg-green-600 hover:bg-green-500 text-white px-12 py-4 rounded-xl text-2xl font-bold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={showWinnerMessage}
        >
          {gameStateRef.current.isPlaying ? 'STOP GAME' : 'START GAME'}
        </button>
      </div>
    </div>
  );
};

export default PaddleBallGame;
