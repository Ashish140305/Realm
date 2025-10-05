import { useEffect, useCallback } from 'react';
import useSettingsStore from '../store/useSettingsStore';

// MODIFIED: The hook now takes a map of action names to functions
export function useKeyboardShortcuts(actionsMap) {
  // Get the customizable shortcuts from the global store
  const shortcuts = useSettingsStore((state) => state.shortcuts);

  const handleKeyDown = useCallback((event) => {
    const isTyping = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable;
    if (isTyping) return;

    // Find a matching shortcut from the store's state
    const actionName = Object.keys(shortcuts).find(name => {
      const s = shortcuts[name];
      const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = (s.ctrl ?? false) === event.ctrlKey;
      const shiftMatch = (s.shift ?? false) === event.shiftKey;
      const altMatch = (s.alt ?? false) === event.altKey;
      
      return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });

    // If a shortcut is matched and a corresponding action exists in the map, run it
    if (actionName && actionsMap[actionName]) {
      event.preventDefault();
      actionsMap[actionName]();
    }
  }, [shortcuts, actionsMap]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}