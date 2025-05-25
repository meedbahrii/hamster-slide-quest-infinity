import React, { useState, useEffect } from "react";
import Block from "./Block";
import LevelComplete from "./LevelComplete";
import GameControls from "./GameControls";
import AchievementNotification from "./AchievementNotification";
import SettingsMenu from "./SettingsMenu";
import OnboardingTutorial from "./OnboardingTutorial";
import EnhancedLevelSelector from "./EnhancedLevelSelector";
import { RefreshCw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockData, GameBoardProps } from "../types/gameTypes";
import useGameLogic from "../hooks/useGameLogic";
import { useDeviceInfo } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useSoundEffects } from "../utils/soundEffects";
import { checkAchievements, Achievement } from "../utils/achievements";
import { getStatistics } from "../utils/statistics";
import { completeDailyChallenge } from "../utils/dailyChallenge";
import { Capacitor } from "@capacitor/core";
import ParticleEffects from "./ParticleEffects";
import LevelEditor from "./LevelEditor";
import InteractiveTutorial from "./InteractiveTutorial";
import ErrorBoundary from "./ErrorBoundary";
import { useGameStore } from "../store/gameStore";
import { ParticleEffect } from "../types/enhancedGameTypes";
import { offlineManager } from "../utils/offlineSupport";

// Constants for game configuration
const GRID_SIZE = 6;
const DESKTOP_BLOCK_SIZE = 60;
const DESKTOP_CELL_GAP = 4;
const MOBILE_BLOCK_SIZE = 50;
const MOBILE_CELL_GAP = 3;
const TABLET_BLOCK_SIZE = 55;

