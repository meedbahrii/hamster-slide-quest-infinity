
import React from "react";
import { cn } from "@/lib/utils";
import { BlockProps } from "../types/gameTypes";

const Block: React.FC<BlockProps> = ({
  block,
  blockSize,
  cellGap,
  onPointerDown,
  onPointerMove,
  onPointerUp
}) => {
  const colors = {
    horizontal: "bg-gradient-to-r from-[#9AE6B4] to-[#68D391]",
    vertical: "bg-gradient-to-b from-[#FEB2B2] to-[#FC8181]",
    key: "bg-gradient-to-r from-[#FCD34D] to-[#F6E05E]"
  };

  const width = block.width * blockSize + (block.width - 1) * cellGap;
  const height = block.height * blockSize + (block.height - 1) * cellGap;
  
  const left = block.x * (blockSize + cellGap) + cellGap;
  const top = block.y * (blockSize + cellGap) + cellGap;

  return (
    <div
      className={cn(
        "absolute rounded-md cursor-move shadow-md transition-all duration-150",
        colors[block.type],
        block.isMoving ? "shadow-lg scale-[1.03] z-10" : ""
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
      }}
      onPointerDown={(e) => onPointerDown(e, block)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Inner content */}
      <div className="w-full h-full flex items-center justify-center">
        {block.type === "key" && (
          <span className="text-2xl" role="img" aria-label="hamster">
            🐹
          </span>
        )}
      </div>
    </div>
  );
};

export default Block;
