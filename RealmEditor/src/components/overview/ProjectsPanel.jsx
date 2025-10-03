import React from 'react';
import { motion } from 'framer-motion';
import useSettingsStore from '../../store/useSettingsStore';

// Mock data, replace with your actual project data
const projects = [
  { name: 'RealmEditor-Frontend', language: 'JavaScript' },
  { name: 'Spring-API-Backend', language: 'Java' },
];

export default function ProjectsPanel() {
  const { starredProjects, toggleStarred } = useSettingsStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Projects</h2>
      </div>
      <div className="border-t border-border-color">
        {projects.map(project => (
          <div key={project.name} className="flex items-center justify-between py-4 border-b border-border-color">
            <a href="#" className="font-semibold text-accent hover:underline">{project.name}</a>
          </div>
        ))}
      </div>
    </motion.div>
  );
}