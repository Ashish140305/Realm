import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';

// Helper component for info cards
const InfoCard = ({ icon, text, isLink }) => (
  <motion.a
    href={isLink || '#'}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center space-x-3 p-3 bg-background rounded-lg transition-colors ${isLink ? 'hover:bg-border-color cursor-pointer' : 'cursor-default'}`}
    whileHover={isLink ? { x: 5 } : {}}
    aria-label={text}
  >
    <div className="text-text-secondary">{icon}</div>
    <span className="text-sm font-medium text-text-primary truncate">{text}</span>
  </motion.a>
);


export default function ProfilePanel({ onEditProfileClick }) {
  const profile = useSettingsStore((state) => state.profile);

  return (
    <motion.div
      className="sticky top-24"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Profile Card */}
      <div className="p-6 bg-card-background rounded-xl shadow-lg mb-6">
        <div className="relative group w-32 h-32 mx-auto mb-4">
          <img
            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
            alt="Profile Avatar"
            className="w-full h-full rounded-full object-cover border-4 border-border-color group-hover:border-accent transition-all duration-300"
          />
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300 cursor-pointer" onClick={onEditProfileClick}>
            <p className="text-white opacity-0 group-hover:opacity-100 font-semibold">Edit</p>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary truncate">{profile.name || 'Your Name'}</h1>
          <p className="text-md text-text-secondary mb-4">@{profile.username || 'username'}</p>
          <p className="text-sm text-text-primary break-words">{profile.bio || 'Your bio goes here.'}</p>
        </div>

        <motion.button
          onClick={onEditProfileClick}
          className="w-full mt-6 py-2 px-4 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent-hover transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Edit Profile
        </motion.button>
      </div>

      {/* Info Card */}
      <div className="p-6 bg-card-background rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-text-primary">Info</h2>
        <div className="space-y-4">
          <InfoCard icon={<Briefcase size={18} />} text={`${profile.profession || 'Profession'} at ${profile.company || 'Company'}`} />
          <InfoCard icon={<Mail size={18} />} text={profile.email || 'your-email@example.com'} isLink={`mailto:${profile.email}`} />
          <InfoCard icon={<Github size={18} />} text={profile.socials?.github || 'github-username'} isLink={profile.socials?.github ? `https://github.com/${profile.socials.github}` : null} />
          <InfoCard icon={<Linkedin size={18} />} text={profile.socials?.linkedin || 'linkedin-profile'} isLink={profile.socials?.linkedin ? `https://linkedin.com/in/${profile.socials.linkedin}`: null} />
          <InfoCard icon={<Twitter size={18} />} text={profile.socials?.twitter || 'twitter-handle'} isLink={profile.socials?.twitter ? `https://twitter.com/${profile.socials.twitter}`: null} />
        </div>
      </div>
    </motion.div>
  );
}