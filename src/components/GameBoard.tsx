
import React, { useState } from "react";
import Block from "./Block";
import LevelComplete from "./LevelComplete";
import GameControls from "./GameControls";
import { RefreshCw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockData, GameBoardProps } from "../types/gameTypes";
import useGameLogic from "../hooks/useGameLogic";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useSoundEffects } from "../utils/soundEffects";

// Constants for game configuration
const GRID_SIZE = 6;
const DESKTOP_BLOCK_SIZE = 60; // Size of each block in pixels for desktop
const DESKTOP_CELL_GAP = 4; // Gap between cells in pixels for desktop
const MOBILE_BLOCK_SIZE = 50; // Size for mobile
const MOBILE_CELL_GAP = 3; // Gap for mobile

const GameBoard: React.FC<GameBoardProps> = ({ initialLevel = null }) => {
  const isMobile = useIsMobile();
  const { playSound, toggleSound, isSoundEnabled } = useSoundEffects();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  
  const {
    blocks,
    level,
    moves,
    isLevelComplete,
    handleRestart,
    handleNextLevel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useGameLogic(initialLevel);

  // Adjust sizes based on device
  const blockSize = isMobile ? MOBILE_BLOCK_SIZE : DESKTOP_BLOCK_SIZE;
  const cellGap = isMobile ? MOBILE_CELL_GAP : DESKTOP_CELL_GAP;
  
  const boardSize = GRID_SIZE * blockSize + (GRID_SIZE + 1) * cellGap;

  const exitCellStyle = {
    position: "absolute" as const,
    right: -cellGap,
    top: 2 * blockSize + 3 * cellGap, // Fixed exit at row 2
    width: cellGap * 3,
    height: blockSize,
  };
  
  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    playSound('BUTTON_CLICK');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Game controls section */}
      <div className="w-full flex justify-between items-center mb-1">
        <GameControls 
          level={level}
          moves={moves}
          onRestart={handleRestart}
        />
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="ml-2"
        >
          <Button 
            variant="outline"
            size="icon"
            onClick={handleToggleSound}
            className="shadow-md bg-[#FCD34D]/30 hover:bg-[#FCD34D]/50 border-none"
            title={soundOn ? "Mute sound" : "Enable sound"}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
        </motion.div>
      </div>
      
      {/* Game board container with improved styling */}
      <motion.div
        className="relative bg-[#1A1F2C]/95 rounded-2xl overflow-hidden shadow-xl border border-white/10"
        style={{ 
          width: `${boardSize}px`, 
          height: `${boardSize}px`,
          padding: `${cellGap}px`
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Grid pattern background */}
        <div className="absolute inset-0 grid"
          style={{
            backgroundImage: `linear-gradient(to right, #F1F0FB/5 1px, transparent 1px), 
                            linear-gradient(to bottom, #F1F0FB/5 1px, transparent 1px)`,
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
              className="absolute bg-[#F1F0FB]/5 rounded-sm"
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
        
        {/* Exit marker - fixed at row 2 with better visual */}
        <motion.div 
          style={exitCellStyle}
          className="bg-[#FCD34D]/20 rounded-l-md flex items-center justify-center border-l border-[#FCD34D]/40"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <motion.div 
            className="h-1/2 border-dotted border-l-2 border-[#FCD34D]/60 mr-1"
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>
        
        {/* Blocks */}
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
      
      {/* Game instructions */}
      <motion.div 
        className="mt-4 text-center max-w-xs text-sm text-[#1A1F2C]/70 bg-white/30 p-2 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p>Slide blocks to help the hamster escape through the exit!</p>
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
  );
};

export default GameBoard;
