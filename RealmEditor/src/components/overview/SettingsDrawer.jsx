import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, User, Bell, Database, Shield, ChevronsRight, Moon, Sun, Monitor, Github } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import { toast } from 'react-toastify';

const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
];
const accentColors = ['#58a6ff', '#f778ba', '#3fb950', '#f1e05a', '#a371f7'];

export default function SettingsDrawer({ isOpen, onClose }) {
  const { theme, setTheme, accentColor, setAccentColor, reduceMotion, toggleReduceMotion } = useSettingsStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="absolute top-0 right-0 h-full w-full max-w-sm bg-bg-secondary border-l border-border-color flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border-color flex-shrink-0">
              <h3 className="text-lg font-semibold text-text-primary">Settings</h3>
              <button onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-bg-primary transition"><X size={20} /></button>
            </div>
            
            {/* FIX: All settings sections have been restored */}
            <div className="p-6 space-y-8 overflow-y-auto text-text-primary">
              <div className="space-y-4">
                <h4 className="font-semibold text-text-secondary flex items-center gap-2"><User size={16}/> Profile & Account</h4>
                <button className="w-full text-left p-2 text-sm hover:bg-bg-primary rounded-md transition">Edit Profile</button>
                <button className="w-full text-left p-2 text-sm hover:bg-bg-primary rounded-md transition">Change Password</button>
                <button className="w-full text-left p-2 text-sm hover:bg-bg-primary rounded-md transition">Two-Factor Authentication</button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-text-secondary flex items-center gap-2"><Palette size={16}/> Theme & Appearance</h4>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {themes.map(th => (
                      <button key={th.id} onClick={() => { setTheme(th.id); toast.success(`Theme set to ${th.name}`); }}
                        className={`p-2 border rounded-md capitalize text-sm transition flex items-center justify-center gap-2 ${theme === th.id ? 'border-accent text-accent' : 'border-border-color text-text-secondary hover:border-text-primary'}`}
                      >
                        <th.icon size={14} /> {th.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Accent Color</label>
                  <div className="flex gap-3">
                    {accentColors.map(color => (
                      <button key={color} onClick={() => setAccentColor(color)} style={{ backgroundColor: color }} className={`w-6 h-6 rounded-full transition ${accentColor === color ? 'ring-2 ring-offset-2 ring-offset-bg-secondary ring-white' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-text-secondary flex items-center gap-2"><Bell size={16}/> Notifications & Privacy</h4>
                <button className="w-full text-left p-2 text-sm hover:bg-bg-primary rounded-md transition">Notification Settings</button>
                <button className="w-full text-left p-2 text-sm hover:bg-bg-primary rounded-md transition">Privacy Controls</button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-text-secondary flex items-center gap-2"><Database size={16}/> Project & Data</h4>
                <button className="w-full text-left p-2 text-sm hover:bg-bg-primary rounded-md transition">Export/Import Data</button>
                <button className="w-full text-left p-2 text-sm hover:bg-bg-primary rounded-md transition">View Activity Log</button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-text-secondary flex items-center gap-2"><Shield size={16}/> Account Management</h4>
                <button className="w-full text-left p-2 text-sm hover:bg-bg-primary rounded-md transition flex items-center justify-between">Connected Accounts <Github size={16} /></button>
                <button className="w-full text-left p-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition">Delete Account</button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-text-secondary flex items-center gap-2"><ChevronsRight size={16}/> Advanced & Misc.</h4>
                <div className="flex justify-between items-center">
                  <label htmlFor="reduce-motion" className="text-sm font-medium">Reduce Motion</label>
                  <button onClick={() => { toggleReduceMotion(); toast.info(`Reduce motion ${!reduceMotion ? 'enabled' : 'disabled'}`); }} className={`w-10 h-6 rounded-full p-1 flex items-center transition ${reduceMotion ? 'bg-accent justify-end' : 'bg-bg-primary justify-start'}`}><motion.div layout className="w-4 h-4 rounded-full bg-white" /></button>
                </div>
                <button className="w-full text-left p-2 text-sm hover:bg-bg-primary rounded-md transition">Help & Support</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}