
import { useEffect, useState } from "react";
import GameBoard from "../components/GameBoard";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useDeviceInfo } from "@/hooks/use-mobile";

const Index = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const deviceInfo = useDeviceInfo();

  useEffect(() => {
    // Update the document title
    document.title = "Hamster Puzzle ∞";
    
    // Check for a selected level in localStorage
    const storedLevel = localStorage.getItem("selectedLevel");
    if (storedLevel) {
      setSelectedLevel(parseInt(storedLevel, 10));
      // Clear the selected level from localStorage after using it
      localStorage.removeItem("selectedLevel");
    }
  }, []);

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
        className="z-10 flex flex-col items-center w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        <GameBoard initialLevel={selectedLevel} />
        
        <motion.div
          className={`mt-6 p-4 bg-white/60 rounded-lg shadow-md ${deviceInfo.isMobile ? "max-w-xs" : "max-w-sm"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="font-bold mb-2">How to Play:</h2>
          <ul className={`list-disc list-inside space-y-1 text-left ${deviceInfo.isMobile ? "text-xs" : "text-sm"} text-[#1A1F2C]`}>
            <li>Drag the <span className="font-medium">hamster block (yellow)</span> to reach the exit</li>
            <li>Move <span className="font-medium">green blocks</span> horizontally</li>
            <li>Move <span className="font-medium">red blocks</span> vertically</li>
            <li>The hamster can push blocks if there's space behind them</li>
            <li><span className="font-medium">Red and green blocks</span> cannot share the same row or column</li>
            <li>Complete the level with as few moves as possible</li>
          </ul>
        </motion.div>
        
        <motion.footer 
          className={`mt-10 text-center ${deviceInfo.isMobile ? "text-xs" : "text-sm"} text-gray-500`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>© 2025 Hamster Puzzle ∞</p>
          <p className="text-xs mt-1">Compatible with desktop, mobile and tablets</p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Index;
