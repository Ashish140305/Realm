import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useSettingsStore from '../../store/useSettingsStore';

const ThemeManager = () => {
  const theme = useSettingsStore((state) => state.theme);
  const accentColor = useSettingsStore((state) => state.accentColor);
  const location = useLocation();

  useEffect(() => {
    // Clear previous theme classes
    document.body.className = '';

    if (location.pathname === '/') {
      // Apply a specific class for the landing page if needed
      document.body.classList.add('landing-page-theme');
    } else {
      // Apply the selected theme from the store
      document.body.classList.add(theme);
    }
    
    // Apply the accent color globally
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [theme, accentColor, location.pathname]);

  return null;
};

export default ThemeManager;