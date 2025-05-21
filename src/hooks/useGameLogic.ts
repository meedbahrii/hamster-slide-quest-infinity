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

  // Check if a block's new position would violate the rule of two big shapes in same column or row
  const wouldViolateColumnRowRule = (block: BlockData, newX: number, newY: number): boolean => {
    // Ignore this check for the key block
    if (block.type === "key") return false;
    
    // For horizontal blocks, check for vertical blocks in the same columns
    if (block.type === "horizontal") {
      // Check each column this block would occupy
      for (let x = newX; x < newX + block.width; x++) {
        // Find any vertical blocks that share this column
        const verticalBlocksInColumn = blocks.filter(b => 
          b.id !== block.id && // Not the same block
          b.type === "vertical" && // Only care about vertical blocks
          b.x <= x && x < b.x + b.width // Block occupies this column
        );
        
        // If there's a vertical block in this column that shares any row with our block,
        // it's a violation
        for (const vBlock of verticalBlocksInColumn) {
          // Check if the vertical block would overlap with our block's rows
          if (!(newY + block.height <= vBlock.y || newY >= vBlock.y + vBlock.height)) {
            return true; // Violation found
          }
        }
      }
    }
    
    // For vertical blocks, check for horizontal blocks in the same rows
    if (block.type === "vertical") {
      // Check each row this block would occupy
      for (let y = newY; y < newY + block.height; y++) {
        // Find any horizontal blocks that share this row
        const horizontalBlocksInRow = blocks.filter(b => 
          b.id !== block.id && // Not the same block
          b.type === "horizontal" && // Only care about horizontal blocks
          b.y <= y && y < b.y + b.height // Block occupies this row
        );
        
        // If there's a horizontal block in this row that shares any column with our block,
        // it's a violation
        for (const hBlock of horizontalBlocksInRow) {
          // Check if the horizontal block would overlap with our block's columns
          if (!(newX + block.width <= hBlock.x || newX >= hBlock.x + hBlock.width)) {
            return true; // Violation found
          }
        }
      }
    }
    
    return false; // No violations found
  };

  // Check if a horizontal block would be in front of the hamster on the same row
  const wouldBlockHamsterPath = (block: BlockData, newX: number, newY: number): boolean => {
    // Only apply this rule to horizontal blocks
    if (block.type !== "horizontal") return false;
    
    // Find the hamster block
    const keyBlock = blocks.find(b => b.type === "key");
    if (!keyBlock) return false;
    
    // Check if the block is on the same row as the hamster
    if (newY !== keyBlock.y) return false;
    
    // Check if the block would be to the right of the hamster
    if (newX > keyBlock.x + keyBlock.width - 1) {
      return true; // Violation - horizontal block is in front of hamster
    }
    
    return false; // No violation
  };

  // Check if the path is clear for a block to move to a new position
  const isPathClear = (block: BlockData, newX: number, newY: number): boolean => {
    // Determine direction of movement
    const dx = newX > block.x ? 1 : (newX < block.x ? -1 : 0);
    const dy = newY > block.y ? 1 : (newY < block.y ? -1 : 0);
    
    // For horizontal blocks, only allow horizontal movement
    if (block.type === "horizontal" && dy !== 0) {
      return false;
    }
    
    // For vertical blocks, only allow vertical movement
    if (block.type === "vertical" && dx !== 0) {
      return false;
    }
    
    // Check each position along the path
    let currentX = block.x;
    let currentY = block.y;
    
    while (currentX !== newX || currentY !== newY) {
      // Move one step in the direction
      if (currentX !== newX) currentX += dx;
      if (currentY !== newY) currentY += dy;
      
      // Check each cell of the block at this position
      for (let x = 0; x < block.width; x++) {
        for (let y = 0; y < block.height; y++) {
          const posX = currentX + x;
          const posY = currentY + y;
          
          // Skip checking the original block's position
          const blockAtPosition = findBlockAt(posX, posY);
          if (blockAtPosition && blockAtPosition.id !== block.id) {
            return false;
          }
        }
      }
    }
    
    return true;
  };

  // Try to push a block in the specified direction
  const tryPushBlock = (blockToPush: BlockData, dx: number, dy: number): boolean => {
    // Only allow pushing blocks in their valid direction
    if ((blockToPush.type === "horizontal" && dy !== 0) || 
        (blockToPush.type === "vertical" && dx !== 0)) {
      return false;
    }
    
    // Calculate the new position of the block after pushing
    const newX = blockToPush.x + dx;
    const newY = blockToPush.y + dy;
    
    // Check if the new position is valid (within grid and path is clear)
    if (newX < 0 || newY < 0 || 
        newX + blockToPush.width > GRID_SIZE || 
        newY + blockToPush.height > GRID_SIZE) {
      return false;
    }
    
    // Check if pushing would violate the column/row rule
    if (wouldViolateColumnRowRule(blockToPush, newX, newY)) {
      return false;
    }
    
    // Check if horizontal block would be in front of hamster
    if (wouldBlockHamsterPath(blockToPush, newX, newY)) {
      return false;
    }
    
    // Check if all cells in the new position are empty or part of the current block
    for (let x = newX; x < newX + blockToPush.width; x++) {
      for (let y = newY; y < newY + blockToPush.height; y++) {
        const blockAtPosition = findBlockAt(x, y);
        if (blockAtPosition && blockAtPosition.id !== blockToPush.id) {
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
    
    // Only allow moves in the correct direction for each block type
    if (block.type === "horizontal" && block.y !== newY) {
      return false;
    }
    
    if (block.type === "vertical" && block.x !== newX) {
      return false;
    }
    
    // Check if the move would violate the column/row rule
    if (wouldViolateColumnRowRule(block, newX, newY)) {
      return false;
    }
    
    // Check if horizontal block would be in front of hamster
    if (wouldBlockHamsterPath(block, newX, newY)) {
      return false;
    }
    
    // Check if the path is clear
    if (!isPathClear(block, newX, newY)) {
      // If path isn't clear, check if we can push blocks (only for key block)
      if (block.type === "key") {
        // For key block, check if we can push other blocks
        const dx = newX > block.x ? 1 : (newX < block.x ? -1 : 0);
        const dy = newY > block.y ? 1 : (newY < block.y ? -1 : 0);
        
        // Find the first block in our way
        const pathBlocks: BlockData[] = [];
        let currentX = block.x;
        let currentY = block.y;
        
        while (currentX !== newX || currentY !== newY) {
          // Move one step in the direction
          if (currentX !== newX) currentX += dx;
          if (currentY !== newY) currentY += dy;
          
          // Check for blocks at this position
          for (let x = 0; x < block.width; x++) {
            for (let y = 0; y < block.height; y++) {
              const blockAtPosition = findBlockAt(currentX + x, currentY + y);
              if (blockAtPosition && blockAtPosition.id !== block.id && 
                  !pathBlocks.some(b => b.id === blockAtPosition.id)) {
                pathBlocks.push(blockAtPosition);
              }
            }
          }
        }
        
        // Can only push one block at a time
        if (pathBlocks.length === 1) {
          return tryPushBlock(pathBlocks[0], dx, dy);
        }
      }
      
      return false;
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
    let cellsToMoveX = 0;
    let cellsToMoveY = 0;
    
    if (draggedBlock.type === "horizontal" || draggedBlock.type === "key") {
      cellsToMoveX = Math.round(deltaX / (60 + 4));
      cellsToMoveY = 0; // Horizontal blocks only move horizontally
    } else if (draggedBlock.type === "vertical") {
      cellsToMoveX = 0; // Vertical blocks only move vertically
      cellsToMoveY = Math.round(deltaY / (60 + 4));
    }
    
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
