import { BlockData } from "../types/gameTypes";

// Generate a random integer between min (inclusive) and max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Check if a horizontal block would be in front of a key block
const isInFrontOfKey = (block: BlockData, keyBlock: BlockData | undefined): boolean => {
  // If there's no key block or the block is not horizontal, return false
  if (!keyBlock || block.type !== "horizontal") return false;
  
  // Check if the block is on the same row as the key and in front of it
  return block.y === keyBlock.y && block.x > keyBlock.x + keyBlock.width - 1;
};

// Check if a block position is valid (doesn't overlap with other blocks)
const isPositionValid = (block: BlockData, blocks: BlockData[], gridSize: number): boolean => {
  // Check grid boundaries
  if (block.x < 0 || block.y < 0 || 
      block.x + block.width > gridSize || 
      block.y + block.height > gridSize) {
    return false;
  }
  
  // Find the key block
  const keyBlock = blocks.find(b => b.type === "key");
  
  // Check if horizontal block would be in front of the hamster
  if (isInFrontOfKey(block, keyBlock)) {
    return false;
  }
  
  // Check collision with other blocks
  for (const existingBlock of blocks) {
    if (!(block.x + block.width <= existingBlock.x || 
          block.x >= existingBlock.x + existingBlock.width ||
          block.y + block.height <= existingBlock.y ||
          block.y >= existingBlock.y + existingBlock.height)) {
      return false;
    }
  }
  
  // Check the new rule: Two horizontal shapes cannot be on the same line
  if (block.type === "horizontal") {
    const horizontalBlocksInRow = blocks.filter(b => 
      b.type === "horizontal" && b.y === block.y
    );
    
    if (horizontalBlocksInRow.length > 0) {
      return false; // Rule violation - another horizontal block on same row
    }
  }
  
  // Check the new rule: Two vertical shapes cannot be on the same column
  if (block.type === "vertical") {
    const verticalBlocksInColumn = blocks.filter(b => 
      b.type === "vertical" && b.x === block.x
    );
    
    if (verticalBlocksInColumn.length > 0) {
      return false; // Rule violation - another vertical block in same column
    }
  }
  
  // Check if two blocks would overlap in the grid
  if (block.type !== "key") {
    if (block.type === "horizontal") {
      // For horizontal blocks, check for vertical blocks that would overlap
      for (let x = block.x; x < block.x + block.width; x++) {
        const verticalBlocksInColumn = blocks.filter(b => 
          b.type === "vertical" && 
          b.x <= x && x < b.x + b.width
        );
        
        for (const vBlock of verticalBlocksInColumn) {
          // Check if the vertical block overlaps with our block's row
          if (!(block.y + block.height <= vBlock.y || block.y >= vBlock.y + vBlock.height)) {
            return false; // Overlap violation
          }
        }
      }
    } else if (block.type === "vertical") {
      // For vertical blocks, check for horizontal blocks that would overlap
      for (let y = block.y; y < block.y + block.height; y++) {
        const horizontalBlocksInRow = blocks.filter(b => 
          b.type === "horizontal" && 
          b.y <= y && y < b.y + b.height
        );
        
        for (const hBlock of horizontalBlocksInRow) {
          // Check if the horizontal block overlaps with our block's column
          if (!(block.x + block.width <= hBlock.x || block.x >= hBlock.x + hBlock.width)) {
            return false; // Overlap violation
          }
        }
      }
    }
  }
  
  return true;
};

// Try to place a block with random position and dimensions
const tryPlaceBlock = (
  blocks: BlockData[], 
  gridSize: number, 
  type: "horizontal" | "vertical",
  maxAttempts: number = 100
): boolean => {
  
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    const width = type === "horizontal" ? randomInt(2, 3) : 1;
    const height = type === "vertical" ? randomInt(2, 3) : 1;
    
    const maxX = gridSize - width;
    const maxY = gridSize - height;
    
    const x = randomInt(0, maxX);
    const y = randomInt(0, maxY);
    
    const block: BlockData = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      width,
      height,
      type
    };
    
    if (isPositionValid(block, blocks, gridSize)) {
      blocks.push(block);
      return true;
    }
  }
  
  return false;
};

