
import { useEffect } from "react";
import GameBoard from "../components/GameBoard";
import Header from "../components/Header";

const Index = () => {
  useEffect(() => {
    // Update the document title
    document.title = "Hamster Puzzle ∞";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#f5e8d2] p-4">
      <Header />
      <GameBoard />
    </div>
  );
};

export default Index;
