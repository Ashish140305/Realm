import React from 'react';
import { motion } from 'framer-motion';

const themes = ['Light', 'Dark', 'System'];
const accentColors = [
  { name: 'Blue', color: '#58a6ff' },
  { name: 'Green', color: '#3fb950' },
  { name: 'Purple', color: '#a371f7' },
  { name: 'Pink', color: '#db61a2' },
  { name: 'Orange', color: '#e36209' },
];

export default function AppearanceSettings() {
  // Replace with your theme state
  const [currentTheme, setCurrentTheme] = React.useState('Dark');
  const [currentAccent, setCurrentAccent] = React.useState('#58a6ff');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text-primary">Appearance</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-text-primary">Theme</h3>
        <div className="p-1 bg-background rounded-lg flex space-x-1">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setCurrentTheme(theme)}
              className="relative w-full py-2 text-sm font-medium text-text-secondary transition-colors"
            >
              {currentTheme === theme && (
                <motion.div
                  className="absolute inset-0 bg-border-color rounded-md"
                  layoutId="theme-pill"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{theme}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-text-primary">Accent Color</h3>
        <div className="flex space-x-3">
          {accentColors.map((accent) => (
            <motion.button
              key={accent.name}
              onClick={() => setCurrentAccent(accent.color)}
              className="w-8 h-8 rounded-full border-2"
              style={{
                backgroundColor: accent.color,
                borderColor: currentAccent === accent.color ? accent.color : 'transparent',
              }}
              whileHover={{ scale: 1.1 }}
              title={accent.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}