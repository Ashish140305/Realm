import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, UserPlus, Search } from 'lucide-react';

const ActionButton = ({ icon, text }) => (
    <motion.button 
        className="w-full flex items-center p-3 bg-background rounded-lg text-sm font-medium text-text-primary hover:bg-border-color transition-colors"
        whileHover={{ x: 5 }}
    >
        {icon}
        <span className="ml-3">{text}</span>
    </motion.button>
);

const QuickActionsPanel = () => {
    return (
        <div className="bg-card-background p-4 rounded-xl shadow-lg">
            <h3 className="text-md font-semibold text-text-primary mb-4">
                Quick Actions
            </h3>
            <div className="space-y-2">
                <ActionButton icon={<PlusCircle size={18} className="text-accent" />} text="Create New Project" />
                <ActionButton icon={<UserPlus size={18} className="text-accent" />} text="Invite a Teammate" />
                <ActionButton icon={<Search size={18} className="text-accent" />} text="Open Command Palette" />
            </div>
        </div>
    );
};

export default QuickActionsPanel;