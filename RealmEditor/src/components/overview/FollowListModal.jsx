// src/components/overview/FollowListModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Users } from 'lucide-react';

// NOTE: This MOCK DATA must be passed as a prop from the parent component
const MOCK_LIST_DATA = {
    followers: [
        { id: 1, name: 'Alice Smith', username: 'alice.s', title: 'Senior Engineer' },
        { id: 2, name: 'Bob Johnson', username: 'bob.j', title: 'Product Manager' },
        { id: 3, name: 'Diana Prince', username: 'diana.p', title: 'QA Specialist' },
    ],
    following: [
        { id: 6, name: 'Greg House', username: 'greg.h', title: 'CTO, Tech Solutions' },
        { id: 7, name: 'Hannah Lee', username: 'hannah.l', title: 'Lead Architect' },
    ],
};

// --- Profile Card Sub-Component (Styling the list items) ---
const ProfileCard = ({ user, type, accentColor }) => {
    // Determine the action button text
    const actionText = type === 'followers' ? 'Remove' : 'Unfollow';
    const actionColor = type === 'followers' ? 'text-red-400' : 'text-text-secondary';
    
    // Placeholder for opening a detailed profile view
    const handleProfileClick = () => {
        console.log(`[NAVIGATION]: Opening profile of ${user.name}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-3 bg-background rounded-lg border border-border-color hover:bg-hover-color transition-colors"
        >
            {/* Clickable Profile Info */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleProfileClick}>
                <img 
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=${accentColor.replace('#', '')}&color=fff&size=40`} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full object-cover" 
                />
                <div>
                    <span className="text-sm font-semibold text-text-primary block">{user.name}</span>
                    {/* Placeholder for future details */}
                    <span className="text-xs text-text-secondary block truncate">{user.title || `No details`}</span>
                </div>
            </div>

            {/* Action Button (Remove / Unfollow) */}
            <button 
                className={`text-xs px-3 py-1 font-medium rounded-full border border-border-color ${actionColor} hover:bg-hover-color transition-colors`}
                onClick={() => console.log(`[ACTION]: ${actionText} ${user.name}`)}
            >
                {actionText}
            </button>
        </motion.div>
    );
};
// ------------------------------------------------------------


export default function FollowListModal({ isOpen, onClose, initialTab, accentColor, mockData }) {
    const [activeTab, setActiveTab] = useState(initialTab || 'following');
    
    // Determine the list data based on the active tab
    const listData = activeTab === 'followers' ? mockData.followers : mockData.following;

    // Segmented Button Style Helper
    const getTabClass = (tabName) => 
        `flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
            activeTab === tabName 
                ? 'bg-accent text-white shadow-md' 
                : 'text-text-secondary hover:bg-background'
        }`;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    // Fixed, high Z-index overlay with glassy effect
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        // Smooth entrance animation (Scale + Fade)
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        
                        className="bg-card-background border border-border-color rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()} // Stop click-outside closure
                    >
                        {/* Modal Header */}
                        <div className="p-5 border-b border-border-color flex justify-between items-center flex-shrink-0">
                            <h2 className="text-xl font-bold text-text-primary flex items-center space-x-2">
                                <Users size={24} style={{ color: accentColor }} />
                                <span>Network Hub</span>
                            </h2>
                            {/* Close Button */}
                            <button onClick={onClose} className="p-2 rounded-full text-text-secondary hover:bg-hover-color transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tab Navigation (Segmented Buttons) */}
                        <div className="p-4 border-b border-border-color flex-shrink-0">
                            <div className="flex bg-background rounded-lg p-1 space-x-1">
                                <motion.button
                                    onClick={() => setActiveTab('following')}
                                    className={getTabClass('following')}
                                    style={activeTab === 'following' ? { backgroundColor: accentColor } : {}}
                                >
                                    Following ({mockData.following.length})
                                </motion.button>
                                <motion.button
                                    onClick={() => setActiveTab('followers')}
                                    className={getTabClass('followers')}
                                    style={activeTab === 'followers' ? { backgroundColor: accentColor } : {}}
                                >
                                    Followers ({mockData.followers.length})
                                </motion.button>
                            </div>
                        </div>

                        {/* Content Panel (Scrollable Area) */}
                        <div className="flex-grow overflow-y-auto p-5 space-y-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab} // Key changes based on activeTab to trigger content transition
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    {listData.length > 0 ? (
                                        listData.map(user => (
                                            <ProfileCard 
                                                key={user.id} 
                                                user={user} 
                                                type={activeTab}
                                                accentColor={accentColor} 
                                            />
                                        ))
                                    ) : (
                                        <p className="text-center text-text-secondary py-10 text-md">
                                            No one is here yet! Start connecting.
                                        </p>
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