const GameBoard: React.FC<GameBoardProps> = ({ initialLevel = null }) => {
  const deviceInfo = useDeviceInfo();
  const { playSound, toggleSound, isSoundEnabled } = useSoundEffects();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Check if running as native app
  useEffect(() => {
    setIsNativeApp(Capacitor.isNativePlatform());
  }, []);
  
  const {
    blocks,
    level,
    moves,
    hintsUsed,
    undosUsed,
    isLevelComplete,
    canUndo,
    handleRestart,
    handleNextLevel,
    handleHint,
    handleUndo,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useGameLogic(initialLevel);

  // New state for enhanced features
  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);
  const currentTheme = useGameStore((state) => state.currentTheme);
  const isOffline = useGameStore((state) => state.isOffline);
  
  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('gameTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Cache levels for offline support
  useEffect(() => {
    if (blocks.length > 0) {
      offlineManager.cacheLevel(level, blocks);
    }
  }, [blocks, level]);

  // Add particle effects on level completion
  useEffect(() => {
    if (isLevelComplete) {
      const exitPosition = { x: boardSize - 50, y: 2 * blockSize + 3 * cellGap + blockSize / 2 };
      
      // Add confetti effect
      setParticleEffects(prev => [...prev, {
        type: 'confetti',
        position: exitPosition,
        color: '#FBBF24',
        duration: 2000
      }]);
      
      // Add stars effect
      setTimeout(() => {
        setParticleEffects(prev => [...prev, {
          type: 'stars',
          position: exitPosition,
          color: '#F59E0B',
          duration: 1500
        }]);
      }, 500);
    }
  }, [isLevelComplete, boardSize, blockSize, cellGap]);

  const handleParticleComplete = (effect: ParticleEffect) => {
    setParticleEffects(prev => prev.filter(e => e !== effect));
  };

  // Check for achievements and daily challenge completion
  useEffect(() => {
    if (isLevelComplete) {
      const stats = getStatistics();
      const achievements = checkAchievements(stats);
      if (achievements.length > 0) {
        setNewAchievements(achievements);
      }

      // Check if this was a daily challenge
      const dailyChallenge = completeDailyChallenge(moves);
      if (dailyChallenge) {
        // Could add special celebration for daily challenge completion
        console.log('Daily challenge completed!', dailyChallenge);
      }
    }
  }, [isLevelComplete, moves]);

  // Adjust sizes based on device
  let blockSize = DESKTOP_BLOCK_SIZE;
  let cellGap = DESKTOP_CELL_GAP;
  
  if (deviceInfo.isMobile || isNativeApp) {
    blockSize = MOBILE_BLOCK_SIZE;
    cellGap = MOBILE_CELL_GAP;
  } else if (deviceInfo.isTablet) {
    blockSize = TABLET_BLOCK_SIZE;
    cellGap = DESKTOP_CELL_GAP;
  }
  
  const boardSize = GRID_SIZE * blockSize + (GRID_SIZE + 1) * cellGap;

  const exitCellStyle = {
    position: "absolute" as const,
    right: -cellGap,
    top: 2 * blockSize + 3 * cellGap,
    width: cellGap * 3,
    height: blockSize,
  };
  
  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    playSound('BUTTON_CLICK');
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
  };

  const handleLevelSelect = (selectedLevel: number) => {
    // This would need to be implemented in the game logic
    console.log('Level selected:', selectedLevel);
  };

  const handleDailyChallengeSelect = () => {
    // This would need to be implemented in the game logic
    console.log('Daily challenge selected');
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  // Apply theme-based styling
  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'ocean':
        return { primary: '#0EA5E9', secondary: '#0284C7', accent: '#38BDF8' };
      case 'forest':
        return { primary: '#10B981', secondary: '#059669', accent: '#34D399' };
      case 'sunset':
        return { primary: '#F97316', secondary: '#EA580C', accent: '#FB923C' };
      case 'lavender':
        return { primary: '#A855F7', secondary: '#9333EA', accent: '#C084FC' };
      default:
        return { primary: '#FCD34D', secondary: '#F59E0B', accent: '#FDE68A' };
    }
  };

  const themeColors = getThemeColors(currentTheme);

  // Add meta tag for mobile viewport if not present
  React.useEffect(() => {
    // Check if viewport meta tag exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    // If it doesn't exist, create it
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.getElementsByTagName('head')[0].appendChild(viewportMeta);
    }
    
    // Set proper content for responsive design
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    
    // Set orientation to portrait if in native app
    if (isNativeApp) {
      try {
        // Check if screen orientation API is available and use it safely
        const screen = window.screen as any;
        if (screen?.orientation?.lock) {
          screen.orientation.lock('portrait').catch((err: any) => {
            console.log('Orientation lock failed:', err);
          });
        } else {
          console.log('Orientation lock not supported on this device');
        }
      } catch (error) {
        console.log('Error with orientation lock:', error);
      }
    }
    
    // Return cleanup function
    return () => {
      // No need to remove the meta tag on cleanup
    };
  }, [isNativeApp]);

  const nativeAppClass = isNativeApp ? "pt-safe-top pb-safe-bottom px-safe" : "";

  return (
    <ErrorBoundary>
      <div className={`flex flex-col items-center w-full max-w-md ${nativeAppClass}`}>
        {/* Interactive Tutorial */}
        <InteractiveTutorial
          onComplete={() => console.log('Interactive tutorial completed')}
          gameBlocks={blocks}
          onMoveBlock={(blockId, direction) => {
            // Handle guided moves during tutorial
            console.log('Tutorial move:', blockId, direction);
          }}
        />
        
        {/* Level Editor */}
        <LevelEditor />
        
        {/* Achievement notifications */}
        <AchievementNotification
          achievements={newAchievements}
          onClose={() => setNewAchievements([])}
        />
        
        {/* Offline indicator */}
        {isOffline && (
          <motion.div 
            className="w-full mb-2 bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-2 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-yellow-400 text-sm">📴 Playing offline</span>
          </motion.div>
        )}
        
        {/* Header with level info */}
        <motion.div 
          className="w-full mb-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-white">
              <h2 className="text-lg font-bold">Hamster Escape</h2>
              <p className="text-sm text-gray-300">Guide the hamster 🐹 to freedom!</p>
            </div>
            <div className="text-yellow-400 text-2xl">🐹</div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">Level {level}</span>
            <span className="text-gray-300">Moves: {moves}</span>
            <div className="flex gap-2">
              <SettingsMenu onThemeChange={handleThemeChange} />
              <Button 
                variant="outline"
                size="icon"
                onClick={handleToggleSound}
                className="bg-gray-600 hover:bg-gray-500 border-gray-500 text-white"
              >
                {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced game controls section */}
        <div className="w-full flex justify-between items-center mb-4">
          <EnhancedLevelSelector
            currentLevel={level}
            onLevelSelect={handleLevelSelect}
            onDailyChallengeSelect={handleDailyChallengeSelect}
          />
          
          <GameControls 
            level={level}
            moves={moves}
            hintsUsed={hintsUsed}
            undosUsed={undosUsed}
            canUndo={canUndo}
            onRestart={handleRestart}
            onHint={handleHint}
            onUndo={handleUndo}
          />
        </div>
        
        {/* Game board container with enhanced styling */}
        <motion.div
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700"
          style={{ 
            width: `${boardSize}px`, 
            height: `${boardSize}px`,
            padding: `${cellGap}px`,
            touchAction: "none"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Particle Effects Layer */}
          <ParticleEffects 
            effects={particleEffects}
            onEffectComplete={handleParticleComplete}
          />
          
          {/* Grid pattern background */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #374151 1px, transparent 1px), 
                              linear-gradient(to bottom, #374151 1px, transparent 1px)`,
              backgroundSize: `${blockSize + cellGap}px ${blockSize + cellGap}px`,
              backgroundPosition: `${cellGap}px ${cellGap}px`
            }}
          />
          
          {/* Grid cells background */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            return (
              <motion.div
                key={`cell-${x}-${y}`}
                className="absolute bg-gray-700/30 rounded-lg border border-gray-600/20"
                style={{
                  left: x * (blockSize + cellGap) + cellGap,
                  top: y * (blockSize + cellGap) + cellGap,
                  width: `${blockSize}px`,
                  height: `${blockSize}px`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.01 * index }}
              />
            );
          })}
          
          {/* Exit marker with enhanced animation */}
          <motion.div 
            style={exitCellStyle}
            className="rounded-l-xl flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-lg"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <motion.div 
              className="text-white text-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                ease: "easeInOut",
                repeatDelay: 1
              }}
            >
              🚪
            </motion.div>
          </motion.div>
          
          {/* Blocks with enhanced rendering */}
          {blocks.map((block) => (
            <Block
              key={block.id}
              block={block}
              blockSize={blockSize}
              cellGap={cellGap}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          ))}
        </motion.div>
        
        {/* Level complete overlay */}
        {isLevelComplete && (
          <LevelComplete 
            level={level} 
            moves={moves} 
            onNextLevel={handleNextLevel} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default GameBoard;
