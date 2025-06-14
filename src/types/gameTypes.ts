
export interface BlockData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "horizontal" | "vertical" | "key";
  isMoving?: boolean;
  isHighlighted?: boolean; // For hint system
}

export interface GameState {
  blocks: BlockData[];
  level: number;
  moves: number;
  isLevelComplete: boolean;
  hintsUsed: number;
  undosUsed: number;
}

export interface BlockProps {
  block: BlockData;
  blockSize: number;
  cellGap: number;
  onPointerDown: (e: React.PointerEvent, block: BlockData) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}

export interface GameBoardProps {
  initialLevel?: number | null;
}

export interface GameMove {
  blockId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}
