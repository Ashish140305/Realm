import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import { toast } from 'react-toastify';

const projects = [
  { name: 'RealmEditor-Frontend', description: 'The React frontend for our collaborative editor.' },
  { name: 'Spring-API-Backend', description: 'Java Spring Boot backend for user and version management.' },
];

export default function ProjectsPanel() {
  const { starredProjects, toggleStarredProject } = useSettingsStore();

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-end">
        <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition flex items-center gap-2"><Plus size={16} /> New Project</button>
      </div>
      <div className="border-t border-border-color">
        {projects.map((project) => {
          const isStarred = starredProjects.includes(project.name);
          return (
            <div key={project.name} className="flex items-center justify-between py-4 border-b border-border-color">
              <div>
                <a href="#" className="font-semibold text-accent hover:underline">{project.name}</a>
                <p className="text-sm text-text-secondary mt-1">{project.description}</p>
              </div>
              <button
                onClick={() => {
                  toggleStarredProject(project.name);
                  toast.info(isStarred ? `Unstarred "${project.name}"` : `Starred "${project.name}"`);
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition border flex items-center gap-2 ${isStarred ? 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10' : 'text-text-secondary border-border-color hover:border-gray-text'}`}
              >
                <Star size={14} className={isStarred ? 'fill-yellow-400 text-yellow-400' : ''} /> Star
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}