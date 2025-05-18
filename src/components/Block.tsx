
import React from "react";
import { cn } from "@/lib/utils";
import { BlockProps } from "../types/gameTypes";
import { motion } from "framer-motion";

const Block: React.FC<BlockProps> = ({
  block,
  blockSize,
  cellGap,
  onPointerDown,
  onPointerMove,
  onPointerUp
}) => {
  const colors = {
    horizontal: "bg-gradient-to-r from-[#9AE6B4] to-[#68D391] border border-[#68D391]/30",
    vertical: "bg-gradient-to-b from-[#FEB2B2] to-[#FC8181] border border-[#FC8181]/30",
    key: "bg-gradient-to-r from-[#FCD34D] to-[#F6E05E] border border-[#FCD34D]/30"
  };

  const width = block.width * blockSize + (block.width - 1) * cellGap;
  const height = block.height * blockSize + (block.height - 1) * cellGap;
  
  const left = block.x * (blockSize + cellGap) + cellGap;
  const top = block.y * (blockSize + cellGap) + cellGap;

  return (
    <motion.div
      className={cn(
        "absolute rounded-lg cursor-move drop-shadow-md",
        colors[block.type],
        block.isMoving ? "ring-2 ring-white/50 z-10" : ""
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: block.isMoving ? 1.03 : 1, 
        opacity: 1,
        boxShadow: block.isMoving 
          ? "0 10px 15px -3px rgba(0, 0, 0, 0.2)" 
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
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
      {/* Inner content */}
      <div className="w-full h-full flex items-center justify-center relative">
        {block.type === "key" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <span className="text-2xl" role="img" aria-label="hamster">
                🐹
              </span>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Block;
