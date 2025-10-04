import React from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { inboxItemsData } from './InboxDrawer'; // Import data from the drawer
import useSettingsStore from '../../store/useSettingsStore';

const PreviewItem = ({ item }) => {
    const isTask = item.type === 'TASK';
    return (
        <div className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-white/5">
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${isTask ? 'bg-orange-400/10' : 'bg-green-500/10'}`}>
                {isTask ? (
                    <CheckCircle size={14} className="text-orange-400" />
                ) : (
                    <GitPullRequest size={14} className="text-green-500" />
                )}
            </div>
            <div className="flex-grow truncate">
                <p className="font-semibold text-sm text-text-primary leading-tight truncate">{item.text || item.title}</p>
            </div>
        </div>
    );
};

export default function InboxPreviewPanel({ onOpenDrawer, index }) {
  const unreadItems = inboxItemsData.filter(item => !item.read);
  const itemsToShow = unreadItems.slice(0, 2);
  const accentColor = useSettingsStore(state => state.accentColor);

  return (
    <motion.div
        className="group relative bg-card-background p-5 rounded-xl border border-border-color shadow-sm flex flex-col justify-between text-left h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + index * 0.1 }}
        whileHover={{ y: -2 }}
    >
        <div 
            className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[var(--accent-color)] transition-colors duration-300 pointer-events-none"
            style={{ '--accent-color': accentColor }}
        ></div>

        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-text-primary">Inbox</h3>
                {unreadItems.length > 0 && (
                    <div className="text-xs font-bold text-white bg-accent rounded-full px-2 py-0.5">
                        {unreadItems.length} New
                    </div>
                )}
            </div>

            {itemsToShow.length > 0 ? (
                <div className="space-y-2">
                    {itemsToShow.map(item => (
                        <PreviewItem key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-sm text-text-secondary py-3">
                    <Mail size={24} className="mx-auto mb-1" />
                    All caught up!
                </div>
            )}
        </div>
        
        <button 
            onClick={onOpenDrawer} 
            className="w-full text-center text-sm font-semibold text-accent hover:underline mt-4 pt-4 border-t border-border-color flex items-center justify-center gap-2"
        >
            <span>View All</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
    </motion.div>
  );
}