import React from 'react';
import useSettingsStore from '../../store/useSettingsStore';

const themes = ['Light', 'Dark', 'System'];
const accentColors = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f97316',
  '#8b5cf6',
  '#d946ef',
];

const ThemeCard = ({ name, selectedTheme, setTheme }) => {
  const isSelected = selectedTheme === name;
  
  const themeStyles = {
    Light: { bg: 'bg-white', circle: 'bg-gray-300' },
    Dark: { bg: 'bg-gray-800', circle: 'bg-gray-600' },
    System: { bg: 'bg-gradient-to-br from-white to-gray-800', circle: 'bg-gray-500' },
  };
  
  const styles = themeStyles[name];

  return (
    <div
      onClick={() => setTheme(name)}
      className={`cursor-pointer rounded-lg p-3 border-2 transition-all duration-200 ${
        isSelected ? 'border-accent shadow-lg' : 'border-border-color hover:border-gray-500'
      }`}
    >
      <div className={`w-full h-16 rounded-md flex items-center justify-center ${styles.bg}`}>
        <div className={`w-8 h-8 rounded-full ${styles.circle}`}></div>
      </div>
      <p className={`mt-2 text-sm font-medium text-center ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
        {name}
      </p>
    </div>
  );
};


export default function AppearanceSettings() {
  const { theme, setTheme, accentColor, setAccentColor } = useSettingsStore();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-text-primary">Theme</h3>
      <p className="text-sm text-text-secondary mb-4">
        Choose how Realm looks to you. Select a theme or sync with your system.
      </p>
      
      <div className="grid grid-cols-3 gap-4">
        {themes.map((t) => (
          <ThemeCard key={t} name={t} selectedTheme={theme} setTheme={setTheme} />
        ))}
      </div>

      <div className="border-b border-border-color my-6"></div>

      <h3 className="text-lg font-semibold mt-6 mb-2 text-text-primary">
        Accent Color
      </h3>
      <p className="text-sm text-text-secondary mb-4">
        Select a color for buttons, highlights, and other UI elements.
      </p>
      <div className="flex flex-wrap items-center gap-3"> {/* MODIFIED: Added items-center */}
        {accentColors.map((color) => (
          <button
            key={color}
            onClick={() => setAccentColor(color)}
            className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
              accentColor === color
                ? 'ring-2 ring-offset-2 ring-offset-card-background ring-accent'
                : ''
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Set accent color to ${color}`}
          />
        ))}

        {/* NEW: Added the custom color picker input */}
        <div className="relative w-8 h-8">
            <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Custom Color"
            />
            <div
                className="w-full h-full rounded-full border-2 border-dashed border-border-color flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
            >
            </div>
        </div>
        {/* END NEW */}
      </div>
    </div>
  );
}