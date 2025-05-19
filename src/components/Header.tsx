
import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { List, HelpCircle } from "lucide-react";
import LevelSelector from "./LevelSelector";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleHelpClick = () => {
    navigate("/tutorial");
  };

  return (
    <motion.header 
      className="w-full max-w-md flex justify-between items-center mb-6 mt-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <motion.div
          animate={{ rotate: [0, 5, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="mr-2 text-2xl"
        >
          🐹
        </motion.div>
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-[#1A1F2C] tracking-tight"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Hamster Puzzle <span className="text-[#ea384c]">∞</span>
        </motion.h1>
      </div>
      
      <div className="flex space-x-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="shadow-md bg-[#FEC6A1] hover:bg-[#FEC6A1]/90 border-none"
              >
                <List size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#f5e8d2] border-[#FEC6A1]/50">
              <LevelSelector />
            </SheetContent>
          </Sheet>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="shadow-md bg-[#E5DEFF] hover:bg-[#E5DEFF]/90 border-none"
            onClick={handleHelpClick}
          >
            <HelpCircle size={18} className="text-[#7E69AB]" />
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
