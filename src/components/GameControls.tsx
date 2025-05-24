
import React from "react";
import { RefreshCw, Trophy, Move, Lightbulb, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameControlsProps {
  level: number;
  moves: number;
  onRestart: () => void;
  onHint?: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
  hintsUsed?: number;
  undosUsed?: number;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  level, 
  moves, 
  onRestart, 
  onHint, 
  onUndo, 
  canUndo = false,
  hintsUsed = 0,
  undosUsed = 0
}) => {
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

      <div className="flex items-center space-x-2">
        {/* Hint Button */}
        {onHint && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="outline"
              size="icon"
              onClick={onHint}
              className="shadow-md bg-[#DDD6FE] hover:bg-[#DDD6FE]/90 border-none relative"
              title={`Get a hint (${hintsUsed} used)`}
            >
              <Lightbulb size={18} />
              {hintsUsed > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {hintsUsed}
                </span>
              )}
            </Button>
          </motion.div>
        )}

        {/* Undo Button */}
        {onUndo && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="outline"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              className={`shadow-md border-none relative ${
                canUndo 
                  ? "bg-[#FED7AA] hover:bg-[#FED7AA]/90" 
                  : "bg-gray-200 opacity-50"
              }`}
              title={`Undo last move (${undosUsed} used)`}
            >
              <Undo2 size={18} />
              {undosUsed > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {undosUsed}
                </span>
              )}
            </Button>
          </motion.div>
        )}
        
        {/* Restart Button */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button 
            variant="outline"
            size="icon"
            onClick={onRestart}
            className="shadow-md bg-[#FEC6A1] hover:bg-[#FEC6A1]/90 border-none"
            title="Restart level"
          >
            <RefreshCw size={18} />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameControls;
