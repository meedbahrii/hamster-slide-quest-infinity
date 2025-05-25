
import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { BlockProps } from "../types/gameTypes";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";

const OptimizedBlock: React.FC<BlockProps> = memo(({
  block,
  blockSize,
  cellGap,
  onPointerDown,
  onPointerMove,
  onPointerUp
}) => {
  const currentTheme = useGameStore((state) => state.currentTheme);
  
  const getThemeColors = (theme: string, blockType: string) => {
    const themes = {
      default: {
        horizontal: "bg-gradient-to-r from-[#10B981] to-[#059669] shadow-lg shadow-green-500/20 border border-green-400/30",
        vertical: "bg-gradient-to-b from-[#EF4444] to-[#DC2626] shadow-lg shadow-red-500/20 border border-red-400/30",
        key: "bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] shadow-lg shadow-yellow-500/20 border border-yellow-400/30"
      },
      ocean: {
        horizontal: "bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] shadow-lg shadow-blue-500/20 border border-blue-400/30",
        vertical: "bg-gradient-to-b from-[#06B6D4] to-[#0891B2] shadow-lg shadow-cyan-500/20 border border-cyan-400/30",
        key: "bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] shadow-lg shadow-yellow-500/20 border border-yellow-400/30"
      },
      forest: {
        horizontal: "bg-gradient-to-r from-[#16A34A] to-[#15803D] shadow-lg shadow-green-500/20 border border-green-400/30",
        vertical: "bg-gradient-to-b from-[#84CC16] to-[#65A30D] shadow-lg shadow-lime-500/20 border border-lime-400/30",
        key: "bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] shadow-lg shadow-yellow-500/20 border border-yellow-400/30"
      },
      neon: {
        horizontal: "bg-gradient-to-r from-[#F72585] to-[#B5179E] shadow-lg shadow-pink-500/20 border border-pink-400/30",
        vertical: "bg-gradient-to-b from-[#7209B7] to-[#560BAD] shadow-lg shadow-purple-500/20 border border-purple-400/30",
        key: "bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] shadow-lg shadow-yellow-500/20 border border-yellow-400/30"
      }
    };
    
    return themes[theme as keyof typeof themes]?.[blockType as keyof typeof themes.default] || themes.default[blockType as keyof typeof themes.default];
  };

  const width = block.width * blockSize + (block.width - 1) * cellGap;
  const height = block.height * blockSize + (block.height - 1) * cellGap;
  
  const left = block.x * (blockSize + cellGap) + cellGap;
  const top = block.y * (blockSize + cellGap) + cellGap;

  const colors = getThemeColors(currentTheme, block.type);

  return (
    <motion.div
      className={cn(
        "absolute rounded-xl cursor-move transition-all duration-200",
        colors,
        block.isMoving ? "ring-2 ring-white/50 z-10 scale-105" : "",
        block.isHighlighted ? "ring-2 ring-blue-400 ring-opacity-75 animate-pulse" : ""
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: block.isMoving ? 1.05 : 1, 
        opacity: 1,
        boxShadow: block.isMoving 
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.3)" 
          : block.isHighlighted
          ? "0 0 20px rgba(59, 130, 246, 0.5)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.2)" 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.2 
      }}
      onPointerDown={(e) => onPointerDown(e, block)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-full h-full flex items-center justify-center relative">
        {block.type === "key" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-3xl"
            >
              🐹
            </motion.div>
          </div>
        )}
        
        <div className="absolute inset-1 rounded-lg bg-white/10 opacity-30"></div>
        
        {block.isHighlighted && (
          <motion.div
            className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            !
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.block.x === nextProps.block.x &&
    prevProps.block.y === nextProps.block.y &&
    prevProps.block.isMoving === nextProps.block.isMoving &&
    prevProps.block.isHighlighted === nextProps.block.isHighlighted &&
    prevProps.blockSize === nextProps.blockSize &&
    prevProps.cellGap === nextProps.cellGap
  );
});

OptimizedBlock.displayName = 'OptimizedBlock';

export default OptimizedBlock;
