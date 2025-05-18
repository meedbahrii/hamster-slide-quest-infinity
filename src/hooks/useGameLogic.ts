
import { useState, useEffect, useCallback } from "react";
import { BlockData, GameState } from "../types/gameTypes";
import { tutorialLevels } from "../utils/levels";
import { generateLevel } from "../utils/levelGenerator";
import { useToast } from "@/hooks/use-toast";

// Constants
const GRID_SIZE = 6;

export const useGameLogic = (initialLevel: number | null = null) => {
  const { toast } = useToast();
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
