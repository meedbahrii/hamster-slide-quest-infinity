
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trophy } from "lucide-react";
import confetti from "../utils/confetti";

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
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#f5e8d2] rounded-xl shadow-xl p-6 max-w-xs w-full mx-4 animate-in zoom-in-95 duration-300">
        <div className="mb-5 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#FCD34D]/20 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-[#ea384c]" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Level Complete!</h2>
        
        <div className="flex justify-between my-6">
          <div className="text-center flex-1">
            <p className="text-sm text-gray-500">Level</p>
            <p className="text-xl font-bold">{level}</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-sm text-gray-500">Moves</p>
            <p className="text-xl font-bold">{moves}</p>
          </div>
        </div>
        
        <Button 
          onClick={onNextLevel} 
          className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white gap-2"
        >
          Next Level
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default LevelComplete;
