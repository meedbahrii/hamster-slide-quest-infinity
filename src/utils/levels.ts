
// Tutorial levels for the game
import { BlockData } from "../types/gameTypes";

// Tutorial Level 1: Simple introduction with just a few blocks
const level1: BlockData[] = [
  { id: "key1", x: 1, y: 2, width: 2, height: 1, type: "key" }, // Key block at row 2 (for exit)
  { id: "v1", x: 3, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 3, y: 3, width: 2, height: 1, type: "horizontal" },
];

// Tutorial Level 2: Slightly more complex with more blocks
const level2: BlockData[] = [
  { id: "key1", x: 0, y: 2, width: 2, height: 1, type: "key" }, // Key block at row 2 (for exit)
  { id: "v1", x: 2, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "v2", x: 3, y: 2, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 3, y: 1, width: 3, height: 1, type: "horizontal" },
  { id: "h2", x: 0, y: 4, width: 2, height: 1, type: "horizontal" },
];

// Tutorial Level 3: More challenging with multiple blocks
const level3: BlockData[] = [
  { id: "key1", x: 1, y: 2, width: 2, height: 1, type: "key" }, // Key block at row 2 (for exit)
  { id: "v1", x: 0, y: 0, width: 1, height: 2, type: "vertical" },
  { id: "v2", x: 3, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "v3", x: 4, y: 3, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 0, y: 3, width: 3, height: 1, type: "horizontal" },
  { id: "h2", x: 4, y: 0, width: 2, height: 1, type: "horizontal" },
  { id: "h3", x: 2, y: 5, width: 3, height: 1, type: "horizontal" },
];

// Level 4: First intermediate level with complex movement patterns
const level4: BlockData[] = [
  { id: "key1", x: 0, y: 2, width: 2, height: 1, type: "key" },
  { id: "v1", x: 2, y: 1, width: 1, height: 3, type: "vertical" },
  { id: "v2", x: 3, y: 0, width: 1, height: 2, type: "vertical" },
  { id: "v3", x: 4, y: 2, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 0, y: 0, width: 3, height: 1, type: "horizontal" },
  { id: "h2", x: 0, y: 4, width: 2, height: 1, type: "horizontal" },
  { id: "h3", x: 3, y: 5, width: 3, height: 1, type: "horizontal" },
];

// Level 5: Challenging level with complex block arrangements
const level5: BlockData[] = [
  { id: "key1", x: 1, y: 2, width: 2, height: 1, type: "key" },
  { id: "v1", x: 0, y: 0, width: 1, height: 2, type: "vertical" },
  { id: "v2", x: 3, y: 1, width: 1, height: 2, type: "vertical" },
  { id: "v3", x: 5, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "v4", x: 4, y: 3, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 3, y: 0, width: 2, height: 1, type: "horizontal" },
  { id: "h2", x: 0, y: 3, width: 3, height: 1, type: "horizontal" },
  { id: "h3", x: 0, y: 5, width: 3, height: 1, type: "horizontal" },
];

// Level 6: Advanced level with tight spaces
const level6: BlockData[] = [
  { id: "key1", x: 0, y: 2, width: 2, height: 1, type: "key" },
  { id: "v1", x: 2, y: 1, width: 1, height: 2, type: "vertical" },
  { id: "v2", x: 3, y: 2, width: 1, height: 3, type: "vertical" },
  { id: "v3", x: 4, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "v4", x: 5, y: 3, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 0, y: 0, width: 2, height: 1, type: "horizontal" },
  { id: "h2", x: 3, y: 4, width: 2, height: 1, type: "horizontal" },
  { id: "h3", x: 0, y: 5, width: 2, height: 1, type: "horizontal" },
  { id: "h4", x: 2, y: 3, width: 1, height: 1, type: "horizontal" },
];

// Level 7: Expert level with maze-like structure
const level7: BlockData[] = [
  { id: "key1", x: 2, y: 2, width: 2, height: 1, type: "key" },
  { id: "v1", x: 0, y: 2, width: 1, height: 3, type: "vertical" },
  { id: "v2", x: 1, y: 0, width: 1, height: 2, type: "vertical" },
  { id: "v3", x: 4, y: 1, width: 1, height: 2, type: "vertical" },
  { id: "v4", x: 5, y: 2, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 0, y: 0, width: 1, height: 1, type: "horizontal" },
  { id: "h2", x: 2, y: 1, width: 2, height: 1, type: "horizontal" },
  { id: "h3", x: 1, y: 3, width: 2, height: 1, type: "horizontal" },
  { id: "h4", x: 3, y: 4, width: 2, height: 1, type: "horizontal" },
  { id: "h5", x: 1, y: 5, width: 3, height: 1, type: "horizontal" },
];

// Level 8: Master level with multiple interdependent moves
const level8: BlockData[] = [
  { id: "key1", x: 2, y: 2, width: 2, height: 1, type: "key" },
  { id: "v1", x: 0, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "v2", x: 1, y: 3, width: 1, height: 3, type: "vertical" },
  { id: "v3", x: 4, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "v5", x: 5, y: 3, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 0, y: 3, width: 1, height: 1, type: "horizontal" },
  { id: "h2", x: 2, y: 0, width: 2, height: 1, type: "horizontal" },
  { id: "h3", x: 2, y: 4, width: 3, height: 1, type: "horizontal" },
  { id: "h4", x: 0, y: 5, width: 1, height: 1, type: "horizontal" },
];

// Level 9: Diabolical level with tricky sequence
const level9: BlockData[] = [
  { id: "key1", x: 1, y: 2, width: 2, height: 1, type: "key" },
  { id: "v1", x: 0, y: 0, width: 1, height: 2, type: "vertical" },
  { id: "v2", x: 3, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "v3", x: 4, y: 2, width: 1, height: 2, type: "vertical" },
  { id: "v4", x: 5, y: 0, width: 1, height: 2, type: "vertical" },
  { id: "h1", x: 1, y: 0, width: 2, height: 1, type: "horizontal" },
  { id: "h2", x: 4, y: 4, width: 2, height: 1, type: "horizontal" },
  { id: "h3", x: 0, y: 3, width: 2, height: 1, type: "horizontal" },
  { id: "h4", x: 2, y: 5, width: 3, height: 1, type: "horizontal" },
];

// Level 10: Grandmaster level - extremely difficult
const level10: BlockData[] = [
  { id: "key1", x: 0, y: 2, width: 2, height: 1, type: "key" },
  { id: "v1", x: 2, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "v2", x: 3, y: 2, width: 1, height: 2, type: "vertical" },
  { id: "v3", x: 4, y: 0, width: 1, height: 2, type: "vertical" },
  { id: "v4", x: 5, y: 2, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 0, y: 0, width: 2, height: 1, type: "horizontal" },
  { id: "h2", x: 3, y: 4, width: 2, height: 1, type: "horizontal" },
  { id: "h3", x: 0, y: 5, width: 2, height: 1, type: "horizontal" },
  { id: "h4", x: 2, y: 3, width: 1, height: 1, type: "horizontal" },
  { id: "h5", x: 4, y: 5, width: 2, height: 1, type: "horizontal" },
];

export const tutorialLevels = [
  level1, level2, level3, level4, level5, 
  level6, level7, level8, level9, level10
];
