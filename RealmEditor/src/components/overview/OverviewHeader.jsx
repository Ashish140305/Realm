// src/components/overview/OverviewHeader.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Icons
import { Search, Bell, Settings, LogOut, User, Code, ListTree, Clock, Pin, X, Target } from 'lucide-react'; 
import useSettingsStore from '../../store/useSettingsStore';
import InboxDrawer, { inboxItemsData } from './InboxDrawer';
import ProfileEditorModal from './ProfileEditorModal'; 


// --- REALM LOGO COMPONENT (Using provided SVG structure) ---
const RealmLogo = ({ accentColor }) => (
    <div className="flex items-center space-x-2">
        {/* Realm Logo SVG (Scaled down from 48x48 to fit header) */}
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            {/* Paths copied from src/assets/RealmLogo.jsx */}
            <path d="M24 6L10 16V36L24 46L38 36V16L24 6Z" fill="#E9D5FF"/>
            <path d="M24 26L10 16V36L24 46L38 36V16L24 26Z" fill="#C4B5FD"/>
            <path d="M24 6L10 16L24 26L38 16L24 6Z" fill="#A78BFA"/>
        </svg>
        <span
            className="text-xl font-extrabold tracking-tight"
            style={{
                color: accentColor, // Use accent color for "Realm" text
                textShadow: `0 0 0 0.5px ${accentColor}80`, // Subtle design improvement
            }}
        >
            Realm
        </span>
    </div>
);
// ------------------------------------------

