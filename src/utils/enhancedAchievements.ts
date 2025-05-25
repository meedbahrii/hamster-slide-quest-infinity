
import { Achievement } from '../types/enhancedGameTypes';

export const achievements: Achievement[] = [
  // Speed achievements
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a level in under 10 seconds',
    icon: '⚡',
    type: 'speed',
    requirement: 10,
    reward: { type: 'theme', value: 'neon' }
  },
  {
    id: 'lightning-fast',
    name: 'Lightning Fast',
    description: 'Complete 5 levels in under 30 seconds each',
    icon: '🏃',
    type: 'speed',
    requirement: 5,
    reward: { type: 'coins', value: 100 }
  },
  
  // Efficiency achievements
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete a level with minimum possible moves',
    icon: '🎯',
    type: 'efficiency',
    requirement: 1,
    reward: { type: 'theme', value: 'gold' }
  },
  {
    id: 'efficiency-master',
    name: 'Efficiency Master',
    description: 'Complete 10 levels with perfect scores',
    icon: '💎',
    type: 'efficiency',
    requirement: 10,
    reward: { type: 'title', value: 'Master Puzzler' }
  },
  
  // Streak achievements
  {
    id: 'on-fire',
    name: 'On Fire!',
    description: 'Complete 5 levels in a row without hints',
    icon: '🔥',
    type: 'streak',
    requirement: 5,
    reward: { type: 'coins', value: 50 }
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Complete 20 levels in a row without using undo',
    icon: '🚀',
    type: 'streak',
    requirement: 20,
    reward: { type: 'theme', value: 'cosmic' }
  },
  
  // Exploration achievements
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Complete 50 different levels',
    icon: '🗺️',
    type: 'exploration',
    requirement: 50,
    reward: { type: 'coins', value: 200 }
  },
  {
    id: 'level-master',
    name: 'Level Master',
    description: 'Complete all tutorial levels',
    icon: '🏆',
    type: 'exploration',
    requirement: 15,
    reward: { type: 'theme', value: 'premium' }
  },
  
  // Social achievements
  {
    id: 'creator',
    name: 'Creator',
    description: 'Create your first custom level',
    icon: '🎨',
    type: 'social',
    requirement: 1,
    reward: { type: 'coins', value: 75 }
  },
  {
    id: 'popular-creator',
    name: 'Popular Creator',
    description: 'Get 100 likes on your custom levels',
    icon: '❤️',
    type: 'social',
    requirement: 100,
    reward: { type: 'title', value: 'Level Designer' }
  }
];

export const checkEnhancedAchievements = (stats: any): Achievement[] => {
  const newAchievements: Achievement[] = [];
  
  achievements.forEach(achievement => {
    if (achievement.unlockedAt) return; // Already unlocked
    
    let isUnlocked = false;
    
    switch (achievement.id) {
      case 'speed-demon':
        isUnlocked = stats.fastestLevelTime && stats.fastestLevelTime < 10;
        break;
      case 'lightning-fast':
        isUnlocked = stats.fastLevelsCount >= 5;
        break;
      case 'perfectionist':
        isUnlocked = stats.perfectLevelsCount >= 1;
        break;
      case 'efficiency-master':
        isUnlocked = stats.perfectLevelsCount >= 10;
        break;
      case 'on-fire':
        isUnlocked = stats.currentStreakNoHints >= 5;
        break;
      case 'unstoppable':
        isUnlocked = stats.currentStreakNoUndo >= 20;
        break;
      case 'explorer':
        isUnlocked = stats.levelsCompleted >= 50;
        break;
      case 'level-master':
        isUnlocked = stats.tutorialLevelsCompleted >= 15;
        break;
      case 'creator':
        isUnlocked = stats.customLevelsCreated >= 1;
        break;
      case 'popular-creator':
        isUnlocked = stats.totalLikesReceived >= 100;
        break;
    }
    
    if (isUnlocked) {
      achievement.unlockedAt = new Date();
      newAchievements.push(achievement);
    }
  });
  
  return newAchievements;
};
