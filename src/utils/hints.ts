
import { BlockData } from "../types/gameTypes";

const GRID_SIZE = 6;

export const getHint = (blocks: BlockData[]): { blockId: string; direction: string } | null => {
  const keyBlock = blocks.find(block => block.type === "key");
  if (!keyBlock) return null;

  // First, try to move the key block right (toward the exit)
  if (canMoveBlock(keyBlock, keyBlock.x + 1, keyBlock.y, blocks)) {
    return { blockId: keyBlock.id, direction: "right" };
  }

  // If key block can't move right, find other blocks that can be moved to help
  const movableBlocks = blocks.filter(block => {
    if (block.type === "horizontal") {
      return canMoveBlock(block, block.x + 1, block.y, blocks) || 
             canMoveBlock(block, block.x - 1, block.y, blocks);
    } else if (block.type === "vertical") {
      return canMoveBlock(block, block.x, block.y + 1, blocks) || 
             canMoveBlock(block, block.x, block.y - 1, blocks);
    }
    return false;
  });

  if (movableBlocks.length > 0) {
    const block = movableBlocks[0];
    if (block.type === "horizontal") {
      const direction = canMoveBlock(block, block.x + 1, block.y, blocks) ? "right" : "left";
      return { blockId: block.id, direction };
    } else {
      const direction = canMoveBlock(block, block.x, block.y + 1, blocks) ? "down" : "up";
      return { blockId: block.id, direction };
    }
  }

  return null;
};

const canMoveBlock = (block: BlockData, newX: number, newY: number, blocks: BlockData[]): boolean => {
  // Check boundaries
  if (newX < 0 || newY < 0 || 
      newX + block.width > GRID_SIZE || 
      newY + block.height > GRID_SIZE) {
    return false;
  }

  // Check for collisions with other blocks
  for (let x = newX; x < newX + block.width; x++) {
    for (let y = newY; y < newY + block.height; y++) {
      const blockAtPosition = blocks.find(b => 
        b.id !== block.id &&
        x >= b.x && x < b.x + b.width && 
        y >= b.y && y < b.y + b.height
      );
      if (blockAtPosition) {
        return false;
      }
    }
  }

  return true;
};
