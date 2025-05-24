
export interface GameStatistics {
  levelsCompleted: number;
  totalMoves: number;
  bestMoves: number;
  tutorialLevelsCompleted: number;
  levelsWithoutHints: number;
  hintsUsed: number;
  undosUsed: number;
  playTime: number; // in seconds
  averageMovesPerLevel: number;
}

export const getStatistics = (): GameStatistics => {
  const stored = localStorage.getItem("gameStatistics");
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    levelsCompleted: 0,
    totalMoves: 0,
    bestMoves: Infinity,
    tutorialLevelsCompleted: 0,
    levelsWithoutHints: 0,
    hintsUsed: 0,
    undosUsed: 0,
    playTime: 0,
    averageMovesPerLevel: 0
  };
};

export const updateStatistics = (updates: Partial<GameStatistics>) => {
  const current = getStatistics();
  const updated = { ...current, ...updates };
  
  // Calculate averages
  if (updated.levelsCompleted > 0) {
    updated.averageMovesPerLevel = updated.totalMoves / updated.levelsCompleted;
  }
  
  localStorage.setItem("gameStatistics", JSON.stringify(updated));
  return updated;
};

export const recordLevelCompletion = (level: number, moves: number, hintsUsed: boolean) => {
  const stats = getStatistics();
  
  const updates: Partial<GameStatistics> = {
    levelsCompleted: stats.levelsCompleted + 1,
    totalMoves: stats.totalMoves + moves,
    bestMoves: Math.min(stats.bestMoves === Infinity ? moves : stats.bestMoves, moves)
  };
  
  if (level <= 20) {
    updates.tutorialLevelsCompleted = stats.tutorialLevelsCompleted + 1;
  }
  
  if (!hintsUsed) {
    updates.levelsWithoutHints = stats.levelsWithoutHints + 1;
  }
  
  return updateStatistics(updates);
};
