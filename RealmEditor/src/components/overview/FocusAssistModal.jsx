// src/components/overview/FocusAssistModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import useFocusStore from '../../store/useFocusStore'; // Import the new focus store

const durationOptions = [25, 50, 90];

// A cleaner, more formal toggle switch component
const MinimalistToggle = ({ label, enabled, onChange, accentColor }) => (
  <label htmlFor={label} className="flex items-center justify-between cursor-pointer py-2">
    <span className="text-sm font-medium text-text-primary">{label}</span>
    <div className="relative">
      <input 
        id={label} 
        type="checkbox" 
        className="sr-only peer" 
        checked={enabled} 
        onChange={onChange} 
      />
      <div className="w-10 h-6 bg-background rounded-full border border-border-color peer-checked:bg-accent peer-checked:border-accent transition-colors" style={{ '--tw-bg-accent': accentColor }}></div>
      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
    </div>
  </label>
);

export default function FocusAssistModal({ isOpen, onClose }) {
  const { accentColor, setStatus } = useSettingsStore(state => ({
    accentColor: state.accentColor,
    setStatus: state.setStatus,
  }));
  
  const startSession = useFocusStore((state) => state.startSession);

  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(durationOptions[0]);
  const [customDuration, setCustomDuration] = useState('');
  const [pauseNotifications, setPauseNotifications] = useState(true);
  const [setStatusToFocusing, setSetStatusToFocusing] = useState(true);
  const [hideActivityFeeds, setHideActivityFeeds] = useState(false);

  const handleStartFocusSession = () => {
    if (setStatusToFocusing) {
      setStatus({ text: 'Focusing', pauseNotifications: true });
    } else {
      setStatus(null);
    }

    startSession({
      goal,
      duration: customDuration || duration,
      pauseNotifications,
      hideActivityFeeds,
    });
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-card-background border border-border-color rounded-lg shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border-color">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-text-secondary" />
                <h2 className="font-semibold text-md text-text-primary">Start a Focus Session</h2>
              </div>
              <button onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-background transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content with increased spacing */}
            <div className="p-6 space-y-8">
              {/* Goal Input */}
              <div>
                <label htmlFor="focus-goal" className="text-sm font-medium text-text-secondary mb-2 block">
                  What is your goal?
                </label>
                <input
                  id="focus-goal"
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Finalize the API documentation"
                  className="w-full px-3 py-2 bg-background border border-border-color rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-text-primary"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  For how long?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {durationOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setDuration(opt); setCustomDuration(''); }}
                      className={`py-2 rounded-md text-sm font-medium transition-colors ${
                        duration === opt && !customDuration ? 'text-white' : 'bg-background text-text-secondary hover:bg-hover-color'
                      }`}
                      style={{ backgroundColor: duration === opt && !customDuration ? accentColor : undefined }}
                    >
                      {opt} min
                    </button>
                  ))}
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => {
                      setCustomDuration(e.target.value);
                      setDuration(null);
                    }}
                    placeholder="Custom"
                    min="1"
                    className="w-full px-3 py-2 bg-background border border-border-color rounded-md text-sm text-center focus:outline-none focus:ring-1 focus:ring-accent text-text-primary no-spinner"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-6 border-t border-border-color space-y-2">
                 <MinimalistToggle 
                    label="Pause notifications"
                    enabled={pauseNotifications}
                    onChange={() => setPauseNotifications(p => !p)}
                    accentColor={accentColor}
                 />
                 <MinimalistToggle 
                    label="Set status to 'Focusing'"
                    enabled={setStatusToFocusing}
                    onChange={() => setSetStatusToFocusing(p => !p)}
                    accentColor={accentColor}
                 />
                 <MinimalistToggle 
                    label="Hide activity feeds (Zen Mode)"
                    enabled={hideActivityFeeds}
                    onChange={() => setHideActivityFeeds(p => !p)}
                    accentColor={accentColor}
                 />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-4 bg-background/50 border-t border-border-color rounded-b-lg space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-hover-color rounded-md transition-colors"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleStartFocusSession}
                className="px-5 py-2 text-sm font-medium text-white rounded-md"
                style={{ backgroundColor: accentColor }}
                whileHover={{ filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                Begin Session
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}