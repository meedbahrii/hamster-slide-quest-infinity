
import { useEffect, useState } from "react";
import GameBoard from "../components/GameBoard";
import Header from "../components/Header";

const Index = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

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
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#f5e8d2] p-4">
      <Header />
      <GameBoard initialLevel={selectedLevel} />
    </div>
  );
};

export default Index;
