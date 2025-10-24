// src/components/overview/ProfilePanel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Icons
import { Briefcase, Mail, Github, Linkedin, Twitter, UserPlus, Share2, Users, Edit, Search, X } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import axios from 'axios';


// --- UTILITY COMPONENTS (Defined here to resolve ReferenceError) ---

// Profile Card Sub-Component (Used by the Modal)
const ProfileCard = ({ user, type, accentColor, onFollow }) => {
    const actionText = type === 'followers' ? 'Remove' : 'Follow';
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
                    <span className="text-sm font-semibold text-text-primary block transition-colors duration-200 group-hover:text-accent">{user.username}</span>
                    <span className="text-xs text-text-secondary block truncate">{user.name || `@${user.username}`}</span>
                </div>
            </div>

            <button
                className={`text-xs px-3 py-1 font-medium rounded-full border border-border-color ${actionColor} hover:bg-hover-color transition-colors`}
                onClick={() => onFollow(user.username)} // Change: pass user.userId instead of user.id
            >
                {actionText}
            </button>
        </motion.div>
    );
};


// FOLLOW LIST MODAL COMPONENT (Isolated Window)
const FollowListModal = ({ isOpen, onClose, initialTab, accentColor, searchResults, onSearchChange, onFollow, username }) => {
    const [activeTab, setActiveTab] = useState(initialTab || 'following');
    const [listData, setListData] = useState([]);


    useEffect(() => {
        const fetchUsers = async () => {
            if (isOpen && username) {
                try {
                    const response = await axios.get(`/api/collaboration/${username}/${activeTab}`);
                    setListData(response.data);
                } catch (error) {
                    console.error(`Error fetching ${activeTab}:`, error);
                }
            }
        };

        fetchUsers();

        const channel = supabase.channel('profile-updates');
        const subscription = channel.on('broadcast', { event: 'user-updated' }, () => {
            if (isOpen) {
                fetchUsers();
            }
        }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isOpen, activeTab, searchResults, username]);


    const getTabClass = (tabName) =>
        `flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${activeTab === tabName
            ? 'bg-accent text-white shadow-md'
            : 'text-text-secondary hover:bg-background'
        }`;

    const displayData = activeTab === 'search' ? searchResults : listData;

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
                        {/* Modal Header */}
                        <div className="p-5 border-b border-border-color flex justify-between items-center flex-shrink-0">
                            <h2 className="text-xl font-bold text-text-primary flex items-center space-x-2">
                                <Users size={24} style={{ color: accentColor }} />
                                <span>Network Hub</span>
                            </h2>
                            <button onClick={onClose} className="p-2 rounded-full text-text-secondary hover:bg-hover-color transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tab Navigation (Segmented Buttons) */}
                        <div className="p-4 border-b border-border-color flex-shrink-0">
                            <div className="flex bg-background rounded-lg p-1 space-x-1">
                                <motion.button
                                    onClick={() => setActiveTab('search')}
                                    className={getTabClass('search')}
                                    style={activeTab === 'search' ? { backgroundColor: accentColor } : {}}
                                >
                                    Search
                                </motion.button>
                                <motion.button
                                    onClick={() => setActiveTab('following')}
                                    className={getTabClass('following')}
                                    style={activeTab === 'following' ? { backgroundColor: accentColor } : {}}
                                >
                                    Following ({listData.length})
                                </motion.button>
                                <motion.button
                                    onClick={() => setActiveTab('followers')}
                                    className={getTabClass('followers')}
                                    style={activeTab === 'followers' ? { backgroundColor: accentColor } : {}}
                                >
                                    Followers ({listData.length})
                                </motion.button>
                            </div>
                        </div>

                        {/* Content Panel (Scrollable Area) */}
                        <div className="flex-grow overflow-y-auto p-5 space-y-4">
                            {activeTab === 'search' && <div className="relative mb-6 mt-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search accounts to follow..."
                                    className="w-full pl-9 pr-3 py-2 bg-background border border-border-color rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent text-text-primary"
                                    onChange={onSearchChange}
                                />
                            </div>}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    {displayData.length > 0 ? (
                                        displayData.map(user => (
                                            <ProfileCard
                                                key={user.id}
                                                user={user}
                                                type={activeTab}
                                                accentColor={accentColor}
                                                onFollow={onFollow}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-center text-text-secondary py-10 text-md">No users found.</p>
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


// Work/Professional Info Display
const ProfessionalSection = ({ profile, icon: Icon }) => (
    <div className="pb-4 border-b border-border-color/70">
        <div className="flex items-center space-x-2 mb-3">
            <Icon size={18} className="text-text-secondary opacity-90" />
            <span className="text-sm font-semibold text-text-primary">Professional Context</span>
        </div>
        <div className="pl-6">
            <h3 className="text-xl font-bold text-text-primary mb-0.5">{profile.profession || 'Role Not Set'}</h3>
            <p className="text-sm text-text-secondary">at {profile.company || 'Company Not Set'}</p>
        </div>
    </div>
);

// Email/Contact Info Display - REDESIGNED and SIMPLIFIED
const ContactSection = ({ profile, accentColor }) => (
    <div className="pt-4 pb-4 border-b border-border-color/70">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Email Address</h3>
        <div className="flex items-center space-x-4 pl-6">
            <Mail size={16} className="text-text-secondary" />
            <a href={`mailto:${profile.email}`}
                className="text-base font-semibold hover:underline transition-colors"
                style={{ color: accentColor }}
            >
                {profile.email || 'Email Not Set'}
            </a>
        </div>
    </div>
);

// Social Links Display
const SocialSection = ({ socials, accentColor }) => {
    const SocialLink = ({ icon: Icon, username, baseLink }) => {
        if (!username) return null;
        return (
            <a
                href={baseLink + username}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-200 group"
            >
                {/* FIX: Uniform Icon Size */}
                <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" style={{ color: accentColor }} />
                <span className="text-sm font-medium hover:underline text-text-secondary group-hover:text-text-primary">
                    @{username}
                </span>
            </a>
        );
    };

    return (
        <div className="pt-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Social Links</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <SocialLink icon={Github} username={socials?.github} baseLink="https://github.com/" />
                <SocialLink icon={Linkedin} username={socials?.linkedin} baseLink="https://linkedin.com/in/" />
                <SocialLink icon={Twitter} username={socials?.twitter} baseLink="https://twitter.com/" />
            </div>
        </div>
    );
};


export default function ProfilePanel({ onEditProfileClick }) {
    const { profile, accentColor } = useSettingsStore((state) => ({
        profile: state.profile,
        accentColor: state.accentColor,
    }));


    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowListModalOpen, setIsFollowListModalOpen] = useState(false);
    const [currentListType, setCurrentListType] = useState('followers');
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const fetchCounts = useCallback(async () => {
        if (profile.username) {
            try {
                const response = await axios.get(`/api/collaboration/${profile.username}/counts`);
                setFollowerCount(response.data.followers);
                setFollowingCount(response.data.following);
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        }
    }, [profile.username]);

    useEffect(() => {
        fetchCounts();
    }, [fetchCounts]);


    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        if (query.length > 0) {
            // FIX: Corrected the API endpoint
            const response = await fetch(`/api/collaboration/search?query=${query}`);
            if (response.ok) {
                const users = await response.json();
                setSearchResults(users.filter(user => user.username !== profile.username));
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleFollow = async (followedUsername) => {
        if (!profile.username) {
            toast.error("You must be logged in to follow users.");
            return;
        }

        try {
            await axios.post('/api/collaboration/follow', { followerUsername: profile.username, followedUsername });
            toast.success(`You are now following ${followedUsername}!`);
            fetchCounts();
        } catch (error) {
            const errorText = await error.response.data;
            toast.error(`Failed to follow user: ${errorText}`);
        }
    };

    const handleUnfollow = async (followedUsername) => {
        if (!profile.username) {
            toast.error("You must be logged in to unfollow users.");
            return;
        }

        try {
            await axios.post('/api/collaboration/unfollow', { followerUsername: profile.username, followedUsername });
            toast.success(`You have unfollowed ${followedUsername}!`);
            fetchCounts();
        } catch (error) {
            const errorText = await error.response.data;
            toast.error(`Failed to unfollow user: ${errorText}`);
        }
    };


    // Handlers for opening the new Follower/Following Window - FIXED
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
                {/* Profile Card - Network Hub */}
                <div className="p-6 bg-card-background rounded-xl shadow-lg mb-6">

                    {/* AVATAR HERO BLOCK */}
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
                        {/* Bio with correct spacing */}
                        <p className="text-sm text-text-primary break-words mb-4">{profile.bio || 'Your bio goes here.'}</p>
                    </div>

                    {/* --- SEARCH BAR (FIXED POSITIONING) --- */}
                    <div className="relative mb-6 mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search accounts to follow..."
                            className="w-full pl-9 pr-3 py-2 bg-background border border-border-color rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent text-text-primary"
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* --- FOLLOW / FOLLOWING METRICS (FIXED LOGIC) --- */}
                    <div className="flex justify-center items-center my-4 py-3">

                        {/* Followers Button/Text - Clicks trigger onViewNetworkClick */}
                        <button
                            onClick={() => onViewNetworkClick('followers')}
                            className="group flex items-baseline hover:text-accent transition-colors focus:outline-none"
                        >
                            <span className="text-lg font-extrabold text-text-primary group-hover:text-accent transition-colors mr-1">
                                {followerCount}
                            </span>
                            <span className="text-sm text-text-secondary font-medium group-hover:text-accent transition-colors">
                                Followers
                            </span>
                        </button>

                        <span className="text-text-secondary text-base font-light mx-2">·</span>

                        {/* Following Button/Text - Clicks trigger onViewNetworkClick */}
                        <button
                            onClick={() => onViewNetworkClick('following')}
                            className="group flex items-baseline hover:text-accent transition-colors focus:outline-none"
                        >
                            <span className="text-lg font-extrabold text-text-primary group-hover:text-accent transition-colors mr-1">
                                {followingCount}
                            </span>
                            <span className="text-sm text-text-secondary font-medium group-hover:text-accent transition-colors">
                                Following
                            </span>
                        </button>

                    </div>

                    {/* FOLLOW BUTTON */}
                    <div className="flex space-x-3 mt-6">
                        <motion.button
                            onClick={() => setIsFollowListModalOpen(true)}
                            className={`flex-grow py-2 px-4 font-semibold rounded-lg transition-colors duration-200 ${followButtonClasses}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="flex items-center justify-center space-x-2">
                                <UserPlus size={18} /> <span>Follow</span>
                            </span>
                        </motion.button>

                        <button
                            className="p-2.5 rounded-lg border border-border-color text-text-secondary hover:bg-hover-color transition-colors"
                            onClick={() => console.log('Share Profile')}
                        >
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                {/* DETAILS SECTION - REDESIGNED */}
                <div className="p-6 bg-card-background rounded-xl shadow-lg">

                    {/* Section 1: Professional / Company Info */}
                    <ProfessionalSection
                        icon={Briefcase}
                        profile={profile}
                    />

                    {/* Section 2: Email Info (Simplified) */}
                    <ContactSection
                        profile={profile}
                        accentColor={accentColor}
                    />

                    {/* Section 3: Social Links */}
                    <SocialSection
                        socials={profile.socials}
                        accentColor={accentColor}
                    />

                </div>
            </motion.div>

            {/* RENDER THE ISOLATED FOLLOW LIST WINDOW */}
            <FollowListModal
                isOpen={isFollowListModalOpen}
                onClose={() => setIsFollowListModalOpen(false)}
                initialTab={currentListType}
                accentColor={accentColor}
                searchResults={searchResults}
                onSearchChange={handleSearchChange}
                onFollow={handleFollow}
                username={profile.username}
            />
        </React.Fragment>
    );
}