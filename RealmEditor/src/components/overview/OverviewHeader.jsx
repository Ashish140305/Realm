// src/components/overview/OverviewHeader.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Settings, LogOut, User, Code, Target } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import InboxDrawer, { inboxItemsData } from './InboxDrawer';
import FocusAssistModal from './FocusAssistModal';

export default function OverviewHeader({ onSettingsClick }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isInboxDrawerOpen, setInboxDrawerOpen] = useState(false);
  const [isFocusAssistModalOpen, setFocusAssistModalOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const { profile, accentColor, status } = useSettingsStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    const hasUnreadItems = inboxItemsData.some(item => !item.read);
    setHasUnread(hasUnreadItems);
  }, []);

  const handleGoToEditor = () => navigate('/editor');

  const openFocusAssistModal = () => {
    setDropdownOpen(false);
    setFocusAssistModalOpen(true);
  };

  const getStatusColor = (status) => {
    if (!status) return '#6b7280'; // Gray for offline
    if (status.pauseNotifications) return '#ef4444'; // Red for Focusing
    if (status.text && status.text.toLowerCase().includes('break')) return '#f59e0b'; // Amber for break
    return '#10b981'; // Green for available
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card-background/80 backdrop-blur-lg border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-text-primary">Realm</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
               <input type="text" placeholder="Search..." className="pl-9 pr-3 py-2 w-48 bg-background border border-border-color rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <button onClick={handleGoToEditor} className="p-2 rounded-full hover:bg-background transition-colors" title="Go to Editor"><Code className="w-5 h-5 text-text-secondary" /></button>
            
            {/* Bell Icon with Animation Restored */}
            <motion.button 
              onClick={() => setInboxDrawerOpen(true)} 
              className="relative p-2 rounded-full hover:bg-background transition-colors" 
              title="Notifications"
              whileHover={{ 
                rotate: [0, -15, 15, -15, 15, 0],
                transition: { duration: 0.5, ease: "easeInOut" }
              }}
            >
              <Bell className="w-5 h-5 text-text-secondary" />
              {hasUnread && <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>}
            </motion.button>
            
            <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-background transition-colors" title="Settings"><Settings className="w-5 h-5 text-text-secondary" /></button>
            
            <div className="relative">
              <motion.button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="relative w-9 h-9 rounded-full focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="absolute -inset-0.5 rounded-full"
                  animate={{ 
                    borderColor: getStatusColor(status),
                    borderWidth: '2px',
                    boxShadow: isDropdownOpen ? `0 0 8px ${getStatusColor(status)}` : `0 0 0px ${getStatusColor(status)}`,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
                <img src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=random`} alt="Profile" className="w-full h-full rounded-full object-cover" />
              </motion.button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-3 w-64 bg-card-background border border-border-color rounded-md shadow-lg origin-top-right z-50"
                  >
                    <div className="p-2">
                      <div className="px-2 py-2">
                        <p className="text-sm font-semibold text-text-primary">{profile.name}</p>
                        <p className="text-xs text-text-secondary truncate">{profile.email}</p>
                      </div>
                      <div className="border-t border-border-color my-1"></div>
                      <button onClick={openFocusAssistModal} className="w-full text-left flex items-center px-2 py-2 text-sm text-text-primary hover:bg-background rounded-md">
                        <Target className="w-4 h-4 mr-2" /> Start Focus Session
                      </button>
                      <button className="w-full text-left flex items-center px-2 py-2 text-sm text-text-primary hover:bg-background rounded-md">
                        <User className="w-4 h-4 mr-2" /> My Profile
                      </button>
                      <div className="border-t border-border-color my-1"></div>
                      <button className="w-full text-left flex items-center px-2 py-2 text-sm text-red-400 hover:bg-background rounded-md">
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
      <FocusAssistModal isOpen={isFocusAssistModalOpen} onClose={() => setFocusAssistModalOpen(false)} />
      <InboxDrawer isOpen={isInboxDrawerOpen} onClose={() => setInboxDrawerOpen(false)} />
    </>
  );
}