// src/components/overview/RepositoriesPanel.jsx
import React from 'react';
import { FiFileText, FiGitBranch } from 'react-icons/fi';
import '../../styles/RepositoriesPanel.css';

const recentFiles = [
    { name: 'LandingPage.jsx', project: 'RealmEditor-Frontend', branch: 'feat/overview-page', lastSaved: '15 minutes ago' },
    { name: 'UserController.java', project: 'Spring-API-Backend', branch: 'main', lastSaved: '45 minutes ago' },
    { name: 'server.js', project: 'Socket-Server-Node', branch: 'main', lastSaved: '2 hours ago' },
    { name: 'OverviewPage.css', project: 'RealmEditor-Frontend', branch: 'feat/overview-page', lastSaved: '5 minutes ago' },
];

export default function RepositoriesPanel() {
  return (
    <div className="repositories-panel">
      <div className="panel-toolbar">
        <input type="text" placeholder="Find a recent file..." className="panel-search-input" />
      </div>
      <div className="repositories-list">
        <h4>Recent Files</h4>
        {recentFiles.map((file, index) => (
          <div key={index} className="repository-item">
            <FiFileText className="file-icon" />
            <div className="repository-details">
              <p>
                <span className="project-name">{file.project}/</span>
                <span className="file-name">{file.name}</span>
              </p>
              <div className="repository-meta">
                <FiGitBranch />
                <span>{file.branch}</span>
                <span>·</span>
                <span>Saved {file.lastSaved}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}