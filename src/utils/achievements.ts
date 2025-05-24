
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_win",
    title: "First Victory",
    description: "Complete your first level",
    icon: "🏆",
    unlocked: false
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Complete a level in under 5 moves",
    icon: "⚡",
    unlocked: false
  },
  {
    id: "tutorial_master",
    title: "Tutorial Master",
    description: "Complete all 20 tutorial levels",
    icon: "🎓",
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Complete 10 levels without using hints",
    icon: "💎",
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: "persistent",
    title: "Persistent Player",
    description: "Complete 50 levels total",
    icon: "🔥",
    unlocked: false,
    progress: 0,
    maxProgress: 50
  }
];

export const checkAchievements = (stats: any): Achievement[] => {
  const achievements = getAchievements();
  const newlyUnlocked: Achievement[] = [];

  achievements.forEach(achievement => {
    if (achievement.unlocked) return;

    switch (achievement.id) {
      case "first_win":
        if (stats.levelsCompleted >= 1) {
          achievement.unlocked = true;
          newlyUnlocked.push(achievement);
        }
        break;
      case "speed_demon":
        if (stats.bestMoves && stats.bestMoves <= 5) {
          achievement.unlocked = true;
          newlyUnlocked.push(achievement);
        }
        break;
      case "tutorial_master":
        achievement.progress = Math.min(stats.tutorialLevelsCompleted || 0, 20);
        if (achievement.progress >= 20) {
          achievement.unlocked = true;
          newlyUnlocked.push(achievement);
        }
        break;
      case "perfectionist":
        achievement.progress = stats.levelsWithoutHints || 0;
        if (achievement.progress >= 10) {
          achievement.unlocked = true;
          newlyUnlocked.push(achievement);
        }
        break;
      case "persistent":
        achievement.progress = stats.levelsCompleted || 0;
        if (achievement.progress >= 50) {
          achievement.unlocked = true;
          newlyUnlocked.push(achievement);
        }
        break;
    }
  });

  saveAchievements(achievements);
  return newlyUnlocked;
};

export const getAchievements = (): Achievement[] => {
  const stored = localStorage.getItem("achievements");
  if (stored) {
    return JSON.parse(stored);
  }
  return ACHIEVEMENTS.map(a => ({ ...a }));
};

export const saveAchievements = (achievements: Achievement[]) => {
  localStorage.setItem("achievements", JSON.stringify(achievements));
};
