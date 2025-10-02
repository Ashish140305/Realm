// src/components/overview/OverviewHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiBox, FiStar, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../../styles/OverviewHeader.css';

const NavItem = ({ id, activeTab, setActiveTab, icon, children }) => (
  <button 
    className={`nav-item ${activeTab === id ? 'active' : ''}`}
    onClick={() => setActiveTab(id)}
  >
    {icon}
    <span>{children}</span>
    {activeTab === id && (
      <motion.div className="underline" layoutId="underline" />
    )}
  </button>
);

export default function OverviewHeader({ activeTab, setActiveTab, onSettingsClick }) {
  const navigate = useNavigate();
  return (
    <header className="overview-header">
      <nav className="header-nav">
        <NavItem id="projects" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FiBook />}>Projects</NavItem>
        <NavItem id="repositories" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FiBox />}>Repositories</NavItem>
        <NavItem id="starred" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FiStar />}>Starred</NavItem>
      </nav>
      <div className="header-actions">
        <button className="primary-button" onClick={() => navigate('/editor')}>Go to Editor</button>
        <button className="icon-button" onClick={onSettingsClick} aria-label="Settings"><FiSettings /></button>
      </div>
    </header>
  );
}