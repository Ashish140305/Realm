import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// NEW: Imported new icons
import { X, Command, Search, Settings, Plus, BrainCircuit, Inbox } from 'lucide-react';

// MODIFIED: Added new shortcut objects to the array
const shortcuts = [
  { icon: <Command size={16} />, keys: ['Ctrl', 'K'], description: 'Open command palette' },
  { icon: <Search size={16} />, keys: ['Ctrl', 'F'], description: 'Search files' },
  { icon: <Settings size={16} />, keys: ['Ctrl', ','], description: 'Open settings' },
  { icon: <Plus size={16} />, keys: ['N'], description: 'Create new project' },
  { icon: <BrainCircuit size={16} />, keys: ['F'], description: 'Start focus session' },
  { icon: <Inbox size={16} />, keys: ['I'], description: 'Open inbox' },
];

const Kbd = ({ children }) => (
  <kbd className="px-2 py-1.5 text-xs font-semibold text-[var(--primary-text-color)] bg-[var(--background-color)] border border-[var(--border-color)] rounded-md">
    {children}
  </kbd>
);

export default function ShortcutsModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg bg-[var(--card-background-color)] rounded-xl shadow-2xl border border-[var(--border-color)]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
              <h2 className="text-lg font-bold text-[var(--primary-text-color)]">Keyboard Shortcuts</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--border-color)] transition-colors">
                <X size={20} className="text-[var(--secondary-text-color)]" />
              </button>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-[var(--background-color)]">
                    <div className="flex items-center gap-3">
                      {shortcut.icon}
                      <span className="text-sm text-[var(--primary-text-color)]">{shortcut.description}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map(key => <Kbd key={key}>{key}</Kbd>)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}