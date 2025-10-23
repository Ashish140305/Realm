// RealmEditor/src/components/overview/CreateProjectModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import { toast } from 'react-toastify';

const FloatingLabelInput = ({ label, name, value, onChange, type = 'text' }) => (
    <div className="relative">
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder=" "
            className="block w-full px-3 py-2 bg-background border border-border-color rounded-md peer focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <label
            className="absolute text-sm text-text-secondary duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-accent peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        >
            {label}
        </label>
    </div>
);

export default function CreateProjectModal({ isVisible, onClose, onProjectCreated }) {
    const { profile } = useSettingsStore();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        language: 'JavaScript',
        // FIX: Changed `userId` to `ownerUsername` to match the backend DTO
        ownerUsername: profile.username
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.name) {
            toast.error("Project name is required.");
            return;
        }
        
        try {
            // FIX: Corrected the API endpoint from '/api/projects' to '/api/projects/create'
            const response = await fetch('/api/projects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Project created successfully!");
                if (onProjectCreated) {
                    onProjectCreated(); // Refresh the project list in OverviewPage
                }
                onClose();
            } else {
                const errorText = await response.text();
                toast.error(`Failed to create project: ${errorText}`);
            }
        } catch (error) {
            console.error("Create project error:", error);
            toast.error("An error occurred. Check the console for details.");
        }
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
                        className="relative w-full max-w-lg bg-card-background rounded-xl shadow-2xl overflow-hidden border border-border-color"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="p-6 border-b border-border-color flex justify-between items-center">
                            <h2 className="text-xl font-bold text-text-primary">Create New Project</h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-border-color transition-colors">
                                <X size={20} className="text-text-secondary" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <FloatingLabelInput label="Project Name" name="name" value={formData.name} onChange={handleInputChange} />
                            <FloatingLabelInput label="Description" name="description" value={formData.description} onChange={handleInputChange} />
                            <div>
                                <label className="text-sm font-medium text-text-secondary mb-1 block">Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    className="w-full p-2 bg-background border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                >
                                    <option>JavaScript</option>
                                    <option>Java</option>
                                    <option>Python</option>
                                    <option>TypeScript</option>
                                    <option>HTML</option>
                                    <option>CSS</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-background flex justify-end space-x-4">
                            <motion.button onClick={onClose} className="py-2 px-5 border border-border-color text-text-primary font-semibold rounded-lg hover:bg-border-color transition-colors" whileHover={{ scale: 1.05 }}>
                                Cancel
                            </motion.button>
                            <motion.button onClick={handleSave} className="py-2 px-5 bg-accent text-white font-semibold rounded-lg shadow-lg hover:bg-accent-hover transition-colors" whileHover={{ scale: 1.05 }}>
                                Create Project
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}