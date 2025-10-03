import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Github, Linkedin, Twitter, Mail, Image as ImageIcon } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';

export default function ProfilePanel({ onEditProfileClick }) {
  const profile = useSettingsStore((state) => state.profile);

  return (
    <motion.div
      className="sticky top-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="relative mb-4">
        {profile.avatar ? (
          <img src={profile.avatar} alt="User Avatar" className="w-full aspect-square rounded-full object-cover border-2 border-border-color" />
        ) : (
          <div onClick={onEditProfileClick} className="w-full aspect-square rounded-full border-2 border-dashed border-border-color bg-bg-secondary flex flex-col items-center justify-center text-text-secondary cursor-pointer hover:border-accent hover:text-accent transition-colors">
            <ImageIcon size={32} />
            <span className="text-xs mt-2 font-semibold">Add Image</span>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold text-text-primary">{profile.name}</h1>
      <p className="text-lg text-text-secondary mb-4">@{profile.username}</p>
      <p className="text-md text-text-primary mb-4">{profile.bio}</p>

      <button onClick={onEditProfileClick} className="w-full py-2 px-4 bg-bg-secondary border border-border-color rounded-lg text-sm font-medium text-text-primary hover:border-accent transition-colors">
        Edit Profile
      </button>

      <div className="mt-6 pt-6 border-t border-border-color space-y-3 text-sm">
        <div className="flex items-center gap-3 text-text-primary">
          <Briefcase size={16} className="text-text-secondary" />
          <span>{profile.profession} at <strong>{profile.company}</strong></span>
        </div>
        <div className="flex items-center gap-3 text-text-primary">
          <Mail size={16} className="text-text-secondary" />
          <a href={`mailto:${profile.email}`} className="hover:text-accent transition-colors">{profile.email}</a>
        </div>
        
        {/* FIX: Social media links are now a vertical list with names next to logos */}
        <div className="space-y-2 pt-2">
          {profile.socials?.github && (
            <a href={`https://github.com/${profile.socials.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text-primary hover:text-accent transition-colors" aria-label="GitHub Profile">
              <Github size={16} className="text-text-secondary" />
              <span>{profile.socials.github}</span>
            </a>
          )}
          {profile.socials?.linkedin && (
            <a href={`https://linkedin.com/in/${profile.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text-primary hover:text-accent transition-colors" aria-label="LinkedIn Profile">
              <Linkedin size={16} className="text-text-secondary" />
              <span>{profile.socials.linkedin}</span>
            </a>
          )}
          {profile.socials?.twitter && (
            <a href={`https://twitter.com/${profile.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text-primary hover:text-accent transition-colors" aria-label="Twitter Profile">
              <Twitter size={16} className="text-text-secondary" />
              <span>{profile.socials.twitter}</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}