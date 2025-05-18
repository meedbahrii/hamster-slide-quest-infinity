
import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { List } from "lucide-react";
import LevelSelector from "./LevelSelector";

const Header = () => {
  return (
    <header className="w-full max-w-md flex justify-between items-center mb-6 mt-4">
      <h1 className="text-3xl md:text-4xl font-bold text-[#1A1F2C] tracking-tight">
        Hamster Puzzle <span className="text-[#ea384c]">∞</span>
      </h1>
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
    </header>
  );
};

export default Header;
