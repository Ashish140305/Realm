import React from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import useSettingsStore from '../../store/useSettingsStore';

export default function ProfileEditorModal({ isOpen, onClose }) {
  const { profile, updateProfile, setAvatar, removeAvatar } = useSettingsStore();
  const { register, handleSubmit, watch } = useForm({ defaultValues: profile });
  const currentAvatar = watch('avatar');

  const onDrop = React.useCallback(files => {
    const reader = new FileReader();
    reader.onload = (e) => setAvatar(e.target.result);
    reader.readAsDataURL(files[0]);
  }, [setAvatar]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const onSubmit = (data) => {
    updateProfile(data);
    toast.success("Profile updated!");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="bg-gray-dark border border-border-color rounded-lg shadow-2xl w-full max-w-2xl" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center justify-between p-4 border-b border-border-color"><h3 className="text-lg font-semibold text-text-primary">Edit Profile</h3><button type="button" onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-gray-light transition"><X size={20} /></button></div>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    {currentAvatar ? <img src={currentAvatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" /> : <div className="w-20 h-20 rounded-full bg-gray-light border border-border-color flex items-center justify-center text-center text-xs text-text-secondary p-2">Add Profile Image</div>}
                    <div {...getRootProps()} className={`flex-1 flex justify-center items-center px-6 py-4 border-2 border-dashed rounded-md cursor-pointer transition ${isDragActive ? 'border-accent bg-accent/10' : 'border-border-color hover:border-gray-text'}`}><input {...getInputProps()} /><div className="text-center"><UploadCloud className="mx-auto h-8 w-8 text-text-secondary" /><p className="text-xs text-text-secondary">Click or drag to upload</p></div></div>
                    {currentAvatar && <button type="button" onClick={() => removeAvatar()} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition"><Trash2 size={18} /></button>}
                  </div>
                </div>
                <div><label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Name</label><input id="name" {...register('name')} className="w-full bg-gray-dark border border-border-color rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" /></div>
                <div><label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email</label><input id="email" type="email" {...register('email')} className="w-full bg-gray-dark border border-border-color rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" /></div>
                <div><label htmlFor="bio" className="block text-sm font-medium text-text-secondary mb-1">Bio</label><textarea id="bio" {...register('bio')} rows="3" className="w-full bg-gray-dark border border-border-color rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"></textarea></div>
                <div className="space-y-2"><label className="block text-sm font-medium text-text-secondary">Social Links</label><input {...register('socials.github')} placeholder="GitHub username" className="w-full bg-gray-dark border border-border-color rounded-md px-3 py-2 text-sm" /><input {...register('socials.linkedin')} placeholder="LinkedIn username" className="w-full bg-gray-dark border border-border-color rounded-md px-3 py-2 text-sm" /><input {...register('socials.twitter')} placeholder="Twitter handle" className="w-full bg-gray-dark border border-border-color rounded-md px-3 py-2 text-sm" /></div>
              </div>
              <div className="flex justify-end gap-3 p-4 bg-gray-medium/30 border-t border-border-color rounded-b-lg"><button type="button" className="px-4 py-2 text-sm font-medium bg-transparent border border-border-color rounded-md hover:border-gray-text transition" onClick={onClose}>Cancel</button><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition">Save Changes</button></div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}