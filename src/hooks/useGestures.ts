
import { useGesture } from 'react-use-gesture';
import { useCallback } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

interface UseGesturesProps {
  onSwipe: (direction: 'up' | 'down' | 'left' | 'right', blockId: string) => void;
  onTap: (blockId: string) => void;
  blockId: string;
}

export const useGestures = ({ onSwipe, onTap, blockId }: UseGesturesProps) => {
  const triggerHaptic = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
  }, []);

  const bind = useGesture({
    onDrag: ({ direction: [dx, dy], distance, cancel }) => {
      if (distance > 50) {
        cancel();
        triggerHaptic();
        
        if (Math.abs(dx) > Math.abs(dy)) {
          onSwipe(dx > 0 ? 'right' : 'left', blockId);
        } else {
          onSwipe(dy > 0 ? 'down' : 'up', blockId);
        }
      }
    },
    onTap: () => {
      triggerHaptic();
      onTap(blockId);
    }
  });

  return bind;
};
