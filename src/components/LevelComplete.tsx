
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trophy, Star } from "lucide-react";
import confetti from "../utils/confetti";
import { motion } from "framer-motion";

interface LevelCompleteProps {
  level: number;
  moves: number;
  onNextLevel: () => void;
}

const LevelComplete: React.FC<LevelCompleteProps> = ({ level, moves, onNextLevel }) => {
  useEffect(() => {
    // Trigger confetti effect when component mounts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Additional confetti after a delay
    const timeout = setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.7, x: 0.5 }
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        className="bg-[#f5e8d2] rounded-2xl shadow-2xl p-6 max-w-xs w-full mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <motion.div 
          className="mb-5 flex justify-center"
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="w-20 h-20 rounded-full bg-[#FCD34D]/20 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1], 
                rotateZ: [0, 10, -10, 0] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2 
              }}
            >
              <Trophy className="w-10 h-10 text-[#ea384c]" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center mb-2">Level Complete!</h2>
          
          <div className="flex justify-center my-3">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }}
            >
              <Star className="text-yellow-500 fill-yellow-500 w-6 h-6 mx-1" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
            >
              <Star className="text-yellow-500 fill-yellow-500 w-6 h-6 mx-1" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
            >
              <Star className="text-yellow-500 fill-yellow-500 w-6 h-6 mx-1" />
            </motion.div>
          </div>
          
          <div className="flex justify-between my-6 bg-white/50 p-4 rounded-xl">
            <div className="text-center flex-1">
              <p className="text-sm text-gray-500">Level</p>
              <p className="text-2xl font-bold">{level}</p>
            </div>
            <div className="h-full w-px bg-gray-200 mx-2"></div>
            <div className="text-center flex-1">
              <p className="text-sm text-gray-500">Moves</p>
              <p className="text-2xl font-bold">{moves}</p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onNextLevel} 
              className="w-full bg-gradient-to-r from-[#ea384c] to-[#ea384c]/90 hover:from-[#ea384c]/90 hover:to-[#ea384c] text-white gap-2 h-12 text-lg shadow-lg"
            >
              Next Level
              <ChevronRight size={20} />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LevelComplete;
