
import { BlockData } from '../types/gameTypes';
import { useGameStore } from '../store/gameStore';

class OfflineManager {
  private static instance: OfflineManager;
  private isOnline: boolean = navigator.onLine;

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      useGameStore.getState().setOffline(false);
      console.log('App is online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      useGameStore.getState().setOffline(true);
      console.log('App is offline');
    });
  }

  cacheLevel(levelId: number, blocks: BlockData[]) {
    try {
      const cachedLevels = this.getCachedLevels();
      cachedLevels[levelId] = blocks;
      localStorage.setItem('cachedLevels', JSON.stringify(cachedLevels));
      useGameStore.getState().cacheLevel(levelId, blocks);
    } catch (error) {
      console.error('Failed to cache level:', error);
    }
  }

  getCachedLevel(levelId: number): BlockData[] | null {
    try {
      const cachedLevels = this.getCachedLevels();
      return cachedLevels[levelId] || null;
    } catch (error) {
      console.error('Failed to get cached level:', error);
      return null;
    }
  }

  private getCachedLevels(): { [key: number]: BlockData[] } {
    try {
      const cached = localStorage.getItem('cachedLevels');
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.error('Failed to parse cached levels:', error);
      return {};
    }
  }

  isOffline(): boolean {
    return !this.isOnline;
  }

  clearCache() {
    localStorage.removeItem('cachedLevels');
    useGameStore.setState({ cachedLevels: {} });
  }

  getCacheSize(): number {
    const cached = localStorage.getItem('cachedLevels');
    return cached ? cached.length : 0;
  }
}

export const offlineManager = OfflineManager.getInstance();
