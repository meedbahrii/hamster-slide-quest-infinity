
import React, { useState, useEffect } from "react";
import { tutorialLevels } from "../utils/levels";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trophy } from "lucide-react";

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
      
      levels.push(
        <Button
          key={`level-${i}`}
          variant={isCompleted ? "default" : "outline"}
          className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${
            isUnlocked 
              ? (isCompleted ? "bg-[#7E69AB] hover:bg-[#7E69AB]/90" : "bg-[#FEC6A1] hover:bg-[#FEC6A1]/90") 
              : "bg-gray-300 opacity-50 cursor-not-allowed"
          } ${i <= tutorialLevels.length ? "border-2 border-dashed border-[#ea384c]/30" : ""}`}
          disabled={!isUnlocked}
          onClick={() => handleLevelSelect(i)}
        >
          <span className="text-lg font-bold">{i}</span>
          {i <= tutorialLevels.length && (
            <span className="text-xs mt-1">Tutorial</span>
          )}
          {isCompleted && (
            <Trophy size={12} className="mt-1 text-yellow-500" />
          )}
        </Button>
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
      <h2 className="text-2xl font-bold mb-6">Select Level</h2>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-3 gap-4 p-1">
          {generateLevelButtons()}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LevelSelector;
