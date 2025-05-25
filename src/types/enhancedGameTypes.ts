
import { BlockData } from './gameTypes';

export interface SpecialBlock extends BlockData {
  specialType?: 'teleporter' | 'oneWay' | 'fragile' | 'magnetic';
  teleportTarget?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  usesLeft?: number;
}

export interface TimedLevel {
  timeLimit: number;
  currentTime: number;
  isTimerActive: boolean;
}

export interface LimitedMovesLevel {
  moveLimit: number;
  movesRemaining: number;
}

export interface MultiKeyLevel {
  keys: SpecialBlock[];
  keysCollected: number;
  totalKeys: number;
}

export interface LevelChallenge {
  type: 'timed' | 'limited-moves' | 'multi-key' | 'perfect-score';
  requirement: number;
  reward: {
    type: 'theme' | 'achievement' | 'coins';
    value: string | number;
  };
}

export interface EnhancedLevel {
  id: number;
  blocks: SpecialBlock[];
  challenge?: LevelChallenge;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  tags: string[];
  creator?: string;
  seasonal?: {
    event: string;
    startDate: Date;
    endDate: Date;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'speed' | 'efficiency' | 'streak' | 'exploration' | 'social';
  requirement: number;
  reward: {
    type: 'theme' | 'coins' | 'title';
    value: string | number;
  };
  unlockedAt?: Date;
}

export interface ParticleEffect {
  type: 'confetti' | 'stars' | 'sparkles' | 'explosion';
  position: { x: number; y: number };
  color: string;
  duration: number;
}
