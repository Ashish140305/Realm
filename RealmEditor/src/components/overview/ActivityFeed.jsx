import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Star, FilePlus, GitPullRequest, MessageSquare } from 'lucide-react';

const activities = [
  { id: 1, user: 'Elena', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026704d', icon: GitPullRequest, text: 'assigned you a pull request in', project: 'RealmEditor-Frontend', time: '15m ago' },
  { id: 2, user: 'Carlos', avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026705d', icon: MessageSquare, text: 'mentioned you in a comment on', project: 'API-Backend', time: '1h ago' },
  { id: 3, user: 'You', avatar: null, icon: GitCommit, text: 'pushed a commit to', project: 'RealmEditor-Frontend', time: '2 hours ago' },
  { id: 4, user: 'You', avatar: null, icon: Star, text: 'starred the repository', project: 'auth-refactor', time: '1 day ago' },
  { id: 5, user: 'You', avatar: null, icon: FilePlus, text: 'created a new file in', project: 'API-Backend/utils.js', time: '3 days ago' },
];

const ActivityFeed = () => {
  return (
    <div className="bg-card-background p-6 rounded-xl shadow-lg">
      <h3 className="text-md font-semibold text-text-primary mb-4">For You</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="flex items-center text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {activity.avatar && <img src={activity.avatar} alt={activity.user} className="w-6 h-6 rounded-full mr-3" />}
            <activity.icon className="w-4 h-4 text-text-secondary mr-3 flex-shrink-0" />
            <div className="truncate">
                <span className="font-semibold text-text-primary">{activity.user}</span>
                <span className="text-text-secondary"> {activity.text} </span>
                <span className="font-semibold text-accent">{activity.project}</span>
            </div>
            <span className="text-text-secondary ml-auto pl-2">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;