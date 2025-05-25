
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleEffect } from '../types/enhancedGameTypes';

interface ParticleEffectsProps {
  effects: ParticleEffect[];
  onEffectComplete: (effect: ParticleEffect) => void;
}

const ParticleEffects: React.FC<ParticleEffectsProps> = ({ effects, onEffectComplete }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {effects.map((effect, index) => (
          <ParticleItem
            key={`${effect.type}-${index}-${Date.now()}`}
            effect={effect}
            onComplete={() => onEffectComplete(effect)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ParticleItem: React.FC<{ effect: ParticleEffect; onComplete: () => void }> = ({ effect, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, effect.duration);
    return () => clearTimeout(timer);
  }, [effect.duration, onComplete]);

  const renderParticles = () => {
    switch (effect.type) {
      case 'confetti':
        return Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-sm"
            style={{ backgroundColor: effect.color }}
            initial={{
              x: effect.position.x,
              y: effect.position.y,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              x: effect.position.x + (Math.random() - 0.5) * 200,
              y: effect.position.y + Math.random() * 300 + 100,
              scale: [0, 1, 0],
              rotate: Math.random() * 720,
            }}
            transition={{
              duration: effect.duration / 1000,
              ease: "easeOut",
            }}
          />
        ));
        
      case 'stars':
        return Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400"
            initial={{
              x: effect.position.x,
              y: effect.position.y,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              x: effect.position.x + (Math.random() - 0.5) * 150,
              y: effect.position.y - Math.random() * 100,
              scale: [0, 1.5, 0],
              rotate: 360,
            }}
            transition={{
              duration: effect.duration / 1000,
              ease: "easeOut",
            }}
          >
            ⭐
          </motion.div>
        ));
        
      case 'sparkles':
        return Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: effect.position.x,
              y: effect.position.y,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: effect.position.x + (Math.random() - 0.5) * 100,
              y: effect.position.y + (Math.random() - 0.5) * 100,
              scale: [0, 2, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: effect.duration / 1000,
              ease: "easeOut",
            }}
          />
        ));
        
      default:
        return null;
    }
  };

  return <>{renderParticles()}</>;
};

export default ParticleEffects;