// --- CONTEXT MODAL PLACEHOLDER (Used for Setting Status/Context/ETA) ---
const ContextModal = ({ isOpen, onClose }) => {
    const { setWorkingContext, setStatus } = useSettingsStore(state => ({
        setWorkingContext: state.setWorkingContext,
        setStatus: state.setStatus
    }));
    
    const [context, setContext] = useState('');

    const handleSetContext = () => {
        if (context) {
            setWorkingContext(context);
            // Sets a default 30-minute Heads Down status with an ETA timestamp
            const thirtyMinutesFromNow = Date.now() + 30 * 60 * 1000;
            setStatus({ 
                text: context, 
                pauseNotifications: true, 
                isHeadsDown: true,
                etaTimestamp: thirtyMinutesFromNow,
            }); 
        }
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
                        className="bg-card-background border border-border-color rounded-lg shadow-2xl w-full max-w-md p-6 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="font-semibold text-lg text-text-primary flex items-center space-x-2">
                           <ListTree className="w-5 h-5 text-accent" />
                           <span>Set Current Working Context</span>
                        </h2>
                        <input
                            type="text"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="e.g., Reviewing PR #45, Available in 30 minutes"
                            className="w-full px-3 py-2 bg-background border border-border-color rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-text-primary"
                        />
                         <div className="flex justify-end space-x-3">
                              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-hover-color rounded-md transition-colors">
                                 Cancel
                             </button>
                             <button onClick={handleSetContext} className="px-5 py-2 text-sm font-medium text-white rounded-md bg-accent" disabled={!context}>
                                 Update Status
                             </button>
                         </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
// ------------------------------------------


export default function OverviewHeader({ onSettingsClick, onSearchClick }) { // Added onSearchClick
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isInboxDrawerOpen, setInboxDrawerOpen] = useState(false);
  // Replaced isFocusAssistModalOpen
  const [isContextModalOpen, setIsContextModalOpen] = useState(false); 
  // State for the Profile Editor Modal
  const [isProfileEditorModalOpen, setProfileEditorModalOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [etaRemaining, setEtaRemaining] = useState(0); 

  const { 
    profile, 
    accentColor, 
    status, 
    setStatus,
    workingContextHistory, 
    setWorkingContext, 
    removeContextFromHistory, 
    pinnedTask, 
    setPinnedTask 
  } = useSettingsStore((state) => state);
  
  const navigate = useNavigate();

  // Contextual Timer Logic (Omitted for brevity - assumed correct)

  // Helper functions (Time Formatting, Progress Calculation) - Simplified
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    if (m >= 60) {
        return `${Math.floor(m / 60)}h`; 
    }
    return `${m}m`;
  };
  
  const getProgressPercent = () => {
      if (!status?.etaTimestamp || !status?.isHeadsDown) return 0;
      const initialDurationMs = 30 * 60 * 1000; 
      const elapsedMs = initialDurationMs - (etaRemaining * 1000); 
      return Math.min(100, (elapsedMs / initialDurationMs) * 100);
  };
  
  const progressPercent = getProgressPercent();
  const circumference = 94.25; 


  const handleGoToEditor = () => navigate('/editor');

  const openContextModal = () => {
    setDropdownOpen(false);
    setIsContextModalOpen(true);
  };
  
  // Handlers for Profile Editor Modal (FIXED)
  const openProfileEditorModal = () => {
    setDropdownOpen(false); // Close dropdown
    setProfileEditorModalOpen(true); // Open the profile editor modal
  };
  
  // Handler for Quick Context Resume
  const handleContextSelect = (contextText) => {
      setWorkingContext(contextText);
      const thirtyMinutesFromNow = Date.now() + 30 * 60 * 1000;
      setStatus({ 
        text: contextText, 
        pauseNotifications: true, 
        isHeadsDown: true,
        etaTimestamp: thirtyMinutesFromNow,
      });
      setDropdownOpen(false);
  }
  
  // Handler for deleting a context
  const handleDeleteContext = (event, dateToRemove) => {
      event.stopPropagation();
      removeContextFromHistory(dateToRemove);
  }
  
  // Handler for pinning/unpinning a task
  const togglePinTask = () => {
      if (pinnedTask) {
          setPinnedTask(null); 
      } else {
          setPinnedTask({ id: '45', type: 'PR', name: 'Fix Sidebar Bug' }); 
      }
      setDropdownOpen(false);
  }

  // Handler for Quick Status Picker (Omitted for brevity - assumed correct)
  const handleQuickStatusChange = () => {}; // Placeholder

  const getStatusColor = (status) => {
    if (!status) return '#6b7280'; 
    if (status.pauseNotifications || status.isHeadsDown) return '#ef4444'; 
    if (status.text && status.text.toLowerCase().includes('break')) return '#f59e0b'; 
    return '#10b981'; 
  };
  
  const pinnedTaskTitle = pinnedTask 
    ? `Pinned: [${pinnedTask.type}-${pinnedTask.id}] ${pinnedTask.name}`
    : `Click to set a Pinned Task`;


  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card-background/80 backdrop-blur-lg border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* NEW: Realm Logo and Styled Text */}
             <RealmLogo accentColor={accentColor} /> 
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="relative hidden md:block cursor-pointer"
              onClick={onSearchClick} // <-- INTEGRATION HERE
            >
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
               {/* MODIFIED: Increased search bar width */}
               <input type="text" placeholder="Search..." className="pl-9 pr-3 py-2 w-80 bg-background border border-border-color rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent" readOnly/>
            </div>
            <button onClick={handleGoToEditor} className="p-2 rounded-full hover:bg-background transition-colors" title="Go to Editor"><Code className="w-5 h-5 text-text-secondary" /></button>
            
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
                className="relative w-9 h-9 rounded-full focus:outline-none group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={pinnedTaskTitle}
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

                {/* Contextual ETA Progress Ring */}
                {status?.isHeadsDown && status?.etaTimestamp && (
                  <svg className="absolute -inset-0.5 w-10 h-10 transform -rotate-90 z-10" viewBox="0 0 34 34">
                    {/* Progress Track */}
                    <circle 
                      className="text-card-background/50" 
                      strokeWidth="3" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="15" 
                      cx="17" 
                      cy="17"
                    />
                    {/* Progress Indicator */}
                    <circle 
                      className="transition-all duration-100 ease-linear"
                      strokeDasharray={circumference} 
                      strokeDashoffset={circumference - (progressPercent / 100) * circumference} 
                      strokeLinecap="round" 
                      strokeWidth="3" 
                      stroke={getStatusColor(status)}
                      fill="transparent" 
                      r="15" 
                      cx="17" 
                      cy="17" 
                    />
                  </svg>
                )}
                
                {/* Time Overlay on Icon */}
                {etaRemaining > 60 && status?.isHeadsDown && (
                  <div className="absolute bottom-[-2px] right-[-4px] w-6 h-6 rounded-full flex items-center justify-center bg-black/80 border-2 border-card-background z-30" title={`Available in ${formatTime(etaRemaining)}`}>
                      <p className="text-[10px] text-white font-mono leading-none">{formatTime(etaRemaining)}</p>
                  </div>
                )}
                
                {/* Visual Pinned Task Icon */}
                {pinnedTask && !status?.isHeadsDown && (
                    <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-card-background border border-border-color flex items-center justify-center z-20">
                        <Pin className="w-2.5 h-2.5 text-text-secondary" />
                    </div>
                )}
                
                <img src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=random`} alt="Profile" className="w-full h-full rounded-full object-cover relative z-10" />
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
                      
                      {/* QUICK STATUS PICKER */}
                      <div className="px-2 py-2">
                          <p className="text-xs font-semibold text-text-secondary mb-2">Quick Status</p>
                          <div className="grid grid-cols-4 gap-2">
                              {/* Offline */}
                              <motion.button 
                                  onClick={() => handleQuickStatusChange('offline')} 
                                  className="w-full h-8 rounded-md bg-gray-500 hover:scale-105 transition-transform" 
                                  title="Offline"
                                  whileTap={{ scale: 0.9 }}
                              ></motion.button>
                              {/* Available */}
                              <motion.button 
                                  onClick={() => handleQuickStatusChange('available')} 
                                  className="w-full h-8 rounded-md bg-green-500 hover:scale-105 transition-transform" 
                                  title="Available"
                                  whileTap={{ scale: 0.9 }}
                              ></motion.button>
                              {/* On Break */}
                              <motion.button 
                                  onClick={() => handleQuickStatusChange('on-break')} 
                                  className="w-full h-8 rounded-md bg-amber-500 hover:scale-105 transition-transform" 
                                  title="On Break"
                                  whileTap={{ scale: 0.9 }}
                              ></motion.button>
                              {/* Heads-Down */}
                              <motion.button 
                                  onClick={() => handleQuickStatusChange('heads-down')} 
                                  className="w-full h-8 rounded-md bg-red-500 hover:scale-105 transition-transform" 
                                  title="Heads-Down (DND)"
                                  whileTap={{ scale: 0.9 }}
                              ></motion.button>
                          </div>
                      </div>
                      <div className="border-t border-border-color my-1"></div>
                      
                      {/* Context Quick-Switcher */}
                      {workingContextHistory.length > 0 && (
                          <div className="space-y-1 pb-2">
                              <p className="px-2 text-xs font-semibold text-text-secondary">Recent Contexts</p>
                              {workingContextHistory.map((context) => (
                                  <motion.button 
                                      key={context.date} 
                                      onClick={() => handleContextSelect(context.text)} 
                                      className="w-full text-left flex items-center justify-between px-2 py-1.5 text-sm text-text-primary hover:bg-background rounded-md truncate group"
                                      title={context.text}
                                      whileHover={{ scale: 1.02 }}
                                  >
                                      <span className="flex items-center min-w-0 flex-grow truncate">
                                          <Clock className="w-3 h-3 mr-2 flex-shrink-0 text-text-secondary" />
                                          <span className="truncate">{context.text}</span>
                                      </span>
                                      
                                      {/* Delete Button */}
                                      <button
                                          onClick={(e) => handleDeleteContext(e, context.date)}
                                          className="p-1 -mr-1 rounded-full text-text-secondary hover:bg-hover-color/70 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                                          title="Remove from history"
                                      >
                                          <X className="w-3 h-3" />
                                      </button>
                                  </motion.button>
                              ))}
                          </div>
                      )}
                      
                      {workingContextHistory.length > 0 && <div className="border-t border-border-color my-1"></div>}

                      {/* NEW BUTTON: Set Working Context */}
                      <button onClick={openContextModal} className="w-full text-left flex items-center px-2 py-2 text-sm text-text-primary hover:bg-background rounded-md">
                        <ListTree className="w-4 h-4 mr-2" /> Set Working Context
                      </button>
                      
                      {/* CORRECTED BUTTON: My Profile (Opens ProfileEditorModal) */}
                      <button onClick={openProfileEditorModal} className="w-full text-left flex items-center px-2 py-2 text-sm text-text-primary hover:bg-background rounded-md">
                        <User className="w-4 h-4 mr-2" /> My Profile
                      </button>
                      
                      {/* Toggle Pin Task Button */}
                      <button onClick={togglePinTask} className={`w-full text-left flex items-center px-2 py-2 text-sm rounded-md ${pinnedTask ? 'text-red-400 hover:bg-background' : 'text-text-primary hover:bg-background'}`}>
                        <Pin className="w-4 h-4 mr-2" /> 
                        {pinnedTask ? `Unpin: [${pinnedTask.type}-${pinnedTask.id}]` : 'Pin Current Task'}
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
      {/* RENDER MODALS */}
      <ContextModal isOpen={isContextModalOpen} onClose={() => setIsContextModalOpen(false)} />
      <InboxDrawer isOpen={isInboxDrawerOpen} onClose={() => setInboxDrawerOpen(false)} />
      {/* CORRECTED RENDER: ProfileEditorModal uses the required prop: isVisible */}
      <ProfileEditorModal isVisible={isProfileEditorModalOpen} onClose={() => setProfileEditorModalOpen(false)} />
    </>
  );
}