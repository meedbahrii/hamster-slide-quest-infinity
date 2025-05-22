
import React, { useState, useEffect } from "react";
import { tutorialLevels } from "../utils/levels";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Star, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface LevelSelectorProps {
  onLevelSelect?: (level: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onLevelSelect }) => {
  const { toast } = useToast();
  const [highestLevel, setHighestLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const levelsPerPage = 18; // Show 18 levels per page (6x3 grid)
  
  // Get highest unlocked level from localStorage
  useEffect(() => {
    const storedHighestLevel = localStorage.getItem("highestLevel");
    const parsedHighestLevel = storedHighestLevel ? parseInt(storedHighestLevel, 10) : 1;
    setHighestLevel(parsedHighestLevel);
    
    const storedCompletedLevels = localStorage.getItem("completedLevels");
    const parsedCompletedLevels = storedCompletedLevels ? JSON.parse(storedCompletedLevels) : [];
    setCompletedLevels(parsedCompletedLevels);
    
    // Set initial page based on highest level
    const initialPage = Math.floor((parsedHighestLevel - 1) / levelsPerPage);
    setCurrentPage(initialPage);
  }, []);
  
  // Calculate total number of levels
  const totalLevels = tutorialLevels.length;
  const totalPages = Math.ceil(totalLevels / levelsPerPage);
  
  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Generate level buttons based on current page
  const generateLevelButtons = () => {
    const startLevel = currentPage * levelsPerPage + 1;
    const endLevel = Math.min(startLevel + levelsPerPage - 1, totalLevels);
    const levels = [];
    
    for (let i = startLevel; i <= endLevel; i++) {
      const isUnlocked = i <= highestLevel;
      const isCompleted = completedLevels.includes(i);
      const isTutorial = i <= 20; // First 20 levels are tutorial levels
      
      levels.push(
        <motion.div
          key={`level-${i}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.03 * (i - startLevel), duration: 0.2 }}
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
      description: level <= 20 ? "Tutorial level" : "Challenge level",
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
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold mb-2">Select Level</h2>
          <div className="h-1 w-16 bg-[#ea384c]/60 rounded-full mb-6"></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{`Page ${currentPage + 1}/${totalPages}`}</span>
        </div>
      </motion.div>
      
      <ScrollArea className="flex-1 pr-4">
        <div className="grid grid-cols-3 gap-4 p-1">
          {generateLevelButtons()}
        </div>
      </ScrollArea>
      
      <div className="flex items-center justify-between mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrevPage} 
          disabled={currentPage === 0}
          className="flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" /> Previous
        </Button>
        <div className="flex gap-1">
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageToShow = currentPage < 2 
              ? i 
              : currentPage > totalPages - 3 
                ? totalPages - 5 + i 
                : currentPage - 2 + i;
                
            if (pageToShow >= 0 && pageToShow < totalPages) {
              return (
                <Button
                  key={`page-${pageToShow}`}
                  variant={pageToShow === currentPage ? "default" : "outline"}
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setCurrentPage(pageToShow)}
                >
                  {pageToShow + 1}
                </Button>
              );
            }
            return null;
          })}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages - 1}
          className="flex items-center"
        >
          Next <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
      
      <motion.div 
        className="mt-6 p-4 bg-[#FEF7CD]/70 rounded-xl text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p><strong>{totalLevels} levels</strong> await you! Complete them all to become a puzzle master.</p>
      </motion.div>
    </div>
  );
};

export default LevelSelector;
