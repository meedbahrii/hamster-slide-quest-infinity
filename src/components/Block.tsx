import React from "react";
import { cn } from "@/lib/utils";
import { BlockProps } from "../types/gameTypes";
import { motion } from "framer-motion";
import OptimizedBlock from './OptimizedBlock';

const Block: React.FC<BlockProps> = (props) => {
  return <OptimizedBlock {...props} />;
};

export default Block;
