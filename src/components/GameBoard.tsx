
import React, { useState } from "react";
import Block from "./Block";
import LevelComplete from "./LevelComplete";
import { RefreshCw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockData, GameBoardProps } from "../types/gameTypes";
import useGameLogic from "../hooks/useGameLogic";
import { useIsMobile } from "@/hooks/use-mobile";

// Constants for game configuration
const GRID_SIZE = 6;
const DESKTOP_BLOCK_SIZE = 60; // Size of each block in pixels for desktop
const DESKTOP_CELL_GAP = 4; // Gap between cells in pixels for desktop
const MOBILE_BLOCK_SIZE = 50; // Size for mobile
const MOBILE_CELL_GAP = 3; // Gap for mobile

const GameBoard: React.FC<GameBoardProps> = ({ initialLevel = null }) => {
  const isMobile = useIsMobile();
  
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
    width: cellGap * 2,
    height: blockSize,
    background: "rgba(255, 215, 0, 0.2)",
    boxShadow: "inset 0 0 5px rgba(255, 215, 0, 0.8)",
    borderRadius: "2px",
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Game info section */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <div className="flex items-center space-x-2 bg-[#FEF7CD] p-2 rounded-lg shadow-md">
          <Trophy size={16} className="text-[#ea384c]" />
          <span className="font-medium">
            Level: {level}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 bg-[#FEF7CD] p-2 rounded-lg shadow-md">
          <span className="font-medium">Moves: {moves}</span>
        </div>
        
        <Button 
          variant="outline"
          size="icon"
          onClick={handleRestart}
          className="shadow-md bg-[#FEC6A1] hover:bg-[#FEC6A1]/90 border-none"
        >
          <RefreshCw size={18} />
        </Button>
      </div>
      
      {/* Game board */}
      <div 
        className="relative bg-[#1A1F2C]/95 rounded-lg shadow-lg"
        style={{ 
          width: `${boardSize}px`, 
          height: `${boardSize}px`,
          padding: `${cellGap}px`
        }}
      >
        {/* Grid cells background */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          return (
            <div
              key={`cell-${x}-${y}`}
              className="absolute bg-[#F1F0FB]/10 rounded-sm"
              style={{
                left: x * (blockSize + cellGap) + cellGap,
                top: y * (blockSize + cellGap) + cellGap,
                width: `${blockSize}px`,
                height: `${blockSize}px`,
              }}
            />
          );
        })}
        
        {/* Exit marker - fixed at row 2 */}
        <div style={exitCellStyle}></div>
        
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
      </div>
      
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
