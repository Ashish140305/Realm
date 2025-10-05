import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building, Mail, Github, Linkedin, Twitter, UserPlus, Share2, Users, Edit, Search, X } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';

// --- MOCK DATA (Required for the Modal to function) ---
const MOCK_FOLLOWING_COUNT = 12;
const MOCK_FOLLOWERS_COUNT = 8;
const MOCK_LIST_DATA = {
    followers: [
        { id: 1, name: 'Alice Smith', username: 'alice.s', title: 'Senior Engineer' },
        { id: 2, name: 'Bob Johnson', username: 'bob.j', title: 'Product Manager' },
        { id: 3, name: 'Diana Prince', username: 'diana.p', title: 'QA Specialist' },
    ],
    following: [
        { id: 6, name: 'Greg House', username: 'greg.h', title: 'CTO, Tech Solutions' },
        { id: 7, name: 'Hannah Lee', username: 'hannah.l', title: 'Lead Architect' },
        { id: 8, name: 'Isaac Newton', username: 'isaac.n', title: 'Data Scientist' },
    ],
};

// --- UTILITY COMPONENTS ---

const ProfileCard = ({ user, type, accentColor }) => {
    const actionText = type === 'followers' ? 'Remove' : 'Unfollow';
    const actionColor = type === 'followers' ? 'text-red-400' : 'text-text-secondary';

    const handleProfileClick = () => {
        console.log(`[NAVIGATION]: Opening profile of ${user.name}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{
                scale: 1.02,
                boxShadow: `0 8px 15px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px ${accentColor}40`
            }}
            className="group flex items-center justify-between p-3 bg-background rounded-lg border border-border-color transition-all duration-200 cursor-pointer"
        >
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleProfileClick}>
                <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=${accentColor.replace('#', '')}&color=fff&size=40`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                />
                <div>
                    <span className="text-sm font-semibold text-text-primary block transition-colors duration-200 group-hover:text-accent">{user.name}</span>
                    <span className="text-xs text-text-secondary block truncate">{user.title || `@${user.username}`}</span>
                </div>
            </div>

            <button
                className={`text-xs px-3 py-1 font-medium rounded-full border border-border-color ${actionColor} hover:bg-hover-color transition-colors`}
                onClick={() => console.log(`[ACTION]: ${actionText} ${user.name}`)}
            >
                {actionText}
            </button>
        </motion.div>
    );
};


const FollowListModal = ({ isOpen, onClose, initialTab, accentColor }) => {
    const mockData = MOCK_LIST_DATA;
    const [activeTab, setActiveTab] = useState(initialTab || 'following');
    const listData = activeTab === 'followers' ? mockData.followers : mockData.following;

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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}

                        className="bg-card-background border border-border-color rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-border-color flex justify-between items-center flex-shrink-0">
                            <h2 className="text-xl font-bold text-text-primary flex items-center space-x-2">
                                <Users size={24} style={{ color: accentColor }} />
                                <span>Network Hub</span>
                            </h2>
                            <button onClick={onClose} className="p-2 rounded-full text-text-secondary hover:bg-hover-color transition-colors">
                                <X size={20} />
                            </button>
                        </div>

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

                        <div className="flex-grow overflow-y-auto p-5 space-y-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
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
                                        <p className="text-center text-text-secondary py-10 text-md">No one is here yet! Start connecting.</p>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// =================================================================
// NEW: Separate components for professional and social details
// =================================================================

// Component for Professional Details (Role, Company, Email)
const ProfessionalDetail = ({ icon: Icon, value, label }) => {
    if (!value) return null;
    return (
        <div className="flex items-center space-x-3">
            <Icon size={18} className="text-text-secondary flex-shrink-0" />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary truncate">{value}</p>
                {label && <p className="text-xs text-text-secondary">{label}</p>}
            </div>
        </div>
    );
};

// Component for Social Links
const SocialLink = ({ icon: Icon, href, accentColor }) => {
    if (!href) return null;
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 rounded-lg bg-background text-text-secondary hover:text-white transition-all duration-200"
            style={{ '--hover-color': accentColor }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--hover-color)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
        >
            <Icon size={20} />
        </a>
    );
};
// =================================================================

