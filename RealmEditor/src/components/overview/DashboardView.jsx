import React from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, CheckCircle, Plus, ArrowRight, Code, FileCode2, Zap, GitCommit, Activity } from 'lucide-react';
import ActivityDashboard from './ActivityDashboard';
import useSettingsStore from '../../store/useSettingsStore';

// --- Consolidated Mock Data for all panels ---
const jumpBackInData = [
  { type: 'PROJECT', name: 'RealmEditor-Frontend', language: 'JavaScript', lastSaved: '3 hours ago' },
  { type: 'FILE', name: 'UserController.java', project: 'Spring-API-Backend', language: 'Java', lastSaved: '55 mins ago' },
];

// --- RESTORED: This data is needed for the InboxPanel component to render correctly ---
const inboxItemsData = [
  { type: 'TASK', id: 1, text: 'Review PR #78: Activity Dashboard UI' },
  { type: 'PR_REVIEW', id: 78, title: 'feat: Implement new Activity Dashboard UI', repo: 'RealmEditor-Frontend' },
  { type: 'TASK', id: 2, text: 'Fix bug in theme state management' },
];

const quickActionsData = [
    { title: 'New Project', description: 'Start a workspace.', icon: Plus, color: 'bg-accent' },
    { title: 'New Task', description: 'Add a to-do item.', icon: CheckCircle, color: 'bg-orange-400' },
];

const activityItemsData = [
  { type: 'COMMIT', id: 'c1', project: 'RealmEditor-Frontend', text: 'refactor: simplify state management', time: '5 hours ago', hash: 'a1b2c3d' },
  { type: 'COMMIT', id: 'c2', project: 'Spring-API-Backend', text: 'feat: add user authentication endpoint', time: '1 day ago', hash: 'e4f5g6h' },
  { type: 'COMMIT', id: 'c3', project: 'Realm-Docs', text: 'docs: update installation guide', time: '2 days ago', hash: 'i7j8k9l' },
];

const statsData = {
  streak: 12,
  topLanguage: 'JavaScript',
  productiveDay: 'Wednesday',
};


// --- Child Components (Restored and Corrected) ---

const JumpBackInCard = ({ item, index }) => {
    const isProject = item.type === 'PROJECT';
    const accentColor = useSettingsStore((state) => state.accentColor);
    
    const getLanguageColor = (language) => {
        switch (language) {
            case 'JavaScript': return 'bg-yellow-400';
            case 'Java': return 'bg-orange-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <motion.a
            href="#"
            className="group relative bg-card-background p-5 rounded-xl border border-border-color shadow-sm flex flex-col justify-between text-left overflow-hidden h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -2 }}
        >
            <div 
                className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[var(--accent-color)] transition-colors duration-300 pointer-events-none"
                style={{ '--accent-color': accentColor }}
            ></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3">
                    {isProject ? <Code size={18} className="text-text-secondary flex-shrink-0" /> : <FileCode2 size={18} className="text-text-secondary flex-shrink-0" />}
                    <span className="font-semibold text-text-primary group-hover:underline cursor-pointer truncate">
                        {item.name}
                    </span>
                </div>
                <p className="text-sm text-text-secondary mt-2 pl-1">
                    {isProject ? `Continue developing your project.` : `Edit this file in the ${item.project} repository.`}
                </p>
            </div>

            <div className="relative z-10 flex items-center gap-6 text-xs text-text-secondary mt-4">
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${getLanguageColor(item.language)}`} />
                    <span>{item.language}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span>Updated {item.lastSaved}</span>
                </div>
            </div>
        </motion.a>
    );
};

const QuickActionCard = ({ action, index, onClick }) => {
    const Icon = action.icon;
    return (
        <motion.button
            onClick={onClick}
            className="bg-card-background p-4 rounded-xl border border-border-color text-left w-full h-full transition-all duration-200 shadow-sm hover:border-accent hover:shadow-lg hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${action.color}`}><Icon size={20} className="text-white" /></div>
                <div>
                    <p className="font-semibold text-text-primary">{action.title}</p>
                    <p className="text-sm text-text-secondary">{action.description}</p>
                </div>
            </div>
        </motion.button>
    );
};

const InboxPanel = ({ items }) => (
    <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Inbox</h2>
        <div className="border border-border-color rounded-lg overflow-hidden">
            {items.map((item, index) => (
                <motion.div
                    key={`${item.type}-${item.id}`}
                    className="p-4 flex items-center gap-3 border-b border-border-color last:border-b-0 hover:bg-background/80"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
                    {item.type === 'TASK' ? <CheckCircle size={16} className="text-orange-400" /> : <GitPullRequest size={16} className="text-green-500" />}
                    <p className="text-sm text-text-primary truncate flex-grow">{item.text || item.title}</p>
                    <a href="#" className="text-xs font-semibold text-text-secondary hover:text-accent flex-shrink-0">View</a>
                </motion.div>
            ))}
        </div>
    </div>
);

const RecentActivityPanel = ({ items }) => (
    <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Recent Activity</h2>
        <div className="relative pl-4">
             <div className="absolute left-6 top-2 h-full border-l-2 border-border-color -translate-x-1/2"></div>
            
            <div className="space-y-6">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="relative flex items-start gap-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                    >
                        <div className="z-10 w-8 h-8 rounded-full bg-background flex items-center justify-center border-2 border-border-color">
                            <GitCommit size={16} className="text-text-secondary" />
                        </div>
                        <div className="pt-1 flex-grow">
                            <p className="font-semibold text-sm text-text-primary leading-tight">{item.text}</p>
                            <p className="text-xs text-text-secondary mt-1">
                                Committed to <span className="font-medium text-text-primary">{item.project}</span> • {item.time}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
);


const MyStatsPanel = ({ stats }) => {
  const accentColor = useSettingsStore((state) => state.accentColor);
  const statsItems = [
    { icon: <Zap size={20} />, label: "Current Streak", value: `${stats.streak} days` },
    { icon: <Code size={20} />, label: "Top Language", value: `${stats.topLanguage}` },
    { icon: <Activity size={20} />, label: "Productive Day", value: stats.productiveDay }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-4">My Stats</h2>
      <div className="bg-card-background rounded-xl border border-border-color p-4">
        <div className="space-y-1">
          {statsItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="group relative flex items-center justify-between p-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ backgroundColor: 'var(--background)' }}
            >
               <div 
                   className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-[var(--accent-color)] transition-all duration-200 pointer-events-none"
                   style={{ '--accent-color': accentColor }}
               ></div>
              <div className="flex items-center gap-3">
                <div style={{ color: accentColor }}>
                  {item.icon}
                </div>
                <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-200">{item.label}</p>
              </div>
              <p className="font-bold text-md text-text-primary">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- The Main, Final Dashboard View ---
export default function DashboardView({ onNewProjectClick }) {
  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ActivityDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Main Content Column (2/3 width) --- */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActionsData.map((action, index) => (
                <QuickActionCard 
                    key={index} 
                    action={action} 
                    index={index} 
                    // This is the crucial fix: attaching the onClick handler
                    onClick={action.title === 'New Project' ? onNewProjectClick : null}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-4">Jump Back In</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jumpBackInData.map((item, index) => (<JumpBackInCard key={index} item={item} index={index} />))}
            </div>
          </div>
           <InboxPanel items={inboxItemsData} />
        </div>

        {/* --- Sidebar Column (1/3 width) --- */}
        <div className="lg:col-span-1 space-y-8">
          <MyStatsPanel stats={statsData} />
          <RecentActivityPanel items={activityItemsData} />
        </div>
        
      </div>
    </motion.div>
  );
}