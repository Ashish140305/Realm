import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import { allProjects } from '../../data/mockData';

// Helper to get language color
const getLanguageColor = (language) => {
    const colors = {
        'JavaScript': 'bg-yellow-400',
        'Java': 'bg-orange-500',
        'TypeScript': 'bg-blue-500',
        'Markdown': 'bg-gray-400',
    };
    return colors[language] || 'bg-gray-500';
}

const ProjectCard = ({ project, isStarred, onToggleStar }) => {
    return (
        <motion.div
            className="bg-card-background p-5 rounded-xl border border-border-color shadow-sm hover:shadow-lg hover:border-accent transition-all duration-300 flex flex-col justify-between"
            whileHover={{ y: -5 }}
        >
            <div>
                <div className="flex justify-between items-start mb-2">
                    <a href="#" className="font-bold text-lg text-accent hover:underline">{project.name}</a>
                    <button
                        onClick={() => onToggleStar(project.name)}
                        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
                        title={isStarred ? "Unstar" : "Star"}
                    >
                        <Star size={16} className={`${isStarred ? 'text-yellow-400 fill-current' : 'text-text-secondary'}`} />
                        <span>{project.stars}</span>
                    </button>
                </div>
                <p className="text-sm text-text-secondary mb-4">{project.description}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span className={`w-3 h-3 rounded-full ${getLanguageColor(project.language)}`} />
                <span>{project.language}</span>
            </div>
        </motion.div>
    );
};


export default function ProjectsPanel() {
  // CORRECTED: Switched from 'starredProjects' to the new 'starredItems'
  const { starredItems, toggleStarred } = useSettingsStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Projects</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-accent text-white rounded-lg hover:bg-accent/90 transition-transform duration-200 ease-in-out transform hover:scale-105">
          <Plus size={16} />
          New Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allProjects.map((project, index) => (
          <ProjectCard
            key={project.name}
            project={project}
            // CORRECTED: Check against the new 'starredItems' array
            isStarred={starredItems.includes(project.name)}
            onToggleStar={toggleStarred}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}