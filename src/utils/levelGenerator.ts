
import { BlockData } from "../components/GameBoard";

// Generate a random integer between min (inclusive) and max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Check if a block position is valid (doesn't overlap with other blocks)
const isPositionValid = (block: BlockData, blocks: BlockData[], gridSize: number): boolean => {
  // Check grid boundaries
  if (block.x < 0 || block.y < 0 || 
      block.x + block.width > gridSize || 
      block.y + block.height > gridSize) {
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

// Check if a puzzle is solvable (simplified check for demo)
const isPuzzleSolvable = (blocks: BlockData[]): boolean => {
  const keyBlock = blocks.find(block => block.type === "key");
  if (!keyBlock) return false;
  
  // Simple heuristic: Check if there's a path to the right edge
  // This is a very simplified check; a real solver would be more complex
  
  // Check if any vertical blocks block the key's path to exit
  const blockingVerticals = blocks.filter(block => 
    block.type === "vertical" && 
    block.x > keyBlock.x && 
    block.y <= keyBlock.y && 
    block.y + block.height > keyBlock.y
  );
  
  return blockingVerticals.length < 3; // Simple heuristic
};

// Generate a level with specified difficulty
export const generateLevel = (gridSize: number, difficulty: number): BlockData[] => {
  const maxAttempts = 100;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    let blocks: BlockData[] = [];
    
    // First, place the key block (always horizontal)
    const keyY = randomInt(1, gridSize - 2);
    const keyBlock: BlockData = {
      id: "key",
      x: randomInt(0, 2), // Start closer to the left
      y: keyY,
      width: 2,
      height: 1,
      type: "key"
    };
    
    blocks.push(keyBlock);
    
    // Number of blocks based on difficulty
    const numHorizontal = Math.min(difficulty + 2, 8);
    const numVertical = Math.min(difficulty + 2, 8);
    
    // Place horizontal blocks
    for (let i = 0; i < numHorizontal; i++) {
      if (!tryPlaceBlock(blocks, gridSize, "horizontal")) break;
    }
    
    // Place vertical blocks
    for (let i = 0; i < numVertical; i++) {
      if (!tryPlaceBlock(blocks, gridSize, "vertical")) break;
    }
    
    // Check if the puzzle is solvable
    if (isPuzzleSolvable(blocks) && blocks.length >= difficulty + 3) {
      return blocks;
    }
  }
  
  // Fallback: return a simple level if generation fails
  return [
    { id: "key", x: 1, y: 2, width: 2, height: 1, type: "key" },
    { id: "v1", x: 3, y: 1, width: 1, height: 2, type: "vertical" },
    { id: "v2", x: 4, y: 2, width: 1, height: 3, type: "vertical" },
    { id: "h1", x: 0, y: 0, width: 2, height: 1, type: "horizontal" },
  ];
};
