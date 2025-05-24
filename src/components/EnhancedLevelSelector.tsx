
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { List, Star, Lock, Trophy, Calendar, Target } from 'lucide-react';
import { getDailyChallenge, DailyChallenge } from '../utils/dailyChallenge';

interface EnhancedLevelSelectorProps {
  currentLevel: number;
  onLevelSelect: (level: number) => void;
  onDailyChallengeSelect?: () => void;
}

const EnhancedLevelSelector: React.FC<EnhancedLevelSelectorProps> = ({ 
  currentLevel, 
  onLevelSelect,
  onDailyChallengeSelect 
}) => {
  const [highestLevel, setHighestLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("highestLevel");
    if (stored) {
      setHighestLevel(parseInt(stored, 10));
    }

    const completed = localStorage.getItem("completedLevels");
    if (completed) {
      setCompletedLevels(JSON.parse(completed));
    }

    setDailyChallenge(getDailyChallenge());
  }, []);

  const getDifficultyStars = (level: number): number => {
    if (level <= 5) return 1;
    if (level <= 15) return 2;
    if (level <= 30) return 3;
    if (level <= 50) return 4;
    return 5;
  };

  const getLevelType = (level: number): string => {
    if (level <= 20) return "Tutorial";
    if (level <= 50) return "Classic";
    if (level <= 100) return "Advanced";
    return "Expert";
  };

  const isLevelUnlocked = (level: number): boolean => {
    return level <= highestLevel;
  };

  const isLevelCompleted = (level: number): boolean => {
    return completedLevels.includes(level);
  };

  const renderLevelButton = (level: number) => {
    const unlocked = isLevelUnlocked(level);
    const completed = isLevelCompleted(level);
    const difficulty = getDifficultyStars(level);
    const isCurrent = level === currentLevel;

    return (
      <motion.div
        key={level}
        whileHover={unlocked ? { scale: 1.05 } : {}}
        whileTap={unlocked ? { scale: 0.95 } : {}}
      >
        <Button
          variant={isCurrent ? "default" : completed ? "secondary" : "outline"}
          className={`relative h-16 w-16 p-2 ${
            !unlocked 
              ? "opacity-50 cursor-not-allowed" 
              : completed 
              ? "border-green-500 bg-green-50" 
              : ""
          }`}
          onClick={() => unlocked && onLevelSelect(level)}
          disabled={!unlocked}
        >
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{level}</span>
            
            {/* Difficulty stars */}
            <div className="flex mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={8}
                  className={i < difficulty ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
          </div>

          {/* Status indicators */}
          {!unlocked && (
            <Lock size={12} className="absolute top-1 right-1 text-gray-400" />
          )}
          {completed && (
            <Trophy size={12} className="absolute top-1 right-1 text-green-600" />
          )}
        </Button>
      </motion.div>
    );
  };

  const levelGroups = [
    { name: "Tutorial", range: [1, 20], color: "bg-blue-100" },
    { name: "Classic", range: [21, 50], color: "bg-green-100" },
    { name: "Advanced", range: [51, 100], color: "bg-orange-100" },
    { name: "Expert", range: [101, 150], color: "bg-red-100" }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button variant="outline" size="icon" className="shadow-md">
            <List size={18} />
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <List size={20} />
            Level Selection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Daily Challenge Section */}
          {dailyChallenge && (
            <motion.div 
              className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="text-purple-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-purple-800">Daily Challenge</h3>
                    <p className="text-sm text-purple-600">
                      Level {dailyChallenge.level} • Target: {dailyChallenge.targetMoves} moves
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {dailyChallenge.completed && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {dailyChallenge.completedInTarget ? "Perfect!" : "Completed"}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    onClick={() => onDailyChallengeSelect?.()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Target size={16} className="mr-1" />
                    Play
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Level Groups */}
          {levelGroups.map((group) => {
            const [start, end] = group.range;
            const visibleLevels = Array.from(
              { length: Math.min(end - start + 1, Math.max(1, highestLevel - start + 5)) },
              (_, i) => start + i
            );

            if (visibleLevels.length === 0 || start > highestLevel + 5) {
              return null;
            }

            return (
              <div key={group.name} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  <Badge variant="outline">{getLevelType(start)}</Badge>
                </div>
                
                <div className="grid grid-cols-6 gap-3">
                  {visibleLevels.map(renderLevelButton)}
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-medium text-sm">Legend:</h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={8} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>Difficulty</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy size={12} className="text-green-600" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock size={12} className="text-gray-400" />
                <span>Locked</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedLevelSelector;
