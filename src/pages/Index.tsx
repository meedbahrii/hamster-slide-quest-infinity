
import { useEffect, useState } from "react";
import GameBoard from "../components/GameBoard";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useDeviceInfo } from "@/hooks/use-mobile";
import { Capacitor } from "@capacitor/core";

const Index = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const deviceInfo = useDeviceInfo();
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    setIsNativeApp(Capacitor.isNativePlatform());
    document.title = "Hamster Puzzle ∞";
    
    const storedLevel = localStorage.getItem("selectedLevel");
    if (storedLevel) {
      setSelectedLevel(parseInt(storedLevel, 10));
      localStorage.removeItem("selectedLevel");
    }
  }, []);

  const nativeAppClass = isNativeApp ? "pt-safe-top pb-safe-bottom px-safe" : "";

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-start p-4 overflow-x-hidden ${nativeAppClass}`}
      style={{
        background: `linear-gradient(135deg, #1f2937 0%, #111827 100%)`,
        backgroundSize: '100% 100%',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute w-40 h-40 rounded-full bg-blue-500/20 blur-3xl -top-10 -left-10"></div>
        <div className="absolute w-60 h-60 rounded-full bg-purple-500/10 blur-3xl top-1/4 -right-20"></div>
        <div className="absolute w-40 h-40 rounded-full bg-green-500/20 blur-3xl bottom-10 left-10"></div>
      </div>
      
      <motion.div
        className="z-10 flex flex-col items-center w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        <GameBoard initialLevel={selectedLevel} />
        
        {/* How to play section */}
        {(!isNativeApp || deviceInfo.isDesktop) && (
          <motion.div
            className={`mt-6 p-4 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 ${deviceInfo.isMobile ? "max-w-xs" : "max-w-sm"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="font-bold mb-3 text-white text-lg">🎮 How to Play</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">🔑</span>
                <span>Move the <strong className="text-yellow-400">key</strong> to the exit door</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                <span><strong className="text-green-400">Green blocks</strong> slide horizontally</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-4 bg-red-500 rounded-sm"></div>
                <span><strong className="text-red-400">Red blocks</strong> slide vertically</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">💡</span>
                <span>Use hints and undo when stuck</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">🏆</span>
                <span>Complete levels with fewer moves for better scores</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.footer 
          className={`mt-6 text-center ${deviceInfo.isMobile ? "text-xs" : "text-sm"} text-gray-500`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>© 2025 Hamster Puzzle ∞</p>
          <p className="text-xs mt-1 text-gray-600">Solve puzzles • Challenge your mind</p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Index;
