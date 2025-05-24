
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, Volume2, VolumeX, Palette, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSoundEffects } from '../utils/soundEffects';
import { useToast } from '@/hooks/use-toast';

interface SettingsMenuProps {
  onThemeChange?: (theme: string) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onThemeChange }) => {
  const { isSoundEnabled, toggleSound } = useSoundEffects();
  const { toast } = useToast();
  const [volume, setVolume] = useState(50);
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    const savedVolume = localStorage.getItem('gameVolume');
    if (savedVolume) {
      setVolume(parseInt(savedVolume));
    }
    
    const savedTheme = localStorage.getItem('gameTheme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    localStorage.setItem('gameVolume', newVolume.toString());
  };

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem('gameTheme', theme);
    onThemeChange?.(theme);
    toast({
      title: "Theme Changed",
      description: `Switched to ${theme} theme`,
    });
  };

  const handleResetProgress = () => {
    if (showConfirmReset) {
      // Reset game data
      localStorage.removeItem('highestLevel');
      localStorage.removeItem('completedLevels');
      localStorage.removeItem('gameStatistics');
      localStorage.removeItem('achievements');
      localStorage.removeItem('dailyChallenge');
      
      toast({
        title: "Progress Reset",
        description: "All game progress has been reset",
      });
      
      setShowConfirmReset(false);
      
      // Reload the page to reset the game state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setShowConfirmReset(true);
      setTimeout(() => setShowConfirmReset(false), 3000);
    }
  };

  const themes = [
    { id: 'default', name: 'Classic', color: '#FCD34D' },
    { id: 'ocean', name: 'Ocean', color: '#0EA5E9' },
    { id: 'forest', name: 'Forest', color: '#10B981' },
    { id: 'sunset', name: 'Sunset', color: '#F97316' },
    { id: 'lavender', name: 'Lavender', color: '#A855F7' }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button variant="outline" size="icon" className="shadow-md">
            <Settings size={18} />
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings size={20} />
            Game Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Sound Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Audio</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span className="text-sm">Sound Effects</span>
              </div>
              <Switch 
                checked={soundEnabled} 
                onCheckedChange={handleSoundToggle}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Volume</span>
                <span className="text-xs text-muted-foreground">{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={10}
                disabled={!soundEnabled}
                className="w-full"
              />
            </div>
          </div>

          {/* Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette size={16} />
              <h3 className="text-sm font-medium">Theme</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`p-2 rounded-lg border text-xs transition-colors ${
                    selectedTheme === theme.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: theme.color }}
                  />
                  {theme.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Reset Progress */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center gap-2">
              <RotateCcw size={16} />
              <h3 className="text-sm font-medium">Reset Progress</h3>
            </div>
            
            <Button
              variant={showConfirmReset ? "destructive" : "outline"}
              size="sm"
              onClick={handleResetProgress}
              className="w-full"
            >
              {showConfirmReset ? "Confirm Reset" : "Reset All Progress"}
            </Button>
            
            {showConfirmReset && (
              <p className="text-xs text-muted-foreground text-center">
                Click again to confirm. This cannot be undone.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsMenu;
