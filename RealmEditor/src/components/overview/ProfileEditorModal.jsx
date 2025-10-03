import React from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import useSettingsStore from '../../store/useSettingsStore';

export default function ProfileEditorModal({ isOpen, onClose }) {
  const { profile, updateProfile, setAvatar, removeAvatar } = useSettingsStore();
  const { register, handleSubmit, watch, setValue } = useForm({ defaultValues: profile });
  const currentAvatar = watch('avatar');

  const onDrop = React.useCallback(files => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
      setValue('avatar', e.target.result, { shouldDirty: true });
    };
    reader.readAsDataURL(files[0]);
  }, [setAvatar, setValue]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const onSubmit = (data) => {
    updateProfile(data);
    toast.success("Profile updated!");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="bg-bg-secondary border border-border-color rounded-lg shadow-2xl w-full max-w-2xl text-text-primary" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center justify-between p-4 border-b border-border-color"><h3 className="text-lg font-semibold">Edit Profile</h3><button type="button" onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-bg-primary transition"><X size={20} /></button></div>
              <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    {currentAvatar ? <img src={currentAvatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" /> : <div className="w-20 h-20 rounded-full bg-bg-primary border border-border-color" />}
                    <div {...getRootProps()} className="flex-1 px-6 py-4 border-2 border-dashed rounded-md cursor-pointer text-center"><input {...getInputProps()} /><UploadCloud className="mx-auto h-8 w-8 text-text-secondary" /><p className="text-xs text-text-secondary">Click or drag file</p></div>
                    {currentAvatar && <button type="button" onClick={() => { removeAvatar(); setValue('avatar', null); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition"><Trash2 size={18} /></button>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Name</label><input id="name" {...register('name')} className="w-full bg-bg-primary border border-border-color rounded-md px-3 py-2 text-sm" /></div>
                  <div><label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">Username</label><input id="username" {...register('username')} className="w-full bg-bg-primary border border-border-color rounded-md px-3 py-2 text-sm" /></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label htmlFor="profession" className="block text-sm font-medium text-text-secondary mb-1">Profession</label><input id="profession" {...register('profession')} className="w-full bg-bg-primary border border-border-color rounded-md px-3 py-2 text-sm" /></div>
                  <div><label htmlFor="company" className="block text-sm font-medium text-text-secondary mb-1">Company</label><input id="company" {...register('company')} className="w-full bg-bg-primary border border-border-color rounded-md px-3 py-2 text-sm" /></div>
                </div>

                <div><label htmlFor="bio" className="block text-sm font-medium text-text-secondary mb-1">Bio</label><textarea id="bio" {...register('bio')} rows="3" className="w-full bg-bg-primary border border-border-color rounded-md px-3 py-2 text-sm"></textarea></div>

                {/* FIX: Restored Social Links input fields */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Social Links</label>
                    <div className="space-y-2">
                        <input {...register('socials.github')} placeholder="GitHub username" className="w-full bg-bg-primary border border-border-color rounded-md px-3 py-2 text-sm" />
                        <input {...register('socials.linkedin')} placeholder="LinkedIn username" className="w-full bg-bg-primary border border-border-color rounded-md px-3 py-2 text-sm" />
                        <input {...register('socials.twitter')} placeholder="Twitter handle (without @)" className="w-full bg-bg-primary border border-border-color rounded-md px-3 py-2 text-sm" />
                    </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 p-4 bg-bg-primary/50 border-t border-border-color"><button type="button" className="px-4 py-2 text-sm font-medium bg-transparent border border-border-color rounded-md hover:border-gray-text transition" onClick={onClose}>Cancel</button><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-accent border border-transparent rounded-md hover:bg-accent/80 transition">Save Changes</button></div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}