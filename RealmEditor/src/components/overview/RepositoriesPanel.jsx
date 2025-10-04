import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileJson, FileCode2, FileText, Star } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import { recentFiles } from '../../data/mockData'; // Import from central file

const getFileIcon = (fileName) => {
    if (fileName.endsWith('.jsx')) return <FileCode2 className="text-blue-400" size={20} />;
    if (fileName.endsWith('.java')) return <FileCode2 className="text-orange-400" size={20} />;
    if (fileName.endsWith('.js')) return <FileJson className="text-yellow-400" size={20} />;
    if (fileName.endsWith('.css')) return <FileText className="text-pink-400" size={20} />;
    return <FileCode2 className="text-text-secondary" size={20} />;
};

const FileItem = ({ file, index, isStarred, onToggleStar }) => {
    const fileId = `${file.project}/${file.name}`; // Create a unique ID for the file

    return (
        <motion.div
            className="group flex items-center justify-between p-4 border-b border-border-color last:border-b-0 hover:bg-background/80 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <div className="flex items-center gap-4 truncate">
                {getFileIcon(file.name)}
                <div className="truncate">
                    <p className="font-mono text-sm text-text-primary truncate">
                        <a href="#" className="hover:underline"><span className="text-text-secondary">{file.project}/</span>{file.name}</a>
                    </p>
                    <p className="text-xs text-text-secondary">
                        branch: <span className="text-accent">{file.branch}</span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
                <p className="text-sm text-text-secondary hidden md:block">{file.lastSaved}</p>
                <button onClick={() => onToggleStar(fileId)} title={isStarred ? "Unstar" : "Star"}>
                    <Star size={16} className={`${isStarred ? 'text-yellow-400 fill-current' : 'text-text-secondary'} transition-colors group-hover:text-yellow-400`} />
                </button>
                <a href="#">
                  <ArrowRight size={18} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
            </div>
        </motion.div>
    );
};

export default function RepositoriesPanel() {
  const { starredItems, toggleStarred } = useSettingsStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-text-primary">Recent Files</h2>
        <input 
          type="text" 
          placeholder="Find a file..." 
          className="px-3 py-2 bg-background border border-border-color rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div className="border border-border-color rounded-lg overflow-hidden">
        {recentFiles.map((file, index) => (
          <FileItem 
            key={index} 
            file={file} 
            index={index}
            isStarred={starredItems.includes(`${file.project}/${file.name}`)}
            onToggleStar={toggleStarred}
          />
        ))}
      </div>
    </motion.div>
  );
}