
import { useState, useEffect } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import ConfirmationScreen from '../components/ConfirmationScreen';
// import GameSelectionScreen from '../components/GameSelectionScreen'; // Removed
import PaddleBallGame from '../components/PaddleBallGame';
import WheelOfFortune from '../components/WheelOfFortune';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'confirmation' /* | 'game-selection' */ | 'paddle-ball' | 'wheel-of-fortune'>('welcome');
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Idle timeout - reset to welcome screen after 60 seconds of inactivity
  useEffect(() => {
    const checkIdleTimeout = () => {
      const now = Date.now();
      if (now - lastInteraction > 60000 && currentScreen !== 'welcome') {
        setCurrentScreen('welcome');
      }
    };

    const interval = setInterval(checkIdleTimeout, 1000);
    return () => clearInterval(interval);
  }, [lastInteraction, currentScreen]);

  const handleUserInteraction = () => {
    setLastInteraction(Date.now());
  };

  const handleTapToPlay = () => {
    handleUserInteraction();
    setCurrentScreen('confirmation');
  };

  const handleConfirm = () => {
    handleUserInteraction();
    // setCurrentScreen('game-selection'); // Skip game selection
    setCurrentScreen('paddle-ball'); // Go directly to paddle-ball
  };

  const handleCancel = () => {
    handleUserInteraction();
    setCurrentScreen('welcome');
  };

  // const handleGameSelect = (gameId: string) => { // No longer needed
  //   handleUserInteraction();
  //   if (gameId === 'paddle-ball') {
  //     setCurrentScreen('paddle-ball');
  //   }
  // };

  const handleBackToSelection = () => {
    handleUserInteraction();
    // setCurrentScreen('game-selection'); // Should go back to welcome or a new main menu if implemented
    setCurrentScreen('welcome'); // For now, go back to welcome
  };

  const handleTransitionToWheelOfFortune = () => {
    handleUserInteraction();
    setCurrentScreen('wheel-of-fortune');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative">
      {/* Logo Placeholder - Top Left */}
      <img
        src="/assets/logo.png"
        alt="Company Logo"
        className="absolute top-4 left-4 w-24 h-auto z-50" // Adjust w-24 (width) as needed
        onError={(e) => { e.currentTarget.style.display = 'none'; console.warn("Logo not found at /assets/logo.png. Please place your logo there.") }}
      />
      {currentScreen === 'welcome' && (
        <WelcomeScreen onTapToPlay={handleTapToPlay} />
      )}
      {currentScreen === 'confirmation' && (
        <ConfirmationScreen onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
      {/* {currentScreen === 'game-selection' && ( // Removed
        <GameSelectionScreen onUserInteraction={handleUserInteraction} onGameSelect={handleGameSelect} />
      )} */}
      {currentScreen === 'paddle-ball' && (
        <PaddleBallGame onBackToSelection={handleBackToSelection} onTransitionToWheelOfFortune={handleTransitionToWheelOfFortune} />
      )}
      {currentScreen === 'wheel-of-fortune' && (
        <WheelOfFortune onBackToSelection={handleBackToSelection} />
      )}
    </div>
  );
};

export default Index;
