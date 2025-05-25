
export interface Theme {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    blocks: {
      horizontal: string;
      vertical: string;
      key: string;
    };
  };
  effects?: {
    particles?: string;
    animations?: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Classic',
    description: 'The original Hamster Puzzle theme',
    isPremium: false,
    colors: {
      primary: '#F59E0B',
      secondary: '#10B981',
      accent: '#EF4444',
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      text: '#ffffff',
      blocks: {
        horizontal: 'bg-gradient-to-r from-[#10B981] to-[#059669]',
        vertical: 'bg-gradient-to-b from-[#EF4444] to-[#DC2626]',
        key: 'bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]'
      }
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Dive into the deep blue sea',
    isPremium: false,
    colors: {
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      accent: '#8B5CF6',
      background: 'linear-gradient(135deg, #0c4a6e 0%, #164e63 100%)',
      text: '#ffffff',
      blocks: {
        horizontal: 'bg-gradient-to-r from-[#0EA5E9] to-[#0284C7]',
        vertical: 'bg-gradient-to-b from-[#06B6D4] to-[#0891B2]',
        key: 'bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]'
      }
    }
  },
  {
    id: 'forest',
    name: 'Forest Grove',
    description: 'Natural greens and earth tones',
    isPremium: false,
    colors: {
      primary: '#16A34A',
      secondary: '#84CC16',
      accent: '#EAB308',
      background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
      text: '#ffffff',
      blocks: {
        horizontal: 'bg-gradient-to-r from-[#16A34A] to-[#15803D]',
        vertical: 'bg-gradient-to-b from-[#84CC16] to-[#65A30D]',
        key: 'bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]'
      }
    }
  },
  {
    id: 'neon',
    name: 'Neon City',
    description: 'Bright cyberpunk vibes',
    isPremium: true,
    colors: {
      primary: '#F72585',
      secondary: '#7209B7',
      accent: '#A663CC',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      text: '#ffffff',
      blocks: {
        horizontal: 'bg-gradient-to-r from-[#F72585] to-[#B5179E]',
        vertical: 'bg-gradient-to-b from-[#7209B7] to-[#560BAD]',
        key: 'bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]'
      }
    }
  },
  {
    id: 'cosmic',
    name: 'Cosmic Wonder',
    description: 'Journey through the stars',
    isPremium: true,
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#06B6D4',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      text: '#ffffff',
      blocks: {
        horizontal: 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]',
        vertical: 'bg-gradient-to-b from-[#EC4899] to-[#BE185D]',
        key: 'bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]'
      }
    },
    effects: {
      particles: 'stars',
      animations: 'float'
    }
  }
];

export const getTheme = (themeId: string): Theme => {
  return themes.find(theme => theme.id === themeId) || themes[0];
};

export const getUnlockedThemes = (isPremium: boolean, unlockedThemes: string[]): Theme[] => {
  return themes.filter(theme => 
    !theme.isPremium || isPremium || unlockedThemes.includes(theme.id)
  );
};
