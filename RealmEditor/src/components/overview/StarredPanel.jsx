import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';

const allProjects = [
  { name: 'RealmEditor-Frontend', description: 'The React frontend for our collaborative editor.' },
  { name: 'Spring-API-Backend', description: 'Java Spring Boot backend for user and version management.' },
  { name: 'Socket-Server-Node', description: 'Real-time WebSocket server using Node.js and Socket.io.' },
];

export default function StarredPanel() {
  const { starredProjects } = useSettingsStore();
  const starredItems = allProjects.filter(p => starredProjects.includes(p.name));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-semibold text-text-primary mb-4">Starred Projects</h2>
      {starredItems.length > 0 ? (
        <div className="border-t border-border-color">
          {starredItems.map((project) => (
            <div key={project.name} className="flex items-center justify-between py-4 border-b border-border-color">
              <div>
                <a href="#" className="font-semibold text-accent hover:underline">{project.name}</a>
                <p className="text-sm text-text-secondary mt-1">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border-color rounded-lg">
          <Star className="mx-auto text-text-secondary" size={32} />
          <h3 className="mt-2 text-sm font-semibold text-text-primary">No starred projects</h3>
          <p className="mt-1 text-sm text-text-secondary">Star projects to have them appear here.</p>
        </div>
      )}
    </motion.div>
  );
}