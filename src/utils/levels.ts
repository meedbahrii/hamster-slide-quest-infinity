
// Tutorial levels for the game
import { BlockData } from "../components/GameBoard";

// Tutorial Level 1: Simple introduction with just a few blocks
const level1: BlockData[] = [
  { id: "key1", x: 1, y: 2, width: 2, height: 1, type: "key" },
  { id: "v1", x: 3, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 3, y: 3, width: 2, height: 1, type: "horizontal" },
];

// Tutorial Level 2: Slightly more complex with more blocks
const level2: BlockData[] = [
  { id: "key1", x: 0, y: 2, width: 2, height: 1, type: "key" },
  { id: "v1", x: 2, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "v2", x: 3, y: 2, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 3, y: 1, width: 3, height: 1, type: "horizontal" },
  { id: "h2", x: 0, y: 4, width: 2, height: 1, type: "horizontal" },
];

// Tutorial Level 3: More challenging with multiple blocks
const level3: BlockData[] = [
  { id: "key1", x: 1, y: 2, width: 2, height: 1, type: "key" },
  { id: "v1", x: 0, y: 0, width: 1, height: 2, type: "vertical" },
  { id: "v2", x: 3, y: 0, width: 1, height: 3, type: "vertical" },
  { id: "v3", x: 4, y: 3, width: 1, height: 3, type: "vertical" },
  { id: "h1", x: 0, y: 3, width: 3, height: 1, type: "horizontal" },
  { id: "h2", x: 4, y: 0, width: 2, height: 1, type: "horizontal" },
  { id: "h3", x: 2, y: 5, width: 3, height: 1, type: "horizontal" },
];

export const tutorialLevels = [level1, level2, level3];
