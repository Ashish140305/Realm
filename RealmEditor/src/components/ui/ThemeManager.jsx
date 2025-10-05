import { useEffect } from 'react';
import useSettingsStore from '../../store/useSettingsStore';

export default function ThemeManager() {
  const theme = useSettingsStore((state) => state.theme);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const compactMode = useSettingsStore((state) => state.compactMode);
  // NEW: Get accentColor from the store
  const accentColor = useSettingsStore((state) => state.accentColor);

  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [theme]);

  // NEW: This useEffect is added to apply the accent color globally
  useEffect(() => {
    const root = document.documentElement;
    if (accentColor) {
      root.style.setProperty('--accent-color', accentColor);
    }
  }, [accentColor]);
  // END NEW

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    
    if (fontSize === 'small') {
      root.classList.add('text-sm');
    } else if (fontSize === 'large') {
      root.classList.add('text-lg');
    } else {
      root.classList.add('text-base');
    }
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (compactMode) {
      root.classList.add('compact');
    } else {
      root.classList.remove('compact');
    }
  }, [compactMode]);

  return null;
}