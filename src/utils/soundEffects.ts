
import { useEffect, useRef } from 'react';

// Sound effect URLs
const SOUNDS = {
  MOVE: '/sounds/move.mp3',
  INVALID_MOVE: '/sounds/invalid.mp3',
  LEVEL_COMPLETE: '/sounds/level-complete.mp3',
  BLOCK_SELECT: '/sounds/block-select.mp3',
  BUTTON_CLICK: '/sounds/button-click.mp3'
};

// Sound manager to handle audio playback
class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  private constructor() {
    // Initialize sound effects
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
    
    // Load sound preference from localStorage
    const soundEnabled = localStorage.getItem('soundEnabled');
    if (soundEnabled !== null) {
      this.enabled = soundEnabled === 'true';
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public play(soundName: keyof typeof SOUNDS): void {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      // Create a new audio element for each play to allow overlapping sounds
      const newSound = sound.cloneNode() as HTMLAudioElement;
      newSound.volume = 0.5; // Set default volume
      newSound.play().catch(e => console.warn('Audio play failed:', e));
    }
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled.toString());
    return this.enabled;
  }

  public isSoundEnabled(): boolean {
    return this.enabled;
  }
}

// Hook to use sound effects in components
export const useSoundEffects = () => {
  const soundManager = useRef(SoundManager.getInstance());

  const playSound = (soundName: keyof typeof SOUNDS) => {
    soundManager.current.play(soundName);
  };

  const toggleSound = () => {
    return soundManager.current.toggleSound();
  };

  const isSoundEnabled = () => {
    return soundManager.current.isSoundEnabled();
  };

  return { playSound, toggleSound, isSoundEnabled };
};

export default SOUNDS;
