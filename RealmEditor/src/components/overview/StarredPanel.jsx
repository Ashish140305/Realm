import React from 'react';
import { motion } from 'framer-motion';
import { Star, X, FileCode2 } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import { allProjects, recentFiles } from '../../data/mockData';

// --- Re-usable helper functions ---
const getFileIcon = (fileName) => {
    if (fileName.endsWith('.jsx')) return <FileCode2 className="text-blue-400" size={18} />;
    if (fileName.endsWith('.java')) return <FileCode2 className="text-orange-400" size={18} />;
    if (fileName.endsWith('.js')) return <FileCode2 className="text-yellow-400" size={18} />;
    if (fileName.endsWith('.css')) return <FileCode2 className="text-pink-400" size={18} />;
    return <FileCode2 className="text-text-secondary" size={18} />;
};

// --- A single, unified component for any starred item ---
const StarredItem = ({ item, onToggleStar, index }) => {
  const accentColor = useSettingsStore((state) => state.accentColor);
  const isProject = item.type === 'project';
  const itemId = isProject ? item.name : `${item.project}/${item.name}`;

  return (
    <motion.div
      className="group flex items-center justify-between p-4 border-b border-border-color last:border-b-0 transition-colors hover:bg-background/80"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-center gap-4 truncate">
        {/* Use a star for projects and a file icon for files */}
        {isProject ? <Star size={18} style={{ color: accentColor }} className="flex-shrink-0" /> : getFileIcon(item.name)}
        
        <div className="truncate">
          <div className="flex items-center gap-2">
            <a href="#" className="font-semibold text-text-primary hover:underline truncate">
              {isProject ? item.name : `${item.project}/${item.name}`}
            </a>
            
            {/* Differentiator Tag */}
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isProject ? 'bg-accent/20 text-accent' : 'bg-gray-500/20 text-gray-400'}`}>
              {isProject ? 'Project' : 'File'}
            </span>
          </div>
          {isProject && <p className="text-sm text-text-secondary truncate">{item.description}</p>}
        </div>
      </div>

      <button
        onClick={() => onToggleStar(itemId)}
        className="p-1.5 rounded-md text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background hover:text-red-500"
        title="Unstar"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

// --- Main StarredPanel Component ---
export default function StarredPanel() {
  const { starredItems, toggleStarred } = useSettingsStore();
  
  // Map projects and files to a common structure with a 'type' property
  const starredProjects = allProjects
    .filter(p => starredItems.includes(p.name))
    .map(p => ({ ...p, type: 'project' }));
    
  const starredFiles = recentFiles
    .filter(f => starredItems.includes(`${f.project}/${f.name}`))
    .map(f => ({ ...f, type: 'file' }));

  // Combine into a single list
  const allStarredItems = [...starredProjects, ...starredFiles];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-text-primary">Starred Items</h2>
         <input 
          type="text" 
          placeholder="Filter starred items..." 
          className="px-3 py-2 bg-background border border-border-color rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div className="border border-border-color rounded-lg overflow-hidden">
        {allStarredItems.length > 0 ? (
          <div>
            {allStarredItems.map((item, index) => (
              <StarredItem
                key={item.type === 'project' ? item.name : `${item.project}/${item.name}`}
                item={item}
                onToggleStar={toggleStarred}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6">
            <Star className="mx-auto text-yellow-400/50" size={40} />
            <h3 className="mt-4 text-lg font-semibold text-text-primary">No Starred Items</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Star a project or file to keep track of it here.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}