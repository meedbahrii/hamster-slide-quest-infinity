
import React, { useState, useEffect } from "react";
import { tutorialLevels } from "../utils/levels";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Star, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface LevelSelectorProps {
  onLevelSelect?: (level: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onLevelSelect }) => {
  const { toast } = useToast();
  const [highestLevel, setHighestLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  
  // Get highest unlocked level from localStorage
  useEffect(() => {
    const storedHighestLevel = localStorage.getItem("highestLevel");
    const parsedHighestLevel = storedHighestLevel ? parseInt(storedHighestLevel, 10) : 1;
    setHighestLevel(parsedHighestLevel);
    
    const storedCompletedLevels = localStorage.getItem("completedLevels");
    const parsedCompletedLevels = storedCompletedLevels ? JSON.parse(storedCompletedLevels) : [];
    setCompletedLevels(parsedCompletedLevels);
  }, []);
  
  // Generate level buttons based on highest unlocked level
  const generateLevelButtons = () => {
    // Tutorial levels + a reasonable number of procedural levels
    const totalLevels = Math.max(highestLevel + 3, tutorialLevels.length + 10);
    const levels = [];
    
    for (let i = 1; i <= totalLevels; i++) {
      const isUnlocked = i <= highestLevel;
      const isCompleted = completedLevels.includes(i);
      const isTutorial = i <= tutorialLevels.length;
      
      levels.push(
        <motion.div
          key={`level-${i}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.03 * i, duration: 0.2 }}
          whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
          whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
        >
          <Button
            variant={isCompleted ? "default" : "outline"}
            className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center relative ${
              isUnlocked 
                ? (isCompleted ? "bg-[#7E69AB] hover:bg-[#7E69AB]/90" : "bg-[#FEC6A1] hover:bg-[#FEC6A1]/90") 
                : "bg-gray-200 opacity-70 cursor-not-allowed"
            } ${isTutorial ? "border-2 border-dashed border-[#ea384c]/30" : ""}`}
            disabled={!isUnlocked}
            onClick={() => handleLevelSelect(i)}
          >
            <span className="text-2xl font-bold">{i}</span>
            {isTutorial && (
              <span className="text-xs mt-1">Tutorial</span>
            )}
            {!isUnlocked && (
              <Lock size={14} className="absolute top-2 right-2 text-gray-400" />
            )}
            {isCompleted && (
              <div className="absolute -top-2 -right-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: i * 0.2 }}
                >
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                </motion.div>
              </div>
            )}
          </Button>
        </motion.div>
      );
    }
    
    return levels;
  };
  
  const handleLevelSelect = (level: number) => {
    // We'll handle level selection via localStorage 
    localStorage.setItem("selectedLevel", level.toString());
    
    // Call the onLevelSelect callback if provided
    if (onLevelSelect) {
      onLevelSelect(level);
    }
    
    // Notify the user
    toast({
      title: `Level ${level} Selected`,
      description: level <= tutorialLevels.length ? "Tutorial level" : "Challenge level",
    });
    
    // We'll refresh the page to reload the level
    window.location.reload();
  };
  
  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-2">Select Level</h2>
        <div className="h-1 w-16 bg-[#ea384c]/60 rounded-full mb-6"></div>
      </motion.div>
      
      <ScrollArea className="flex-1 pr-4">
        <div className="grid grid-cols-3 gap-4 p-1">
          {generateLevelButtons()}
        </div>
      </ScrollArea>
      
      <motion.div 
        className="mt-6 p-4 bg-[#FEF7CD]/70 rounded-xl text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p>Complete levels to unlock more challenges!</p>
      </motion.div>
    </div>
  );
};

export default LevelSelector;