export default function ProfilePanel({ onEditProfileClick }) {
    const { profile, accentColor } = useSettingsStore((state) => ({
        profile: state.profile,
        accentColor: state.accentColor,
    }));

    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowListModalOpen, setIsFollowListModalOpen] = useState(false);
    const [currentListType, setCurrentListType] = useState('followers');

    const handleFollowToggle = () => setIsFollowing(p => !p);
    const onViewNetworkClick = (type) => {
        setCurrentListType(type);
        setIsFollowListModalOpen(true);
    }

    const followButtonClasses = isFollowing
        ? "bg-transparent text-text-primary border border-border-color hover:bg-hover-color"
        : "bg-accent text-white border border-accent hover:bg-accent-hover";

    return (
        <React.Fragment>
            <motion.div
                className="sticky top-24"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* Main Profile Card */}
                <div className="p-6 bg-card-background rounded-xl shadow-lg mb-6 border-2 border-transparent transition-colors duration-300 hover:border-accent">

                    <div className="relative w-32 h-32 mx-auto mb-4">
                        <img
                            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                            alt="Profile Avatar"
                            className="w-full h-full rounded-full object-cover border-4 border-accent transition-all duration-300"
                        />
                        <div
                            className="absolute -top-1 -right-1 p-2 rounded-full bg-card-background border border-border-color transition-all duration-300 cursor-pointer"
                            onClick={onEditProfileClick}
                            title="Edit Profile"
                            style={{ color: accentColor }}
                        >
                            <Edit size={16} />
                        </div>
                    </div>

                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-text-primary tracking-wide truncate">{profile.name || 'Your Name'}</h1>
                        <p className="text-md text-text-secondary mb-3">@{profile.username || 'username'}</p>
                        <p className="text-sm text-text-primary break-words mb-4">{profile.bio || 'Your bio goes here.'}</p>
                    </div>
                    
                    <div className="relative mb-6 mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search accounts to follow..."
                            className="w-full pl-9 pr-3 py-2 bg-background border border-border-color rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent text-text-primary"
                        />
                    </div>

                    <div className="flex justify-center items-center my-4 py-3">
                        <button
                            onClick={() => onViewNetworkClick('followers')}
                            className="group flex items-baseline hover:text-accent transition-colors focus:outline-none"
                        >
                            <span className="text-lg font-extrabold text-text-primary group-hover:text-accent transition-colors mr-1">
                                {MOCK_FOLLOWERS_COUNT}
                            </span>
                            <span className="text-sm text-text-secondary font-medium group-hover:text-accent transition-colors">
                                Followers
                            </span>
                        </button>
                        <span className="text-text-secondary text-base font-light mx-2">·</span>
                        <button
                            onClick={() => onViewNetworkClick('following')}
                            className="group flex items-baseline hover:text-accent transition-colors focus:outline-none"
                        >
                            <span className="text-lg font-extrabold text-text-primary group-hover:text-accent transition-colors mr-1">
                                {MOCK_FOLLOWING_COUNT}
                            </span>
                            <span className="text-sm text-text-secondary font-medium group-hover:text-accent transition-colors">
                                Following
                            </span>
                        </button>
                    </div>

                    <div className="flex space-x-3 mt-6">
                        <motion.button
                            onClick={handleFollowToggle}
                            className={`flex-grow py-2 px-4 font-semibold rounded-lg transition-colors duration-200 ${followButtonClasses}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isFollowing ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <Users size={18} /> <span>Following</span>
                                </span>
                            ) : (
                                <span className="flex items-center justify-center space-x-2">
                                    <UserPlus size={18} /> <span>Follow</span>
                                </span>
                            )}
                        </motion.button>
                        <button
                            className="p-2.5 rounded-lg border border-border-color text-text-secondary hover:bg-hover-color transition-colors"
                            onClick={() => console.log('Share Profile')}
                        >
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                {/* MODIFIED: Replaced old design with new Professional and Social sections */}
                <div className="p-4 bg-card-background rounded-xl shadow-lg border-2 border-transparent transition-colors duration-300 hover:border-accent">
                    {/* Professional Details Section */}
                    <div className="space-y-4">
                        <ProfessionalDetail icon={Briefcase} value={profile.profession} label="Profession" />
                        <ProfessionalDetail icon={Building} value={profile.company} label="Company" />
                        <ProfessionalDetail icon={Mail} value={profile.email} label="Email" />
                    </div>

                    {/* Divider */}
                    <div className="border-b border-border-color my-4"></div>

                    {/* Social Links Section */}
                    <div className="flex justify-around items-center">
                        <SocialLink icon={Github} href={profile.socials?.github ? `https://github.com/${profile.socials.github}` : null} accentColor={accentColor} />
                        <SocialLink icon={Linkedin} href={profile.socials?.linkedin ? `https://linkedin.com/in/${profile.socials.linkedin}` : null} accentColor={accentColor} />
                        <SocialLink icon={Twitter} href={profile.socials?.twitter ? `https://twitter.com/${profile.socials.twitter}` : null} accentColor={accentColor} />
                    </div>
                </div>
            </motion.div>

            <FollowListModal
                isOpen={isFollowListModalOpen}
                onClose={() => setIsFollowListModalOpen(false)}
                initialTab={currentListType}
                accentColor={accentColor}
            />
        </React.Fragment>
    );
}