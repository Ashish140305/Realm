import { useEffect } from 'react';
import useSettingsStore from '../../store/useSettingsStore';

// This function applies the correct theme attribute to the <html> tag
const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.setAttribute('data-theme', systemTheme);
  } else {
    root.setAttribute('data-theme', theme);
  }
};

const ThemeManager = () => {
  const { theme, accentColor } = useSettingsStore();

  useEffect(() => {
    // Apply the theme when the component mounts or the theme state changes
    applyTheme(theme);
    
    // Set the accent color
    document.documentElement.style.setProperty('--accent-color', accentColor);

    // Listener for when the user changes their OS theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Only apply the change if the user's setting is 'system'
      if (useSettingsStore.getState().theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, accentColor]);

  return null; // This component doesn't render anything
};

export default ThemeManager;