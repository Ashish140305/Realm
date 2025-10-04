import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Star, FilePlus } from 'lucide-react';

// Dummy data for the activity feed
const activities = [
  { id: 1, icon: GitCommit, text: 'Pushed a commit to', project: 'RealmEditor-Frontend', time: '2 hours ago' },
  { id: 2, icon: Star, text: 'Starred the repository', project: 'auth-refactor', time: '1 day ago' },
  { id: 3, icon: FilePlus, text: 'Created a new file', project: 'API-Backend/utils.js', time: '3 days ago' },
];

const ActivityFeed = () => {
  return (
    <div className="bg-card-background p-6 rounded-xl shadow-lg">
      <h3 className="text-md font-semibold text-text-primary mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="flex items-center text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <activity.icon className="w-4 h-4 text-text-secondary mr-3" />
            <span className="text-text-secondary">{activity.text}</span>
            <span className="font-semibold text-accent mx-1.5">{activity.project}</span>
            <span className="text-text-secondary ml-auto">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;