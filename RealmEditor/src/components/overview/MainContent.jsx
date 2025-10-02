import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectsPanel from './ProjectsPanel';
import StarredPanel from './StarredPanel';

const tabs = ['Projects', 'Repositories', 'Starred'];

export default function MainContent({ onSettingsClick }) {
  const [activeTab, setActiveTab] = useState('Projects');
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}>
      <div className="flex justify-between items-center border-b border-border-color mb-6">
        <nav className="-mb-px flex gap-4" aria-label="Tabs">
          {tabs.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`${activeTab === tab ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'} relative px-3 py-2 text-sm font-medium transition-colors`}>{tab}{activeTab === tab && (<motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" layoutId="underline" />)}</button>))}
        </nav>
        <div className="flex items-center gap-2">
            <button title="Go to Editor" onClick={() => navigate('/editor')} className="p-2 rounded-full text-text-secondary hover:bg-gray-light transition"><Code size={18} /></button>
            <button title="Settings" onClick={onSettingsClick} className="p-2 rounded-full text-text-secondary hover:bg-gray-light transition"><Settings size={18} /></button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === 'Projects' && <ProjectsPanel />}
          {activeTab === 'Starred' && <StarredPanel />}
          {/* You can add a RepositoriesPanel component here */}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}