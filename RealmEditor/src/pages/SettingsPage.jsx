import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Palette, Shield, Bell } from 'lucide-react';
import AppearanceSettings from '../components/settings/AppearanceSettings';

const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={20} /> },
  { id: 'security', label: 'Security', icon: <Shield size={20} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
];

export default function SettingsPage({ isVisible, onClose }) {
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-4xl h-[80vh] bg-card-background rounded-xl shadow-2xl flex"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Sidebar */}
            <div className="w-1/4 border-r border-border-color p-4">
              <h1 className="text-xl font-bold mb-6 text-text-primary">Settings</h1>
              <nav className="space-y-2">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-white bg-accent'
                        : 'text-text-secondary hover:bg-border-color'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="w-3/4 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'appearance' && <AppearanceSettings />}
                  {/* Add other settings components here */}
                  {activeTab !== 'appearance' && (
                    <div className="text-center mt-20">
                      <h2 className="text-2xl font-bold">Coming Soon</h2>
                      <p className="text-text-secondary">This section is under construction.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}