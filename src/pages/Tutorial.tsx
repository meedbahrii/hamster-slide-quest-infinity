
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  Undo, 
  Timer, 
  Trophy, 
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Tutorial = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBackToGame = () => {
    navigate("/");
    toast({
      title: "Returning to game",
      description: "Let's solve some puzzles!",
    });
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start p-4 overflow-x-hidden"
      style={{
        background: `linear-gradient(135deg, #f5e8d2 0%, #f0d4b8 100%)`,
        backgroundSize: '100% 100%',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute w-40 h-40 rounded-full bg-[#FEC6A1]/40 blur-3xl -top-10 -left-10"></div>
        <div className="absolute w-60 h-60 rounded-full bg-[#E5DEFF]/30 blur-3xl top-1/4 -right-20"></div>
        <div className="absolute w-40 h-40 rounded-full bg-[#FEF7CD]/40 blur-3xl bottom-10 left-10"></div>
      </div>
      
      <motion.div
        className="z-10 flex flex-col items-center w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center justify-between w-full mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={handleBackToGame}
            className="shadow-md bg-[#FEC6A1] hover:bg-[#FEC6A1]/90 border-none"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Game
          </Button>
          
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="mr-2 text-2xl"
            >
              🐹
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1F2C]">How to Play</h1>
          </div>
        </motion.div>

        {/* Tutorial content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8 w-full">
          <section className="mb-8">
            <motion.h2 
              className="text-2xl font-bold mb-4 text-[#7E69AB] flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Trophy size={24} className="mr-2 text-[#ea384c]" />
              Game Objective
            </motion.h2>
            <motion.p 
              className="mb-4 text-gray-700"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              The goal of Hamster Puzzle is to help our little hamster friend escape the maze by 
              navigating it to the exit on the right side of the grid. Each level presents unique
              challenges that require strategic thinking and careful planning.
            </motion.p>

            <motion.div 
              className="flex flex-col md:flex-row gap-6 mb-6"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex-1 bg-[#FEF7CD]/60 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-[#1A1F2C]">The Hamster</h3>
                <div className="flex items-center justify-center mb-2 bg-white/50 p-3 rounded-md">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-3xl"
                  >
                    🐹
                  </motion.div>
                </div>
                <p className="text-sm text-gray-700">
                  This is your hamster (the yellow block). Your goal is to move it through the maze
                  to reach the exit on the right side of the grid.
                </p>
              </div>
              
              <div className="flex-1 bg-[#E5DEFF]/60 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-[#1A1F2C]">The Exit</h3>
                <div className="flex items-center justify-center mb-2 bg-white/50 p-3 rounded-md">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="border-l-2 border-dotted border-[#FCD34D] h-8"
                  />
                </div>
                <p className="text-sm text-gray-700">
                  The exit is located on the right edge of the grid. Line up your hamster with the exit to complete the level.
                </p>
              </div>
            </motion.div>
          </section>

          <section className="mb-8">
            <motion.h2 
              className="text-2xl font-bold mb-4 text-[#7E69AB] flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ArrowRight size={24} className="mr-2 text-[#ea384c]" />
              Game Controls
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-[#1A1F2C] flex items-center">
                  <span className="w-6 h-6 bg-[#9AE6B4] rounded-md mr-2"></span>
                  Green Blocks
                </h3>
                <p className="text-sm text-gray-700">
                  Horizontal blocks that can only move left and right.
                </p>
              </div>
              
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-[#1A1F2C] flex items-center">
                  <span className="w-6 h-6 bg-[#FEB2B2] rounded-md mr-2"></span>
                  Red Blocks
                </h3>
                <p className="text-sm text-gray-700">
                  Vertical blocks that can only move up and down.
                </p>
              </div>
              
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-[#1A1F2C] flex items-center">
                  <span className="w-6 h-6 bg-[#FCD34D] rounded-md mr-2"></span>
                  Hamster Block
                </h3>
                <p className="text-sm text-gray-700">
                  The key block with your hamster that can only move left and right.
                </p>
              </div>
              
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-[#1A1F2C] flex items-center gap-2">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-[#FEC6A1] p-1 rounded-md"
                  >
                    <RefreshCw size={16} />
                  </motion.div>
                  Restart Button
                </h3>
                <p className="text-sm text-gray-700">
                  Click to restart the current level if you get stuck.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-[#FEF7CD]/70 p-5 rounded-lg mb-6"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="font-bold mb-2 text-[#1A1F2C]">How to Move Blocks</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <span className="mr-2">1.</span>
                  <p className="text-gray-700">Tap and drag a block to move it</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">2.</span>
                  <p className="text-gray-700">Blocks can only move along their orientation</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">3.</span>
                  <p className="text-gray-700">Blocks cannot move through other blocks</p>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="mb-8">
            <motion.h2 
              className="text-2xl font-bold mb-4 text-[#7E69AB] flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Star size={24} className="mr-2 text-yellow-500" />
              Game Features
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-[#1A1F2C] flex items-center">
                  <Trophy size={18} className="mr-2 text-[#ea384c]" />
                  Levels
                </h3>
                <p className="text-sm text-gray-700">
                  The game has multiple levels with increasing difficulty. Complete a level to unlock the next one.
                </p>
              </div>
              
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-[#1A1F2C] flex items-center">
                  <Timer size={18} className="mr-2 text-[#7E69AB]" />
                  Move Counter
                </h3>
                <p className="text-sm text-gray-700">
                  Try to complete each level in as few moves as possible.
                </p>
              </div>
              
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-[#1A1F2C] flex items-center">
                  <Undo size={18} className="mr-2" />
                  Level Selector
                </h3>
                <p className="text-sm text-gray-700">
                  Access the level selector menu to choose any unlocked level to play.
                </p>
              </div>
              
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-[#1A1F2C] flex items-center">
                  <Star size={18} className="mr-2 text-yellow-500 fill-yellow-500" />
                  Progress Tracking
                </h3>
                <p className="text-sm text-gray-700">
                  Your completed levels are saved automatically, so you can continue your progress anytime.
                </p>
              </div>
            </motion.div>
          </section>

          <section>
            <motion.h2 
              className="text-2xl font-bold mb-4 text-[#7E69AB]"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Tips for Success
            </motion.h2>
            
            <motion.ul 
              className="list-disc list-inside space-y-2 text-gray-700 bg-[#E5DEFF]/40 p-4 rounded-lg"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <li>Plan your moves carefully - sometimes you need to clear a path before moving the hamster.</li>
              <li>Look for the pattern in each level - there's always a solution!</li>
              <li>If you get stuck, don't hesitate to restart the level.</li>
              <li>Complete tutorial levels first to understand the game mechanics.</li>
              <li>Remember that blocks can only move in their orientation direction.</li>
            </motion.ul>
            
            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleBackToGame} 
                className="bg-gradient-to-r from-[#7E69AB] to-[#7E69AB]/90 hover:from-[#7E69AB]/90 hover:to-[#7E69AB] text-white gap-2 h-12 px-8 text-lg shadow-lg"
              >
                Start Playing
                <ArrowRight size={20} />
              </Button>
            </motion.div>
          </section>
        </div>
        
        <motion.footer 
          className="mt-10 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p>© 2025 Hamster Puzzle ∞</p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Tutorial;
