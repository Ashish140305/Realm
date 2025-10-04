import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitPullRequest, CheckCircle, X, Mail } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';

// --- DATA IS NOW EXPORTED ---
export let inboxItemsData = [
  { id: 1, type: 'PR_REVIEW', title: 'feat: Implement new Activity Dashboard UI', repo: 'RealmEditor-Frontend', user: 'ashish140305', read: false },
  { id: 2, type: 'TASK', text: 'Deploy staging build v1.2.5', read: false },
  { id: 3, type: 'PR_REVIEW', title: 'fix: Correct theme toggle behavior', repo: 'RealmEditor-Frontend', user: 'jane-doe', read: true },
  { id: 4, type: 'TASK', text: 'Fix bug in theme state management', read: true },
];

const InboxItem = ({ item, index, onMarkAsRead }) => {
    const isTask = item.type === 'TASK';

    return (
        <motion.div
            className="group relative flex items-start gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-white/5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
        >
            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isTask ? 'bg-orange-400/10' : 'bg-green-500/10'}`}>
                {isTask ? (
                    <CheckCircle size={16} className="text-orange-400" />
                ) : (
                    <GitPullRequest size={16} className="text-green-500" />
                )}
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-sm text-text-primary leading-tight">{item.text || item.title}</p>
                {!isTask && (
                    <p className="text-xs text-text-secondary mt-0.5">
                        In <span className="font-medium text-text-primary">{item.repo}</span>
                    </p>
                )}
            </div>
             {!item.read && (
                <button 
                    onClick={() => onMarkAsRead(item.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-card-background opacity-0 group-hover:opacity-100 transition-opacity" 
                    title="Mark as read"
                >
                    <Mail size={16} className="text-text-secondary" />
                </button>
            )}
        </motion.div>
    );
};

export default function InboxDrawer({ isOpen, onClose }) {
  const [items, setItems] = useState(inboxItemsData);
  const accentColor = useSettingsStore(state => state.accentColor);

  useEffect(() => {
    if (isOpen) {
      setItems(inboxItemsData);
    }
  }, [isOpen]);

  const handleMarkAsRead = (id) => {
    const updatedItems = items.map(item => item.id === id ? { ...item, read: true } : item);
    setItems(updatedItems);
    // Update the exported data so the header dot can be updated
    inboxItemsData = updatedItems;
  };

  const handleMarkAllAsRead = () => {
    const allRead = items.map(item => ({ ...item, read: true }));
    setItems(allRead);
    inboxItemsData = allRead;
  };

  const unreadItems = items.filter(item => !item.read);
  const readItems = items.filter(item => item.read);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
            aria-hidden="true"
          />

          {/* === UPDATED: Glassmorphism classes removed === */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 40 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border-color z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border-color">
              <h2 className="text-lg font-bold text-text-primary">Notifications</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-card-background">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow p-2 overflow-y-auto">
              {items.length > 0 ? (
                <>
                  {unreadItems.length > 0 && (
                    <div className="mb-4">
                      <h3 className="px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Unread</h3>
                      {unreadItems.map((item, index) => (
                          <InboxItem key={item.id} item={item} index={index} onMarkAsRead={handleMarkAsRead} />
                      ))}
                    </div>
                  )}
                  {readItems.length > 0 && (
                    <div>
                      <h3 className="px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Read</h3>
                      {readItems.map((item, index) => (
                          <InboxItem key={item.id} item={item} index={index} onMarkAsRead={handleMarkAsRead} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
                    <Mail size={48} className="mb-4" />
                    <h3 className="font-semibold text-text-primary">All caught up!</h3>
                    <p className="text-sm">Your inbox is empty.</p>
                </div>
              )}
            </div>

            {unreadItems.length > 0 && (
              <div className="p-4 border-t border-border-color">
                  <button onClick={handleMarkAllAsRead} className="w-full text-center text-sm font-semibold text-accent hover:underline">
                      Mark all as read
                  </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}