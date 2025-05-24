
import React from 'react';

interface AppIconProps {
  size?: number;
  className?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ size = 64, className = "" }) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle cx="32" cy="32" r="30" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
        
        {/* Hamster body */}
        <ellipse cx="32" cy="38" rx="14" ry="12" fill="#D97706"/>
        
        {/* Hamster head */}
        <circle cx="32" cy="26" r="10" fill="#EA580C"/>
        
        {/* Eyes */}
        <circle cx="28" cy="24" r="1.5" fill="#000"/>
        <circle cx="36" cy="24" r="1.5" fill="#000"/>
        
        {/* Nose */}
        <ellipse cx="32" cy="27" rx="1" ry="0.5" fill="#000"/>
        
        {/* Ears */}
        <ellipse cx="26" cy="20" rx="2" ry="3" fill="#EA580C"/>
        <ellipse cx="38" cy="20" rx="2" ry="3" fill="#EA580C"/>
        
        {/* Block elements around hamster */}
        <rect x="10" y="14" width="8" height="4" rx="1" fill="#EF4444"/>
        <rect x="46" y="20" width="4" height="8" rx="1" fill="#3B82F6"/>
        <rect x="12" y="46" width="8" height="4" rx="1" fill="#10B981"/>
        
        {/* Arrow pointing right */}
        <path d="M44 32 L50 32 M47 29 L50 32 L47 35" stroke="#000" strokeWidth="2" fill="none"/>
      </svg>
    </div>
  );
};

export default AppIcon;
