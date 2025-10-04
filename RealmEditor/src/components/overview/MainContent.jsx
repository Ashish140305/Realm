import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import all the necessary panels for the tabs, including the PullRequestsPanel
import DashboardView from './DashboardView';
import ProjectsPanel from './ProjectsPanel';
import RepositoriesPanel from './RepositoriesPanel';
import StarredPanel from './StarredPanel';
import PullRequestsPanel from './PullRequestsPanel'; // Added this import

// The tabs are defined here, with "Pull Requests" added
const TABS = ['Dashboard', 'Projects', 'Repositories', 'Starred', 'Pull Requests'];

export default function MainContent() {
  const [activeTab, setActiveTab] = useState(TABS[0]); // Default to the "Dashboard" tab

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* This is the navigation bar for the tabs */}
      <div className="border-b border-border-color mb-6">
        <nav className="flex gap-4 overflow-x-auto pb-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              } relative py-2 px-1 text-sm font-medium transition-colors whitespace-nowrap`}
            >
              {tab}
              {/* This motion.div creates the animated underline for the active tab */}
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

      {/* This section handles the animated transition between tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Conditional rendering to display the correct panel based on the active tab */}
          {activeTab === 'Dashboard' && <DashboardView />}
          {activeTab === 'Projects' && <ProjectsPanel />}
          {activeTab === 'Repositories' && <RepositoriesPanel />}
          {activeTab === 'Starred' && <StarredPanel />}
          {activeTab === 'Pull Requests' && <PullRequestsPanel />} {/* Added this line */}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}