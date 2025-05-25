
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Hand } from 'lucide-react';
import { BlockData } from '../types/gameTypes';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  highlightBlockId?: string;
  targetPosition?: { x: number; y: number };
  allowedMoves?: string[];
}

interface InteractiveTutorialProps {
  onComplete: () => void;
  gameBlocks: BlockData[];
  onMoveBlock: (blockId: string, direction: 'up' | 'down' | 'left' | 'right') => void;
}

const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({ 
  onComplete, 
  gameBlocks, 
  onMoveBlock 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompletedMove, setHasCompletedMove] = useState(false);

  useEffect(() => {
    const hasSeenInteractiveTutorial = localStorage.getItem('hasSeenInteractiveTutorial');
    if (!hasSeenInteractiveTutorial) {
      setIsOpen(true);
    }
  }, []);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 0,
      title: "Welcome to Interactive Tutorial!",
      description: "Let's learn by doing! I'll guide you through your first moves.",
    },
    {
      id: 1,
      title: "Find the Hamster",
      description: "Look for the orange hamster block 🐹. This is what you need to move to the exit.",
      highlightBlockId: "key",
    },
    {
      id: 2,
      title: "Try Moving the Hamster",
      description: "Drag the hamster block to the right. The goal is to get it to the exit door.",
      highlightBlockId: "key",
      allowedMoves: ["right"],
    },
    {
      id: 3,
      title: "Blocked Path",
      description: "The hamster can't move because there's a block in the way. Let's move that block first.",
      highlightBlockId: "vertical-1",
    },
    {
      id: 4,
      title: "Move the Vertical Block",
      description: "Drag the red vertical block up or down to clear the path for the hamster.",
      highlightBlockId: "vertical-1",
      allowedMoves: ["up", "down"],
    },
    {
      id: 5,
      title: "Now Move the Hamster!",
      description: "Great! Now drag the hamster to the right toward the exit door.",
      highlightBlockId: "key",
      allowedMoves: ["right"],
    },
    {
      id: 6,
      title: "Tutorial Complete!",
      description: "Excellent! You've learned the basics. Keep practicing to master more complex puzzles!",
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setHasCompletedMove(false);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setHasCompletedMove(false);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenInteractiveTutorial', 'true');
    setIsOpen(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentStepData = tutorialSteps[currentStep];
  const isWaitingForMove = currentStepData.allowedMoves && !hasCompletedMove;

  // Monitor for correct moves
  useEffect(() => {
    if (currentStepData.allowedMoves && !hasCompletedMove) {
      // Check if the expected move was made
      const highlightedBlock = gameBlocks.find(block => block.id === currentStepData.highlightBlockId);
      if (highlightedBlock && currentStepData.targetPosition) {
        const hasReachedTarget = 
          highlightedBlock.x === currentStepData.targetPosition.x &&
          highlightedBlock.y === currentStepData.targetPosition.y;
        
        if (hasReachedTarget) {
          setHasCompletedMove(true);
          setTimeout(() => handleNext(), 1000); // Auto-advance after successful move
        }
      }
    }
  }, [gameBlocks, currentStepData, hasCompletedMove]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-4 py-4"
            >
              {/* Animated hand pointer for move steps */}
              {isWaitingForMove && (
                <motion.div
                  className="mb-4 flex justify-center"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Hand className="text-blue-500" size={32} />
                </motion.div>
              )}
              
              <h2 className="text-xl font-bold">
                {currentStepData.title}
              </h2>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {currentStepData.description}
              </p>

              {isWaitingForMove && (
                <motion.div
                  className="bg-blue-50 p-3 rounded-lg border border-blue-200"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-blue-700 text-sm font-medium">
                    👆 Try it yourself! Drag the highlighted block.
                  </p>
                </motion.div>
              )}

              {hasCompletedMove && (
                <motion.div
                  className="bg-green-50 p-3 rounded-lg border border-green-200"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <p className="text-green-700 text-sm font-medium">
                    ✅ Perfect! Well done!
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mt-6 mb-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 
                  index < currentStep ? 'bg-green-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-sm"
            >
              Skip Tutorial
            </Button>

            <div className="flex space-x-2">
              {currentStep > 0 && !isWaitingForMove && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>
              )}
              
              {!isWaitingForMove && (
                <Button
                  onClick={handleNext}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {currentStep === tutorialSteps.length - 1 ? (
                    "Complete"
                  ) : (
                    <>
                      Next
                      <ChevronRight size={16} />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InteractiveTutorial;
