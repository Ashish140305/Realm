// src/components/editor/TopBar.jsx
import React from 'react';
import '../../styles/TopBar.css';
import { VscPlay, VscRepoPush, VscVmConnect } from 'react-icons/vsc';

export default function TopBar({ onCollaborateClick }) {
  return (
    <div className="top-bar">
      <div className="menu-items">
        <span>Files</span>
        <span>Edit</span>
        <span>View</span>
        <span>Run</span>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search Project Folder..." />
      </div>
      <div className="action-buttons">
        <button className="action-btn" title="Commit & Push"><VscRepoPush /></button>
        <button className="action-btn run-btn" title="Run Code"><VscPlay /></button>
        <button className="action-btn" title="Collaborate" onClick={onCollaborateClick}><VscVmConnect /></button>
      </div>
    </div>
  );
}