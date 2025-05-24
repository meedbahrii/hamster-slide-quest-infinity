
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Grid3X3, Star, Lock, Trophy, Play } from "lucide-react";
import { tutorialLevels } from "../utils/levels";

interface ModernLevelSelectorProps {
  currentLevel: number;
  onLevelSelect: (level: number) => void;
}

const ModernLevelSelector: React.FC<ModernLevelSelectorProps> = ({ 
  currentLevel, 
  onLevelSelect 
}) => {
  const [highestLevel, setHighestLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("highestLevel");
    if (stored) {
      setHighestLevel(parseInt(stored, 10));
    }

    const completed = localStorage.getItem("completedLevels");
    if (completed) {
      setCompletedLevels(JSON.parse(completed));
    }
  }, []);

  const isLevelUnlocked = (level: number): boolean => {
    return level <= highestLevel;
  };

  const isLevelCompleted = (level: number): boolean => {
    return completedLevels.includes(level);
  };

  const handleLevelSelect = (level: number) => {
    localStorage.setItem("selectedLevel", level.toString());
    onLevelSelect(level);
    window.location.reload();
  };

  const renderLevelGrid = () => {
    const levels = [];
    const totalLevels = Math.min(tutorialLevels.length, 15); // Show first 15 levels
    
    for (let i = 1; i <= totalLevels; i++) {
      const unlocked = isLevelUnlocked(i);
      const completed = isLevelCompleted(i);
      const isCurrent = i === currentLevel;

      levels.push(
        <motion.div
          key={i}
          className="relative"
          whileHover={unlocked ? { scale: 1.05 } : {}}
          whileTap={unlocked ? { scale: 0.95 } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.02 }}
        >
          <div
            className={`
              w-20 h-20 rounded-2xl flex flex-col items-center justify-center relative cursor-pointer
              ${!unlocked 
                ? "bg-gray-600 opacity-50" 
                : completed 
                ? "bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30" 
                : isCurrent
                ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
                : "bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg hover:shadow-xl"
              }
              transition-all duration-300
            `}
            onClick={() => unlocked && handleLevelSelect(i)}
          >
            {/* Level preview mini-grid */}
            <div className="grid grid-cols-3 gap-0.5 mb-1 scale-50">
              <div className="w-2 h-1 bg-green-400 rounded-sm"></div>
              <div className="w-1 h-2 bg-red-400 rounded-sm"></div>
              <div className="w-2 h-1 bg-green-400 rounded-sm"></div>
              <div className="w-1 h-2 bg-red-400 rounded-sm"></div>
              <div className="w-2 h-1 bg-yellow-400 rounded-sm"></div>
              <div className="w-1 h-2 bg-red-400 rounded-sm"></div>
            </div>
            
            {/* Level number */}
            <span className="text-white text-sm font-bold">
              lvl {i}
            </span>

            {/* Status indicators */}
            {!unlocked && (
              <Lock size={12} className="absolute top-2 right-2 text-gray-400" />
            )}
            {completed && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                <Star size={10} className="fill-white text-white" />
              </div>
            )}
            {isCurrent && (
              <div className="absolute -top-1 -left-1 bg-blue-500 rounded-full p-1">
                <Play size={10} className="fill-white text-white" />
              </div>
            )}
          </div>
          
          {/* Completion status */}
          <div className="text-center mt-1">
            {completed ? (
              <span className="text-xs text-green-400 font-medium">Completed</span>
            ) : unlocked ? (
              <span className="text-xs text-gray-400">Play</span>
            ) : (
              <span className="text-xs text-gray-500">🔒</span>
            )}
          </div>
        </motion.div>
      );
    }
    
    return levels;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white shadow-lg"
        >
          <Grid3X3 size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Trophy className="text-yellow-400" size={20} />
            Levels
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress stats */}
          <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">🔑</div>
              <div className="text-xs text-gray-400">Current</div>
              <div className="text-sm font-medium">{currentLevel}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">🏆</div>
              <div className="text-xs text-gray-400">Completed</div>
              <div className="text-sm font-medium">{completedLevels.length}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">🔓</div>
              <div className="text-xs text-gray-400">Unlocked</div>
              <div className="text-sm font-medium">{highestLevel}</div>
            </div>
          </div>

          {/* Level grid */}
          <ScrollArea className="h-80">
            <div className="grid grid-cols-3 gap-4 p-2">
              {renderLevelGrid()}
            </div>
          </ScrollArea>

          {/* Legend */}
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-700 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-600 rounded opacity-50"></div>
              <span>Locked</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModernLevelSelector;
