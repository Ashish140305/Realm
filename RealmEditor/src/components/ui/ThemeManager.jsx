import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useSettingsStore from '../../store/useSettingsStore';

const ThemeManager = () => {
  const theme = useSettingsStore((state) => state.theme);
  const accentColor = useSettingsStore((state) => state.accentColor);
  const location = useLocation();

  useEffect(() => {
    // If we're on the landing page, we remove any theme class and exit.
    if (location.pathname === '/') {
      document.body.className = 'landing-page-theme';
    } else {
      // Otherwise, apply the selected theme.
      document.body.className = '';
      document.body.classList.add(theme);
    }
    
    // Accent color is applied globally regardless of the page.
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [theme, accentColor, location.pathname]);

  return null;
};

export default ThemeManager;