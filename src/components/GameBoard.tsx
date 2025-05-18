import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronRight, Trophy } from "lucide-react";
import Block from "./Block";
import LevelComplete from "./LevelComplete";
import { tutorialLevels } from "../utils/levels";
import { generateLevel } from "../utils/levelGenerator";
import { useIsMobile } from "@/hooks/use-mobile";

// Constants for game configuration
const GRID_SIZE = 6;
const BLOCK_SIZE = 60; // Size of each block in pixels
const CELL_GAP = 4; // Gap between cells in pixels

export interface BlockData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "horizontal" | "vertical" | "key";
  isMoving?: boolean;
}

interface GameBoardProps {
  initialLevel?: number | null;
}

const GameBoard: React.FC<GameBoardProps> = ({ initialLevel = null }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [level, setLevel] = useState(1);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [draggedBlock, setDraggedBlock] = useState<BlockData | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  
  const adjustSizeForMobile = () => {
    if (isMobile) {
      return {
        blockSize: 50,
        cellGap: 3,
      };
    }
    return {
      blockSize: BLOCK_SIZE,
      cellGap: CELL_GAP,
    };
  };
  
  const { blockSize, cellGap } = adjustSizeForMobile();
  
  const boardSize = GRID_SIZE * blockSize + (GRID_SIZE + 1) * cellGap;

  // Load a level
  const loadLevel = useCallback((levelNumber: number) => {
    setIsLevelComplete(false);
    setMoves(0);
    
    // Update highest level in localStorage
    const storedHighestLevel = localStorage.getItem("highestLevel");
    const currentHighestLevel = storedHighestLevel ? parseInt(storedHighestLevel, 10) : 1;
    if (levelNumber > currentHighestLevel) {
      localStorage.setItem("highestLevel", levelNumber.toString());
    }
    
    if (levelNumber <= tutorialLevels.length) {
      // Load tutorial level
      setBlocks(JSON.parse(JSON.stringify(tutorialLevels[levelNumber - 1])));
    } else {
      // Generate random level
      const difficulty = Math.min(Math.floor((levelNumber - tutorialLevels.length) / 3) + 1, 5);
      const newBlocks = generateLevel(GRID_SIZE, difficulty);
      setBlocks(newBlocks);
    }
  }, []);

  // Initialize the game
  useEffect(() => {
    if (!gameStarted) {
      // Use initialLevel if provided, otherwise use level state
      const levelToLoad = initialLevel || level;
      setLevel(levelToLoad);
      loadLevel(levelToLoad);
      setGameStarted(true);
    }
  }, [gameStarted, level, initialLevel, loadLevel]);

  // Check for win condition
  useEffect(() => {
    if (blocks.length === 0) return;
    
    const keyBlock = blocks.find(block => block.type === "key");
    if (keyBlock && keyBlock.x + keyBlock.width >= GRID_SIZE) {
      // Win condition: key block reaches the exit
      setTimeout(() => {
        // Save completed level
        const completedLevels = localStorage.getItem("completedLevels");
        const parsedCompletedLevels = completedLevels ? JSON.parse(completedLevels) : [];
        
        if (!parsedCompletedLevels.includes(level)) {
          parsedCompletedLevels.push(level);
          localStorage.setItem("completedLevels", JSON.stringify(parsedCompletedLevels));
        }
        
        setIsLevelComplete(true);
      }, 300);
    }
  }, [blocks, level]);

  // Handle restart button
  const handleRestart = () => {
    loadLevel(level);
    toast({
      title: "Level Restarted",
      description: "Let's try again!",
    });
  };

  // Handle next level
  const handleNextLevel = () => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    loadLevel(nextLevel);
    setIsLevelComplete(false);
  };

  // Check if a move is valid
  const isValidMove = (block: BlockData, newX: number, newY: number): boolean => {
    // Check boundaries
    if (newX < 0 || newY < 0 || 
        newX + block.width > GRID_SIZE || 
        newY + block.height > GRID_SIZE) {
      return false;
    }
    
    // Check collision with other blocks
    for (const otherBlock of blocks) {
      if (otherBlock.id === block.id) continue;
      
      // Check for collision
      if (!(newX + block.width <= otherBlock.x || 
            newX >= otherBlock.x + otherBlock.width ||
            newY + block.height <= otherBlock.y ||
            newY >= otherBlock.y + otherBlock.height)) {
        return false;
      }
    }
    
    return true;
  };

  // Handle pointer down event
  const handlePointerDown = (e: React.PointerEvent, block: BlockData) => {
    e.preventDefault();
    setDraggedBlock({ ...block, isMoving: true });
    setDragStartPosition({ 
      x: e.clientX, 
      y: e.clientY 
    });
    
    // Update the blocks state to show the block is being moved
    setBlocks(prev => 
      prev.map(b => 
        b.id === block.id ? { ...b, isMoving: true } : b
      )
    );
    
    // Capture pointer to track moves outside the element
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Handle pointer move event
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedBlock) return;
    
    const deltaX = e.clientX - dragStartPosition.x;
    const deltaY = e.clientY - dragStartPosition.y;
    
    // Determine the movement based on block type
    const isHorizontal = draggedBlock.type === "horizontal" || draggedBlock.type === "key";
    const isVertical = draggedBlock.type === "vertical";
    
    // Calculate grid cells to move (rounded to nearest cell)
    const cellsToMoveX = isHorizontal ? Math.round(deltaX / (blockSize + cellGap)) : 0;
    const cellsToMoveY = isVertical ? Math.round(deltaY / (blockSize + cellGap)) : 0;
    
    // Calculate new position
    const newX = draggedBlock.x + cellsToMoveX;
    const newY = draggedBlock.y + cellsToMoveY;
    
    // Check if the move is valid
    if ((cellsToMoveX !== 0 || cellsToMoveY !== 0) && 
        isValidMove(draggedBlock, newX, newY)) {
      
      // Update the block position
      setBlocks(prev => 
        prev.map(b => 
          b.id === draggedBlock.id ? { ...b, x: newX, y: newY, isMoving: true } : b
        )
      );
      
      // Update drag start position
      setDragStartPosition({ 
        x: e.clientX, 
        y: e.clientY 
      });
      
      // Update dragged block
      setDraggedBlock({ ...draggedBlock, x: newX, y: newY });
      
      // Count as a move if actually moved
      if (cellsToMoveX !== 0 || cellsToMoveY !== 0) {
        setMoves(prev => prev + 1);
      }
    }
  };

  // Handle pointer up event
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggedBlock) return;
    
    // Release pointer capture
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    // Update the blocks state to show the block is no longer being moved
    setBlocks(prev => 
      prev.map(b => 
        b.id === draggedBlock.id ? { ...draggedBlock, isMoving: false } : b
      )
    );
    
    setDraggedBlock(null);
  };

  const exitCellStyle = {
    position: "absolute" as const,
    right: -cellGap,
    top: 2 * blockSize + 3 * cellGap,
    width: cellGap * 2,
    height: blockSize,
    background: "rgba(255, 215, 0, 0.2)",
    boxShadow: "inset 0 0 5px rgba(255, 215, 0, 0.8)",
    borderRadius: "2px",
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Game info section */}
      <div className="w-full flex justify-between items-center mb-4 px-4">
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
        
        {/* Exit marker */}
        <div style={exitCellStyle}></div>
        
        {/* Blocks */}
        {blocks.map((block) => (
          <Block
            key={block.id}
            block={block}
            blockSize={blockSize}
            cellGap={cellGap}
            onPointerDown={(e) => handlePointerDown(e, block)}
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
