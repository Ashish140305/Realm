import React, { useState, useEffect } from 'react';
import useSettingsStore from '../../store/useSettingsStore';

// A component to display a key, like 'Ctrl' or 'K'
const Kbd = ({ children }) => (
  <kbd className="px-2 py-1.5 text-xs font-semibold text-[var(--primary-text-color)] bg-[var(--background-color)] border border-[var(--border-color)] rounded-md">
    {children}
  </kbd>
);

// A single row in the shortcut settings list
const ShortcutRow = ({ actionName, shortcut }) => {
  const { updateShortcut } = useSettingsStore();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isListening) return;

      event.preventDefault();
      event.stopPropagation();

      const newBinding = {
        key: event.key,
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey,
      };

      updateShortcut(actionName, newBinding);
      setIsListening(false);
    };

    if (isListening) {
      document.addEventListener('keydown', handleKeyDown, true);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isListening, actionName, updateShortcut]);

  return (
    <li className="flex items-center justify-between p-2 rounded-md hover:bg-[var(--background-color)]">
      <span className="text-sm text-[var(--primary-text-color)]">{shortcut.label}</span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {shortcut.ctrl && <Kbd>Ctrl</Kbd>}
          {shortcut.shift && <Kbd>Shift</Kbd>}
          {shortcut.alt && <Kbd>Fn</Kbd>}
          <Kbd>{shortcut.key.toUpperCase()}</Kbd>
        </div>
        <button
          onClick={() => setIsListening(true)}
          className="px-3 py-1 text-xs font-semibold border rounded-md transition-colors w-[90px] text-center"
          style={{
            borderColor: isListening ? 'var(--accent-color)' : 'var(--border-color)',
            color: isListening ? 'var(--accent-color)' : 'var(--secondary-text-color)',
          }}
        >
          {isListening ? 'Listening...' : 'Change'}
        </button>
      </div>
    </li>
  );
};

// The main component for the shortcut settings view
export default function ShortcutSettings({ onBack }) {
  const shortcuts = useSettingsStore((state) => state.shortcuts);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="text-[var(--secondary-text-color)] hover:text-[var(--primary-text-color)]">
          &larr; Back
        </button>
        <h4 className="font-semibold text-[var(--primary-text-color)]">Keyboard Shortcuts</h4>
      </div>
      <ul className="space-y-2">
        {Object.entries(shortcuts).map(([actionName, shortcut]) => (
          <ShortcutRow key={actionName} actionName={actionName} shortcut={shortcut} />
        ))}
      </ul>
    </div>
  );
}