import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, User, Bell, Database, Shield, ChevronsRight, Moon, Sun, Monitor, Github, Plus, KeyRound, Keyboard } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import { toast } from 'react-toastify';
import ShortcutSettings from '../settings/ShortcutSettings'; // <-- IMPORT THE NEW COMPONENT

const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
];
const accentColors = ['#58a6ff', '#f778ba', '#3fb950', '#f1e05a', '#a371f7'];
const fontSizes = ['small', 'default', 'large'];

const SettingsToggle = ({ label, isEnabled, onToggle }) => (
  <div className="flex justify-between items-center">
    <label className="text-sm font-medium text-[var(--primary-text-color)]">{label}</label>
    <button
      onClick={onToggle}
      className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${
        isEnabled ? 'bg-[var(--accent-color)] justify-end' : 'bg-[var(--background-color)] justify-start'
      }`}
    >
      <motion.div layout className="w-4 h-4 rounded-full bg-white" />
    </button>
  </div>
);


export default function SettingsDrawer({ isOpen, onClose, onProfileClick }) {
  const { 
    theme, setTheme, 
    accentColor, setAccentColor, 
    reduceMotion, toggleReduceMotion,
    fontSize, setFontSize,
    compactMode, toggleCompactMode,
    notifications, toggleNotification
  } = useSettingsStore();

  const [view, setView] = useState('main');

  React.useEffect(() => {
    if (!isOpen) {
      setView('main');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div
            className="absolute top-0 right-0 h-full w-full max-w-sm bg-[var(--card-background-color)] border-l border-[var(--border-color)] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] flex-shrink-0">
              <h3 className="text-lg font-semibold text-[var(--primary-text-color)]">Settings</h3>
              <button onClick={onClose} className="p-1 rounded-full text-[var(--secondary-text-color)] hover:bg-[var(--background-color)] transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto no-scrollbar">
              
              {view === 'main' ? (
                <div className="space-y-8 text-[var(--primary-text-color)]">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--secondary-text-color)] flex items-center gap-2"><User size={16}/> Profile & Account</h4>
                    <button onClick={onProfileClick} className="w-full text-left p-2 text-sm hover:bg-[var(--background-color)] rounded-md transition-colors">Edit Profile</button>
                    <button onClick={() => toast.info('Feature coming soon!')} className="w-full text-left p-2 text-sm hover:bg-[var(--background-color)] rounded-md transition-colors">Change Password</button>
                    <button onClick={() => toast.info('Feature coming soon!')} className="w-full text-left p-2 text-sm hover:bg-[var(--background-color)] rounded-md transition-colors">Two-Factor Authentication</button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--secondary-text-color)] flex items-center gap-2"><Palette size={16}/> Theme & Appearance</h4>
                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-text-color)] mb-2">Theme</label>
                      <div className="grid grid-cols-3 gap-2">
                        {themes.map(th => (
                          <button
                            key={th.id}
                            onClick={() => { setTheme(th.id); toast.success(`Theme set to ${th.name}`); }}
                            className={`p-2 border rounded-md capitalize text-sm transition-colors flex items-center justify-center gap-2 ${theme === th.id ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-[var(--border-color)] text-[var(--secondary-text-color)] hover:border-[var(--primary-text-color)]'}`}
                          >
                            <th.icon size={14} /> {th.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-text-color)] mb-2">Accent Color</label>
                      <div className="flex items-center gap-3">
                        {accentColors.map(color => (
                          <button
                            key={color}
                            onClick={() => setAccentColor(color)}
                            style={{ backgroundColor: color, borderColor: accentColor === color ? 'var(--accent-border-color)' : 'transparent' }}
                            className={`w-6 h-6 rounded-full transition-all duration-200 transform hover:scale-110 border-2`}
                          />
                        ))}
                        <div className="relative w-6 h-6">
                            <input
                                type="color"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                title="Custom Color"
                            />
                            <div className="w-full h-full rounded-full border-2 border-dashed border-[var(--border-color)] flex items-center justify-center">
                              <Plus size={12} className="text-[var(--secondary-text-color)]"/>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div className='space-y-4 pt-4 border-t border-[var(--border-color)]'>
                        <div>
                            <label className="block text-sm font-medium text-[var(--secondary-text-color)] mb-2">Font Size</label>
                            <div className="grid grid-cols-3 gap-2">
                                {fontSizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setFontSize(size)}
                                        className={`p-2 border rounded-md text-sm capitalize transition-colors ${fontSize === size ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-[var(--border-color)] text-[var(--secondary-text-color)]'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <SettingsToggle label="Compact Mode" isEnabled={compactMode} onToggle={() => { toggleCompactMode(); toast.info(`Compact mode ${!compactMode ? 'enabled' : 'disabled'}`); }} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--secondary-text-color)] flex items-center gap-2"><Bell size={16}/> Notifications & Privacy</h4>
                    <SettingsToggle label="Email Notifications" isEnabled={notifications.email} onToggle={() => { toggleNotification('email'); toast.info(`Email notifications ${!notifications.email ? 'enabled' : 'disabled'}`); }} />
                    <SettingsToggle label="In-App Notifications" isEnabled={notifications.inApp} onToggle={() => { toggleNotification('inApp'); toast.info(`In-app notifications ${!notifications.inApp ? 'enabled' : 'disabled'}`); }} />
                    <SettingsToggle label="Desktop Notifications" isEnabled={notifications.desktop} onToggle={() => { toggleNotification('desktop'); toast.info(`Desktop notifications ${!notifications.desktop ? 'enabled' : 'disabled'}`); }} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--secondary-text-color)] flex items-center gap-2"><Database size={16}/> Project & Data</h4>
                    <button onClick={() => toast.info('Feature coming soon!')} className="w-full text-left p-2 text-sm hover:bg-[var(--background-color)] rounded-md transition-colors">Export/Import Data</button>
                    <button onClick={() => toast.info('Feature coming soon!')} className="w-full text-left p-2 text-sm hover:bg-[var(--background-color)] rounded-md transition-colors">View Activity Log</button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--secondary-text-color)] flex items-center gap-2"><Shield size={16}/> Account Management</h4>
                    <button onClick={() => toast.info('Feature coming soon!')} className="w-full text-left p-2 text-sm hover:bg-[var(--background-color)] rounded-md transition-colors flex items-center justify-between">Connected Accounts <Github size={16} /></button>
                    <button onClick={() => toast.warn('This is a destructive action!')} className="w-full text-left p-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors">Delete Account</button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--secondary-text-color)] flex items-center gap-2"><ChevronsRight size={16}/> Advanced & Misc.</h4>
                    <SettingsToggle label="Reduce Motion" isEnabled={reduceMotion} onToggle={() => { toggleReduceMotion(); toast.info(`Reduce motion ${!reduceMotion ? 'enabled' : 'disabled'}`); }} />
                    <button onClick={() => toast.info('Feature coming soon!')} className="w-full text-left p-2 text-sm hover:bg-[var(--background-color)] rounded-md transition-colors flex items-center gap-2"><KeyRound size={16} /> API Key Management</button>
                    <button onClick={() => setView('shortcuts')} className="w-full text-left p-2 text-sm hover:bg-[var(--background-color)] rounded-md transition-colors flex items-center gap-2"><Keyboard size={16} /> Keyboard Shortcuts</button>
                    <button onClick={() => toast.info('Feature coming soon!')} className="w-full text-left p-2 text-sm hover:bg-[var(--background-color)] rounded-md transition-colors">Help & Support</button>
                  </div>
                </div>
              ) : (
                <ShortcutSettings onBack={() => setView('main')} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}