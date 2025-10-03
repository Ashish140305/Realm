import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Github, Linkedin, Twitter, Mail, Image as ImageIcon } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ProfilePanel({ onEditProfileClick }) {
  const profile = useSettingsStore((state) => state.profile);
  const container = React.useRef();

  // GSAP Animation for the profile panel
  useGSAP(() => {
    gsap.from(container.current, {
      duration: 0.8,
      opacity: 0,
      x: -50,
      ease: 'power3.out',
      delay: 0.2
    });
  }, { scope: container });


  return (
    <motion.div ref={container} className="sticky top-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <div className="relative group mb-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-25 group-hover:opacity-50 transition duration-500" />
        {profile.avatar ? (
          <img src={profile.avatar} alt="User Avatar" className="relative w-full aspect-square rounded-full border-2 border-border-color object-cover" />
        ) : (
          <div onClick={onEditProfileClick} className="relative w-full aspect-square rounded-full border-2 border-dashed border-border-color bg-gray-light flex flex-col items-center justify-center text-text-secondary cursor-pointer hover:border-accent hover:text-accent transition">
            <ImageIcon size={32} /><span className="text-xs mt-2 font-semibold">Add Profile Image</span>
          </div>
        )}
      </div>
      {/* The h1 now correctly displays the user's name from the profile object. */}
      <h1 className="text-2xl font-bold text-text-primary">{profile.name}</h1>
      {/* I've replaced the hardcoded user ID with the dynamic username from your store. */}
      <p className="text-xl text-text-secondary mb-4">@{profile.username}</p>
      <p className="text-text-primary mb-4">{profile.bio}</p>
      <motion.button className="w-full bg-gray-light border border-border-color rounded-md py-2 text-sm font-medium text-text-primary hover:bg-gray-medium hover:border-gray-text transition" onClick={onEditProfileClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Edit Profile</motion.button>
      <div className="flex flex-col gap-3 text-sm text-text-secondary mt-4 border-t border-border-color pt-4">
        <div className="flex items-center gap-2"><Briefcase size={16} /><span>{profile.profession} at <strong>{profile.company}</strong></span></div>
        <div className="flex items-center gap-2"><Mail size={16} /><a href={`mailto:${profile.email}`} className="hover:text-accent transition">{profile.email}</a></div>
        <div className="flex items-center gap-4 mt-2">
          {profile.socials?.github && <a href={`https://github.com/${profile.socials.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent transition"><Github size={16} /><span>GitHub</span></a>}
          {profile.socials?.linkedin && <a href={`https://linkedin.com/in/${profile.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent transition"><Linkedin size={16} /><span>LinkedIn</span></a>}
          {profile.socials?.twitter && <a href={`https://twitter.com/${profile.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent transition"><Twitter size={16} /><span>Twitter</span></a>}
        </div>
      </div>
    </motion.div>
  );
}