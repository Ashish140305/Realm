// src/components/layout/SidePanel.jsx
import React from 'react';
import '../../styles/SidePanel.css';

// This is a placeholder. You would add logic here to show the
// file explorer, search results, etc., based on the active icon.
export default function SidePanel() {
  return (
    <div className="side-panel">
      <div className="panel-header">EXPLORER</div>
      <div className="file-list">
        {/* Mock file structure */}
        <div className="folder">Project Folder</div>
        <div className="file indent-1">Demo.java</div>
        <div className="file indent-1">App.py</div>
        <div className="file indent-1">Main.cpp</div>
      </div>
    </div>
  );
}