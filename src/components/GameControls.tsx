
import React from "react";
import { RefreshCw, Trophy, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameControlsProps {
  level: number;
  moves: number;
  onRestart: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ level, moves, onRestart }) => {
  return (
    <motion.div 
      className="w-full flex justify-between items-center mb-4 px-2 mt-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="flex items-center space-x-2 bg-[#FEF7CD] p-2 rounded-lg shadow-md"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Trophy size={16} className="text-[#ea384c]" />
        <span className="font-medium">
          Level: {level}
        </span>
      </motion.div>
      
      <motion.div 
        className="flex items-center space-x-2 bg-[#FEF7CD] p-2 rounded-lg shadow-md"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Move size={16} className="text-[#7E69AB]" />
        <span className="font-medium">Moves: {moves}</span>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          variant="outline"
          size="icon"
          onClick={onRestart}
          className="shadow-md bg-[#FEC6A1] hover:bg-[#FEC6A1]/90 border-none"
        >
          <RefreshCw size={18} />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default GameControls;
