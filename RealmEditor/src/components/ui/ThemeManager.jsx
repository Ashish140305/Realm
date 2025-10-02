import { useEffect } from 'react';
import useSettingsStore from '../../store/useSettingsStore';

const ThemeManager = () => {
  const theme = useSettingsStore((state) => state.theme);
  const accentColor = useSettingsStore((state) => state.accentColor);

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme);
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [theme, accentColor]);

  return null;
};

export default ThemeManager;