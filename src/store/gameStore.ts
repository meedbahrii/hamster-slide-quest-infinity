
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlockData } from '../types/gameTypes';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Leaderboard {
  levelId: number;
  entries: {
    user: User;
    moves: number;
    time: number;
    score: number;
  }[];
}

interface CustomLevel {
  id: string;
  name: string;
  creator: User;
  blocks: BlockData[];
  difficulty: number;
  likes: number;
  plays: number;
  isPublic: boolean;
}

interface GameStore {
  // Theme & Cosmetics
  currentTheme: string;
  unlockedThemes: string[];
  isPremium: boolean;
  
  // Level Editor
  isLevelEditorOpen: boolean;
  customLevels: CustomLevel[];
  
  // Social Features
  friends: User[];
  leaderboards: Leaderboard[];
  
  // Offline Support
  cachedLevels: { [key: number]: BlockData[] };
  isOffline: boolean;
  
  // Analytics
  analytics: {
    totalPlayTime: number;
    averageMovesPerLevel: number;
    preferredDifficulty: string;
    sessionStartTime: number;
  };
  
  // Actions
  setTheme: (theme: string) => void;
  unlockTheme: (theme: string) => void;
  setPremium: (premium: boolean) => void;
  toggleLevelEditor: () => void;
  addCustomLevel: (level: CustomLevel) => void;
  cacheLevel: (levelId: number, blocks: BlockData[]) => void;
  setOffline: (offline: boolean) => void;
  updateAnalytics: (data: Partial<GameStore['analytics']>) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTheme: 'default',
      unlockedThemes: ['default'],
      isPremium: false,
      isLevelEditorOpen: false,
      customLevels: [],
      friends: [],
      leaderboards: [],
      cachedLevels: {},
      isOffline: false,
      analytics: {
        totalPlayTime: 0,
        averageMovesPerLevel: 0,
        preferredDifficulty: 'medium',
        sessionStartTime: Date.now(),
      },
      
      // Actions
      setTheme: (theme) => set({ currentTheme: theme }),
      unlockTheme: (theme) => set((state) => ({
        unlockedThemes: [...new Set([...state.unlockedThemes, theme])]
      })),
      setPremium: (premium) => set({ isPremium: premium }),
      toggleLevelEditor: () => set((state) => ({
        isLevelEditorOpen: !state.isLevelEditorOpen
      })),
      addCustomLevel: (level) => set((state) => ({
        customLevels: [...state.customLevels, level]
      })),
      cacheLevel: (levelId, blocks) => set((state) => ({
        cachedLevels: { ...state.cachedLevels, [levelId]: blocks }
      })),
      setOffline: (offline) => set({ isOffline: offline }),
      updateAnalytics: (data) => set((state) => ({
        analytics: { ...state.analytics, ...data }
      })),
    }),
    {
      name: 'hamster-puzzle-store',
    }
  )
);
