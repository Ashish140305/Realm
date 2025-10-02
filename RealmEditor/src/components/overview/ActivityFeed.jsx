// src/components/overview/ActivityFeed.jsx
import React from 'react';
import { FiGitCommit, FiUploadCloud } from 'react-icons/fi';
import '../../styles/ActivityFeed.css';

const activities = [
    { icon: <FiGitCommit />, text: "You pushed a commit to", project: "RealmEditor-Frontend", time: "2m ago" },
    { icon: <FiUploadCloud />, text: "A new version of Spring-API-Backend was deployed.", project: "", time: "1h ago" },
    { icon: <FiGitCommit />, text: "Jane Doe pushed a commit to", project: "Socket-Server-Node", time: "3h ago" },
];

export default function ActivityFeed() {
  return (
    <div className="activity-feed-card">
      <h4>Recent Activity</h4>
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-icon">{activity.icon}</div>
            <div className="activity-content">
              <p>
                {activity.text}
                {activity.project && <strong> {activity.project}</strong>}
              </p>
              <span>{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}