import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectsPanel from './ProjectsPanel';
import RepositoriesPanel from './RepositoriesPanel';
import StarredPanel from './StarredPanel';

const TABS = ['Projects', 'Repositories', 'Starred'];

export default function MainContent() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
    >
      <div className="flex justify-between items-center border-b border-border-color mb-6">
        <nav className="flex gap-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${activeTab === tab ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'} relative py-2 px-1 text-sm font-medium transition-colors`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-accent"
                  layoutId="active-tab-underline"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'Projects' && <ProjectsPanel />}
          {activeTab === 'Repositories' && <RepositoriesPanel />}
          {activeTab === 'Starred' && <StarredPanel />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}