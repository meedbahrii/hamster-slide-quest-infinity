
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.hamsterpuzzle',
  appName: 'Hamster Puzzle ∞',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://ad68a756-3a54-41e2-94fa-16430d68aa83.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#f5e8d2",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#ea384c",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
