interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: number;
}

class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.loadStoredEvents();
  }

  track(eventName: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      },
      timestamp: Date.now()
    };

    this.events.push(event);
    this.saveEvents();
    
    console.log('Analytics:', eventName, properties);
  }

  // Game-specific tracking methods
  trackLevelStart(level: number, difficulty: string) {
    this.track('level_start', { level, difficulty });
  }

  trackLevelComplete(level: number, moves: number, time: number, hintsUsed: number) {
    this.track('level_complete', { 
      level, 
      moves, 
      time, 
      hintsUsed,
      efficiency: this.calculateEfficiency(moves, level),
      performance: this.calculatePerformance(time, moves)
    });
  }

  trackLevelFailed(level: number, moves: number, time: number, reason: string) {
    this.track('level_failed', { level, moves, time, reason });
  }

  trackHintUsed(level: number, moveNumber: number) {
    this.track('hint_used', { level, moveNumber });
  }

  trackUndoUsed(level: number, moveNumber: number) {
    this.track('undo_used', { level, moveNumber });
  }

  trackThemeChanged(oldTheme: string, newTheme: string) {
    this.track('theme_changed', { oldTheme, newTheme });
  }

  trackCustomLevelCreated(levelData: any) {
    this.track('custom_level_created', { 
      blockCount: levelData.blocks.length,
      difficulty: levelData.difficulty
    });
  }

  trackAchievementUnlocked(achievementId: string, achievementType: string) {
    this.track('achievement_unlocked', { achievementId, achievementType });
  }

  // Analytics calculations
  private calculateEfficiency(moves: number, level: number): number {
    const expectedMoves = Math.max(3, level * 2); // Simple formula
    return Math.max(0, Math.min(100, (expectedMoves / moves) * 100));
  }

  private calculatePerformance(time: number, moves: number): number {
    const timePerMove = time / moves;
    if (timePerMove < 2) return 100; // Very fast
    if (timePerMove < 5) return 80;  // Fast
    if (timePerMove < 10) return 60; // Normal
    if (timePerMove < 20) return 40; // Slow
    return 20; // Very slow
  }

  // Data management
  private saveEvents() {
    try {
      // Keep only last 1000 events to prevent storage bloat
      const recentEvents = this.events.slice(-1000);
      localStorage.setItem('analytics_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to save analytics events:', error);
    }
  }

  private loadStoredEvents() {
    try {
      const stored = localStorage.getItem('analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored analytics events:', error);
      this.events = [];
    }
  }

  // Export data for analysis
  getAnalyticsData() {
    return {
      events: this.events,
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      eventTypes: [...new Set(this.events.map(e => e.name))],
      sessionStart: Math.min(...this.events.map(e => e.timestamp)),
      sessionEnd: Math.max(...this.events.map(e => e.timestamp))
    };
  }

  // Clear old data
  clearOldData(daysToKeep: number = 7) {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > cutoffTime);
    this.saveEvents();
  }
}

export const analytics = Analytics.getInstance();
