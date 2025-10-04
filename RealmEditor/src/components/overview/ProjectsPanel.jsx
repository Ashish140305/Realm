import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';

// Mock data, replace with your actual project data
const projects = [
  { name: 'RealmEditor-Frontend', language: 'JavaScript', description: 'The React frontend for our collaborative editor.', stars: 12 },
  { name: 'Spring-API-Backend', language: 'Java', description: 'Java Spring Boot backend for user and version management.', stars: 8 },
];

export default function ProjectsPanel() {
  const { starredProjects, toggleStarred } = useSettingsStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Projects</h2>
        <button className="flex items-center gap-2 px-3 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent/80 transition">
          <Plus size={16} />
          New Project
        </button>
      </div>
      <div className="border-t border-border-color">
        {projects.map(project => (
          <div key={project.name} className="flex items-center justify-between py-4 border-b border-border-color">
            <div>
              <a href="#" className="font-semibold text-accent hover:underline">{project.name}</a>
              <p className="text-sm text-text-secondary mt-1">{project.description}</p>
            </div>
            <button
              onClick={() => toggleStarred(project.name)}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition"
            >
              <Star size={16} className={starredProjects.includes(project.name) ? 'text-yellow-400 fill-current' : ''} />
              <span>{project.stars}</span>
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}