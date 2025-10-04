import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';

// --- UPDATED: InfoRow Component with better typography ---
const InfoRow = ({ icon, label, value, link }) => {
  const content = link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent hover:underline break-words">
      {value}
    </a>
  ) : (
    <span className="text-sm font-medium text-text-primary break-words">{value}</span>
  );

  return (
    <div className="py-3 border-b border-border-color last:border-b-0">
      <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center mb-1">
        {label}
      </div>
      <div className="flex items-center">
        <div className="text-text-secondary mr-3">{icon}</div>
        <div>{content}</div>
      </div>
    </div>
  );
};

// --- UPDATED: WorkInfo Component with better typography ---
const WorkInfo = ({ icon, profession, company }) => {
  return (
    <div className="py-3 border-b border-border-color last:border-b-0">
      <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center mb-1">
        Work
      </div>
      <div className="flex items-center">
        <div className="text-text-secondary mr-3">{icon}</div>
        <div>
          <h3 className="text-sm font-medium text-text-primary">{profession || 'Profession not set'}</h3>
          <p className="text-xs text-text-secondary">at {company || 'Company not set'}</p>
        </div>
      </div>
    </div>
  );
};


export default function ProfilePanel({ onEditProfileClick }) {
  const profile = useSettingsStore((state) => state.profile);

  return (
    <motion.div
      className="sticky top-24"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Profile Card (No changes here) */}
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

      {/* --- UPDATED: Info Section with improved lettering --- */}
      <div className="p-6 bg-card-background rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-2 text-text-primary">Details</h2>
        <div>
          <WorkInfo 
            icon={<Briefcase size={18} />} 
            profession={profile.profession}
            company={profile.company}
          />
          <InfoRow 
            icon={<Mail size={16} />} 
            label="Email" 
            value={profile.email || 'Not set'} 
            link={`mailto:${profile.email}`} 
          />
          <InfoRow 
            icon={<Github size={16} />} 
            label="GitHub" 
            value={profile.socials?.github || 'Not set'} 
            link={profile.socials?.github ? `https://github.com/${profile.socials.github}` : null} 
          />
          <InfoRow 
            icon={<Linkedin size={16} />} 
            label="LinkedIn" 
            value={profile.socials?.linkedin || 'Not set'} 
            link={profile.socials?.linkedin ? `https://linkedin.com/in/${profile.socials.linkedin}`: null} 
          />
           <InfoRow 
            icon={<Twitter size={16} />} 
            label="Twitter" 
            value={profile.socials?.twitter || 'Not set'} 
            link={profile.socials?.twitter ? `https://twitter.com/${profile.socials.twitter}`: null} 
          />
        </div>
      </div>
    </motion.div>
  );
}