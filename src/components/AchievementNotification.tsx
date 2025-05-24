
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Achievement } from "../utils/achievements";

interface AchievementNotificationProps {
  achievements: Achievement[];
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievements, 
  onClose 
}) => {
  React.useEffect(() => {
    if (achievements.length > 0) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievements, onClose]);

  return (
    <AnimatePresence>
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ delay: index * 0.2 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{achievement.icon}</span>
            <div>
              <h3 className="font-bold text-sm">Achievement Unlocked!</h3>
              <p className="text-xs opacity-90">{achievement.title}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default AchievementNotification;
