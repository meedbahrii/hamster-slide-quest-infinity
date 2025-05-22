
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import Index from "./pages/Index";
import Tutorial from "./pages/Tutorial";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  
  // Detect native platform
  useEffect(() => {
    setIsNativePlatform(Capacitor.isNativePlatform());
  }, []);

  // Add meta tags for better compatibility
  useEffect(() => {
    // Meta tags for Apple devices
    const appleMetaTags = [
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Hamster Puzzle" }
    ];
    
    // Add meta tags if they don't exist
    appleMetaTags.forEach(tag => {
      if (!document.querySelector(`meta[name="${tag.name}"]`)) {
        const meta = document.createElement("meta");
        meta.setAttribute("name", tag.name);
        meta.setAttribute("content", tag.content);
        document.head.appendChild(meta);
      }
    });
    
    // Add theme color meta tag
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColorMeta = document.createElement("meta");
      themeColorMeta.setAttribute("name", "theme-color");
      themeColorMeta.setAttribute("content", "#f5e8d2");
      document.head.appendChild(themeColorMeta);
    }
    
    // Prevent pinch zoom on mobile devices for better game experience
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // If on native platform, set orientation to portrait
    if (isNativePlatform) {
      try {
        // Check if screen orientation API is available and use it safely
        if (window.screen?.orientation?.lock) {
          window.screen.orientation.lock('portrait').catch(err => {
            console.log('Orientation lock failed:', err);
          });
        } else {
          console.log('Orientation lock not supported on this device');
        }
      } catch (error) {
        console.log('Error with orientation lock:', error);
      }
    }
    
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isNativePlatform]);

  // Add CSS variables for safe areas in native apps
  useEffect(() => {
    if (isNativePlatform) {
      document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
      document.documentElement.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
      document.documentElement.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
    }
  }, [isNativePlatform]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tutorial" element={<Tutorial />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
