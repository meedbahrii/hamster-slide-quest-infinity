
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Play } from 'lucide-react';
import AppIcon from './AppIcon';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  illustration: React.ReactNode;
}

interface OnboardingTutorialProps {
  onComplete: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setIsOpen(true);
    }
  }, []);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 0,
      title: "Welcome to Hamster Puzzle!",
      description: "Help the cute hamster escape by sliding blocks out of the way. Let's learn how to play!",
      illustration: <AppIcon size={80} className="mx-auto" />
    },
    {
      id: 1,
      title: "Move the Hamster",
      description: "The orange hamster block can only move horizontally (left and right). Your goal is to get it to the exit!",
      illustration: (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-4 bg-orange-500 rounded-sm"></div>
          <ChevronRight className="text-gray-400" />
          <div className="w-2 h-4 border-2 border-dashed border-yellow-400 rounded-sm"></div>
        </div>
      )
    },
    {
      id: 2,
      title: "Clear the Path",
      description: "Other blocks might be in the way. Horizontal blocks move left-right, vertical blocks move up-down.",
      illustration: (
        <div className="grid grid-cols-3 gap-1 w-16 h-16 mx-auto">
          <div className="w-full h-4 bg-red-500 rounded-sm col-span-2"></div>
          <div className="w-4 h-full bg-blue-500 rounded-sm row-span-2"></div>
          <div className="w-8 h-4 bg-orange-500 rounded-sm col-span-2"></div>
        </div>
      )
    },
    {
      id: 3,
      title: "Use Hints & Undo",
      description: "Stuck? Use the hint button for guidance or undo button to reverse your last move. Track your progress with the move counter!",
      illustration: (
        <div className="flex items-center justify-center space-x-4">
          <div className="text-2xl">💡</div>
          <div className="text-2xl">↶</div>
          <div className="text-sm bg-gray-100 px-2 py-1 rounded">Moves: 5</div>
        </div>
      )
    },
    {
      id: 4,
      title: "Ready to Play!",
      description: "Complete levels to unlock achievements and track your progress. Good luck helping the hamster escape!",
      illustration: <div className="text-4xl text-center">🏆</div>
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsOpen(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

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
              <div className="mb-4">
                {tutorialSteps[currentStep].illustration}
              </div>
              
              <h2 className="text-xl font-bold">
                {tutorialSteps[currentStep].title}
              </h2>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {tutorialSteps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mt-6 mb-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
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
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                size="sm"
                className="flex items-center gap-1"
              >
                {currentStep === tutorialSteps.length - 1 ? (
                  <>
                    <Play size={16} />
                    Start Playing
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={16} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTutorial;
