import React from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

// Dummy data for now - this is ready for your backend
const dummyPullRequests = [
    { id: 78, title: 'feat: Implement new Activity Dashboard UI', author: 'ashish140305', repo: 'RealmEditor-Frontend', status: 'Open', comments: 3, time: '2 hours ago' },
    { id: 77, title: 'fix: Resolve transparency issue in modals', author: 'jane-doe', repo: 'RealmEditor-Frontend', status: 'Merged', comments: 8, time: '1 day ago' },
    { id: 75, title: 'refactor: Update state management for themes', author: 'john-smith', repo: 'RealmEditor-Frontend', status: 'Closed', comments: 5, time: '3 days ago' },
];

const PullRequestStatus = ({ status }) => {
    if (status === 'Merged') return <CheckCircle className="text-purple-500" size={18} />;
    if (status === 'Closed') return <XCircle className="text-red-500" size={18} />;
    return <GitPullRequest className="text-green-500" size={18} />;
};

const PullRequestsPanel = () => {
    const pullRequests = dummyPullRequests;

    return (
        <div className="bg-card-background p-4 rounded-xl shadow-lg">
            <h3 className="text-md font-semibold text-text-primary mb-4">
                Your Pull Requests
            </h3>
            <div className="space-y-3">
                {pullRequests.map((pr, index) => (
                    <motion.div
                        key={pr.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-background"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex items-center">
                            <PullRequestStatus status={pr.status} />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-text-primary">{pr.title}</p>
                                <p className="text-xs text-text-secondary">
                                    #{pr.id} opened by {pr.author} in {pr.repo}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center text-xs text-text-secondary">
                            <MessageSquare size={14} className="mr-1.5" />
                            <span>{pr.comments}</span>
                            <span className="ml-4">{pr.time}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PullRequestsPanel;