// Enhanced path checking algorithm to verify level is solvable
const checkPathToExit = (blocks: BlockData[], gridSize: number): boolean => {
  const keyBlock = blocks.find(block => block.type === "key");
  if (!keyBlock) return false;
  
  // Define the exit row (always at row 2, which is index 2)
  const exitRow = 2;
  
  // If key block isn't in the exit row, it can't reach the exit directly
  if (keyBlock.y !== exitRow) {
    return false;
  }
  
  // Find all blocks in the path to exit
  const blocksInPath = blocks.filter(block => 
    block.type !== "key" && 
    block.x > keyBlock.x + keyBlock.width - 1 && 
    block.y <= exitRow && 
    block.y + block.height > exitRow
  );
  
  if (blocksInPath.length === 0) {
    // No obstacles, can reach exit immediately - this is too easy
    return false;
  }
  
  // Too many obstacles might make it unsolvable
  if (blocksInPath.length > 5) {
    return false;
  }
  
  // Basic solvability check: ensure there's enough space to maneuver
  const verticalBlocksNearPath = blocks.filter(block => 
    block.type === "vertical" && 
    block.x >= keyBlock.x - 1 && 
    block.x <= keyBlock.x + keyBlock.width + 1
  );
  
  // Check if there's too much congestion near the key block
  if (verticalBlocksNearPath.length > 4) {
    return false;
  }
  
  // Check if there's a possible path through the level
  // Simple check: make sure there's at least one empty cell above or below the path
  const hasSpaceToManeuver = Array.from({ length: gridSize }).some((_, x) => {
    // Check if this column has an empty cell above or below the exit row
    const hasEmptyCellAbove = !blocks.some(block => 
      block.x <= x && x < block.x + block.width && 
      block.y <= exitRow - 1 && exitRow - 1 < block.y + block.height
    );
    
    const hasEmptyCellBelow = !blocks.some(block => 
      block.x <= x && x < block.x + block.width && 
      block.y <= exitRow + 1 && exitRow + 1 < block.y + block.height
    );
    
    return hasEmptyCellAbove || hasEmptyCellBelow;
  });
  
  if (!hasSpaceToManeuver) {
    return false;
  }
  
  // If we've passed all the checks, the level is likely solvable
  return true;
}

// Generate a level with specified difficulty
export const generateLevel = (gridSize: number, difficulty: number): BlockData[] => {
  const maxAttempts = 100;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    let blocks: BlockData[] = [];
    
    // First, place the key block (always horizontal)
    const keyBlock: BlockData = {
      id: "key",
      x: randomInt(0, 2), // Start closer to the left
      y: 2, // Always place at row 2 (to match exit)
      width: 2,
      height: 1,
      type: "key"
    };
    
    blocks.push(keyBlock);
    
    // Number of blocks based on difficulty
    const numHorizontal = Math.min(difficulty + 1, 6);
    const numVertical = Math.min(difficulty + 2, 7);
    
    // Place horizontal blocks
    for (let i = 0; i < numHorizontal; i++) {
      if (!tryPlaceBlock(blocks, gridSize, "horizontal")) break;
    }
    
    // Place vertical blocks
    for (let i = 0; i < numVertical; i++) {
      if (!tryPlaceBlock(blocks, gridSize, "vertical")) break;
    }
    
    // Check if the puzzle is solvable
    if (checkPathToExit(blocks, gridSize) && blocks.length >= difficulty + 3) {
      return blocks;
    }
  }
  
  // Fallback: return a simple level that's definitely solvable
  return [
    { id: "key", x: 1, y: 2, width: 2, height: 1, type: "key" },
    { id: "v1", x: 3, y: 1, width: 1, height: 2, type: "vertical" },
    { id: "v2", x: 4, y: 2, width: 1, height: 3, type: "vertical" },
    { id: "h1", x: 0, y: 0, width: 2, height: 1, type: "horizontal" },
  ];
};
