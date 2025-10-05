import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useState } from 'react';

const FloatingLabelInput = ({ label, name, value, onChange, type = 'text' }) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder=" "
      className="block w-full px-3 py-2 bg-[var(--background-color)] border border-[var(--border-color)] rounded-md peer focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
    />
    <label
      className="absolute text-sm text-[var(--secondary-text-color)] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--background-color)] px-2 peer-focus:px-2 peer-focus:text-[var(--accent-color)] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
    >
      {label}
    </label>
  </div>
);

export default function ProfileEditorModal({ isVisible, onClose }) {
  const { profile, updateProfile, accentColor } = useSettingsStore();
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile, isVisible]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        setFormData((prev) => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    multiple: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    updateProfile(formData);
    toast.success("Profile updated successfully!");
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-2xl bg-[var(--card-background-color)] rounded-xl shadow-2xl overflow-hidden border border-[var(--border-color)]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--primary-text-color)]">Edit Profile</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--border-color)] transition-colors">
                <X size={20} className="text-[var(--secondary-text-color)]" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center space-x-6">
                <img src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}`} alt="Avatar Preview" className="w-20 h-20 rounded-full object-cover" />
                <div {...getRootProps()} className="flex-1 w-full h-20 border-2 border-dashed border-[var(--border-color)] rounded-lg flex flex-col items-center justify-center text-[var(--secondary-text-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors cursor-pointer">
                  <input {...getInputProps()} />
                  <UploadCloud size={24} />
                  <span className="text-xs mt-1">Drop image or click to upload</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingLabelInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} />
                <FloatingLabelInput label="Username" name="username" value={formData.username} onChange={handleInputChange} />
                <FloatingLabelInput label="Profession" name="profession" value={formData.profession} onChange={handleInputChange} />
                <FloatingLabelInput label="Company" name="company" value={formData.company} onChange={handleInputChange} />
                <FloatingLabelInput label="Email" name="email" value={formData.email} onChange={handleInputChange} type="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--secondary-text-color)] mb-1 block">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 bg-[var(--background-color)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                ></textarea>
              </div>
              <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-[var(--primary-text-color)] pt-2 border-t border-[var(--border-color)]">Socials</h3>
                 <FloatingLabelInput label="GitHub Username" name="socials.github" value={formData.socials?.github} onChange={handleInputChange} />
                 <FloatingLabelInput label="LinkedIn Profile" name="socials.linkedin" value={formData.socials?.linkedin} onChange={handleInputChange} />
                 <FloatingLabelInput label="Twitter Handle" name="socials.twitter" value={formData.socials?.twitter} onChange={handleInputChange} />
              </div>
            </div>

            <div className="p-6 bg-[var(--background-color)] flex justify-end space-x-4">
              <motion.button onClick={onClose} className="py-2 px-5 border border-[var(--border-color)] text-[var(--primary-text-color)] font-semibold rounded-lg hover:bg-[var(--border-color)] transition-colors" whileHover={{ scale: 1.05 }}>
                Cancel
              </motion.button>
              <motion.button onClick={handleSave} className="py-2 px-5 text-white font-semibold rounded-lg shadow-lg transition-colors" style={{ backgroundColor: accentColor }} whileHover={{ scale: 1.05 }}>
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}