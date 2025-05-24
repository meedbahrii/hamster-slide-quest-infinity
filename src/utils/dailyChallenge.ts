
interface DailyChallenge {
  id: string;
  date: string;
  level: number;
  targetMoves: number;
  completed: boolean;
  completedInTarget: boolean;
  reward: {
    type: 'hints' | 'achievement';
    amount: number;
  };
}

export const generateDailyChallenge = (): DailyChallenge => {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('dailyChallenge');
  
  if (stored) {
    const challenge = JSON.parse(stored);
    if (challenge.date === today) {
      return challenge;
    }
  }
  
  // Generate new challenge for today
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const challengeLevel = (dayOfYear % 50) + 1; // Cycle through levels 1-50
  const targetMoves = Math.max(3, Math.floor(Math.random() * 8) + 3); // 3-10 moves
  
  const newChallenge: DailyChallenge = {
    id: `daily-${today}`,
    date: today,
    level: challengeLevel,
    targetMoves,
    completed: false,
    completedInTarget: false,
    reward: {
      type: Math.random() > 0.5 ? 'hints' : 'achievement',
      amount: targetMoves <= 5 ? 3 : 2
    }
  };
  
  localStorage.setItem('dailyChallenge', JSON.stringify(newChallenge));
  return newChallenge;
};

export const completeDailyChallenge = (moves: number): DailyChallenge | null => {
  const stored = localStorage.getItem('dailyChallenge');
  if (!stored) return null;
  
  const challenge = JSON.parse(stored);
  const today = new Date().toDateString();
  
  if (challenge.date !== today || challenge.completed) {
    return null;
  }
  
  challenge.completed = true;
  challenge.completedInTarget = moves <= challenge.targetMoves;
  
  localStorage.setItem('dailyChallenge', JSON.stringify(challenge));
  
  return challenge;
};

export const getDailyChallenge = (): DailyChallenge => {
  return generateDailyChallenge();
};
