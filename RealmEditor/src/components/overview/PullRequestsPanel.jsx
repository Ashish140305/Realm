import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitPullRequest, MessageSquare, CheckCircle, XCircle, GitMerge } from 'lucide-react';

// Expanded dummy data with avatars and more statuses
const dummyPullRequests = [
    { id: 78, title: 'feat: Implement new Activity Dashboard UI', author: 'ashish140305', repo: 'RealmEditor-Frontend', status: 'Open', comments: 3, time: '2 hours ago', avatar: 'https://i.pravatar.cc/40?u=ashish' },
    { id: 77, title: 'fix: Resolve transparency issue in modals', author: 'jane-doe', repo: 'RealmEditor-Frontend', status: 'Merged', comments: 8, time: '1 day ago', avatar: 'https://i.pravatar.cc/40?u=jane' },
    { id: 76, title: 'docs: Update contributing guidelines', author: 'john-smith', repo: 'Realm-Docs', status: 'Open', comments: 1, time: '2 days ago', avatar: 'https://i.pravatar.cc/40?u=john' },
    { id: 75, title: 'refactor: Update state management for themes', author: 'john-smith', repo: 'RealmEditor-Frontend', status: 'Closed', comments: 5, time: '3 days ago', avatar: 'https://i.pravatar.cc/40?u=john' },
];

const statusConfig = {
    Open: { icon: GitPullRequest, color: 'text-green-500', badge: 'bg-green-500/20 text-green-400' },
    Merged: { icon: GitMerge, color: 'text-purple-500', badge: 'bg-purple-500/20 text-purple-400' },
    Closed: { icon: XCircle, color: 'text-red-500', badge: 'bg-red-500/20 text-red-400' },
};

const PullRequestItem = ({ pr, index }) => {
    const { icon: Icon, color, badge } = statusConfig[pr.status];

    return (
        <motion.div
            className="flex items-start justify-between p-4 rounded-lg hover:bg-background transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <div className="flex items-start">
                <Icon className={`${color} mt-1 flex-shrink-0`} size={18} />
                <div className="ml-4">
                    <a href="#" className="text-sm font-semibold text-text-primary hover:underline leading-tight">{pr.title}</a>
                    <p className="text-xs text-text-secondary mt-1">
                        #{pr.id} opened by {pr.author} in {pr.repo} • {pr.time}
                    </p>
                </div>
            </div>
            <div className="flex items-center flex-shrink-0 ml-4">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${badge}`}>
                    {pr.status}
                </span>
                <div className="flex items-center text-xs text-text-secondary ml-4">
                    <MessageSquare size={14} className="mr-1" />
                    <span>{pr.comments}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default function PullRequestsPanel() {
    const [filter, setFilter] = useState('Open');
    const filters = ['Open', 'Merged', 'Closed'];

    const filteredPRs = dummyPullRequests.filter(pr => pr.status === filter);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-text-primary">Pull Requests</h2>
                <div className="flex space-x-1 bg-background p-1 rounded-lg">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className="relative px-3 py-1 text-sm font-medium text-text-secondary transition-colors"
                        >
                            {filter === f && (
                                <motion.div
                                    layoutId="pr-filter-pill"
                                    className="absolute inset-0 bg-card-background rounded-md"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{f}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="border border-border-color rounded-lg">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={filter}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="divide-y divide-border-color"
                    >
                        {filteredPRs.length > 0 ? (
                            filteredPRs.map((pr, index) => (
                                <PullRequestItem key={pr.id} pr={pr} index={index} />
                            ))
                        ) : (
                            <div className="p-8 text-center text-sm text-text-secondary">
                                No {filter.toLowerCase()} pull requests.
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};