import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Settings, LogOut, User, Code } from 'lucide-react'; // Import Code icon
import useSettingsStore from '../../store/useSettingsStore';

export default function OverviewHeader({ onSettingsClick }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const profile = useSettingsStore((state) => state.profile);
  const navigate = useNavigate(); // Initialize navigate function

  const handleGoToEditor = () => {
    navigate('/editor'); // Navigate to the editor page
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card-background/80 backdrop-blur-lg border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left Side: Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-text-primary">Realm</h1>
        </div>

        {/* Right Side: Search, Icons, Profile */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <motion.input
              whileFocus={{ width: 256 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              type="text"
              placeholder="Search..."
              className="pl-9 pr-3 py-2 w-48 bg-background border border-border-color rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* New "Go to Editor" Button */}
          <button 
            onClick={handleGoToEditor} 
            className="p-2 rounded-full hover:bg-background transition-colors" 
            title="Go to Editor"
          >
            <Code className="w-5 h-5 text-text-secondary" />
          </button>

          <button className="p-2 rounded-full hover:bg-background transition-colors" title="Notifications">
            <Bell className="w-5 h-5 text-text-secondary" />
          </button>
          
          <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-background transition-colors" title="Settings">
            <Settings className="w-5 h-5 text-text-secondary" />
          </button>

          <div className="relative">
            <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="w-9 h-9 rounded-full overflow-hidden border-2 border-border-color hover:border-accent transition-colors">
              <img src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=random`} alt="Profile" className="w-full h-full object-cover" />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-card-background border border-border-color rounded-md shadow-lg"
                >
                  <div className="p-2">
                    <button 
                      onClick={() => setDropdownOpen(false)} 
                      className="w-full text-left flex items-center px-3 py-2 text-sm text-text-primary hover:bg-background rounded-md"
                    >
                      <User className="w-4 h-4 mr-2" /> My Profile
                    </button>
                    <button className="w-full text-left flex items-center px-3 py-2 text-sm text-red-400 hover:bg-background rounded-md">
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
  );
}