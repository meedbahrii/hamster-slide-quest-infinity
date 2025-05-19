
import { useState, useEffect, useCallback } from "react";
import { BlockData, GameState } from "../types/gameTypes";
import { tutorialLevels } from "../utils/levels";
import { generateLevel } from "../utils/levelGenerator";
import { useToast } from "@/hooks/use-toast";
import { useSoundEffects } from "../utils/soundEffects";

// Constants
const GRID_SIZE = 6;

export const useGameLogic = (initialLevel: number | null = null) => {
  const { toast } = useToast();
  const { playSound } = useSoundEffects();
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [level, setLevel] = useState<number>(1);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [draggedBlock, setDraggedBlock] = useState<BlockData | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });

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
      // Generate random level with increasing difficulty
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
        // Play level complete sound
        playSound('LEVEL_COMPLETE');
        
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
  }, [blocks, level, playSound]);

  // Find a block at a specific position
  const findBlockAt = (x: number, y: number): BlockData | undefined => {
    return blocks.find(block => 
      x >= block.x && 
      x < block.x + block.width && 
      y >= block.y && 
      y < block.y + block.height
    );
  };

  // Check if a position is empty (no blocks)
  const isPositionEmpty = (x: number, y: number): boolean => {
    // Check if position is within the grid
    if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) {
      return false;
    }
    
    // Check if position is occupied by any block
    return !blocks.some(block => 
      x >= block.x && 
      x < block.x + block.width && 
      y >= block.y && 
      y < block.y + block.height
    );
  };

  // Try to push a block in the specified direction
  const tryPushBlock = (blockToPush: BlockData, dx: number, dy: number): boolean => {
    // Calculate the new position of the block after pushing
    const newX = blockToPush.x + dx;
    const newY = blockToPush.y + dy;
    
    // Check if the block can move in the specified direction
    // For horizontal blocks, only allow horizontal movement
    if (blockToPush.type === "horizontal" && dy !== 0) {
      return false;
    }
    
    // For vertical blocks, only allow vertical movement
    if (blockToPush.type === "vertical" && dx !== 0) {
      return false;
    }
    
    // Check if the new position is valid (within grid and not occupied)
    for (let x = newX; x < newX + blockToPush.width; x++) {
      for (let y = newY; y < newY + blockToPush.height; y++) {
        if (!isPositionEmpty(x, y)) {
          return false;
        }
      }
    }
    
    // Move the block
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockToPush.id 
          ? { ...block, x: newX, y: newY }
          : block
      )
    );
    
    // Play move sound
    playSound('MOVE');
    
    return true;
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
        
        // If there's a collision, try to push the other block
        if (block.type === "key") {
          const dx = newX > block.x ? 1 : (newX < block.x ? -1 : 0);
          const dy = newY > block.y ? 1 : (newY < block.y ? -1 : 0);
          
          if (tryPushBlock(otherBlock, dx, dy)) {
            // If the block was pushed successfully, the move is valid
            return true;
          }
        }
        
        return false;
      }
    }
    
    return true;
  };

  // Handle restart button
  const handleRestart = () => {
    loadLevel(level);
    playSound('BUTTON_CLICK');
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
    playSound('BUTTON_CLICK');
  };

  // Handle pointer down event
  const handlePointerDown = (e: React.PointerEvent, block: BlockData) => {
    e.preventDefault();
    setDraggedBlock({ ...block, isMoving: true });
    setDragStartPosition({ 
      x: e.clientX, 
      y: e.clientY 
    });
    
    // Play block selection sound
    playSound('BLOCK_SELECT');
    
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
    const cellsToMoveX = isHorizontal ? Math.round(deltaX / (60 + 4)) : 0;
    const cellsToMoveY = isVertical ? Math.round(deltaY / (60 + 4)) : 0;
    
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
        // Play move sound
        playSound('MOVE');
      }
    } else if ((cellsToMoveX !== 0 || cellsToMoveY !== 0)) {
      // Invalid move
      playSound('INVALID_MOVE');
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

  return {
    blocks,
    level,
    moves,
    isLevelComplete,
    handleRestart,
    handleNextLevel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};

export default useGameLogic;
