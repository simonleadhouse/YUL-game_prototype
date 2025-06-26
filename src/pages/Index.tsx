
import { useState, useEffect } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import ConfirmationScreen from '../components/ConfirmationScreen';
import GameSelectionScreen from '../components/GameSelectionScreen';
import PaddleBallGame from '../components/PaddleBallGame';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'confirmation' | 'game-selection' | 'paddle-ball'>('welcome');
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
    setCurrentScreen('game-selection');
  };

  const handleCancel = () => {
    handleUserInteraction();
    setCurrentScreen('welcome');
  };

  const handleGameSelect = (gameId: string) => {
    handleUserInteraction();
    if (gameId === 'paddle-ball') {
      setCurrentScreen('paddle-ball');
    }
  };

  const handleBackToSelection = () => {
    handleUserInteraction();
    setCurrentScreen('game-selection');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onTapToPlay={handleTapToPlay} />
      )}
      {currentScreen === 'confirmation' && (
        <ConfirmationScreen onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
      {currentScreen === 'game-selection' && (
        <GameSelectionScreen onUserInteraction={handleUserInteraction} onGameSelect={handleGameSelect} />
      )}
      {currentScreen === 'paddle-ball' && (
        <PaddleBallGame onBackToSelection={handleBackToSelection} />
      )}
    </div>
  );
};

export default Index;
