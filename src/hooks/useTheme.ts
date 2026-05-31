import { useState, useEffect } from "react";

const THEME_KEY = 'cleanpro_theme_v1';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => 
    localStorage.getItem(THEME_KEY) === 'true'
  );

  useEffect(() => {
    localStorage.setItem(THEME_KEY, String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return {
    isDarkMode,
    setIsDarkMode,
    toggleTheme: () => setIsDarkMode(prev => !prev)
  };
}
