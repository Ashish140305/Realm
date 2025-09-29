// src/components/layout/IconSidebar.jsx

import React from 'react';
import { VscFiles, VscSearch, VscSourceControl, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import '../../styles/IconSidebar.css';

// 1. Receive the activeIcon state and setActiveIcon function as props
export default function IconSidebar({ activeIcon, setActiveIcon }) {
  return (
    <div className="icon-sidebar">
      <div className="top-icons">
        {/* 2. Add onClick handlers and set className dynamically */}
        <button 
          className={activeIcon === 'files' ? 'icon-button active' : 'icon-button'} 
          onClick={() => setActiveIcon('files')}
          title="Explorer"
        >
          <VscFiles />
        </button>
        <button 
          className={activeIcon === 'search' ? 'icon-button active' : 'icon-button'} 
          onClick={() => setActiveIcon('search')}
          title="Search"
        >
          <VscSearch />
        </button>
        <button 
          className={activeIcon === 'source' ? 'icon-button active' : 'icon-button'} 
          onClick={() => setActiveIcon('source')}
          title="Source Control"
        >
          <VscSourceControl />
        </button>
      </div>
      <div className="bottom-icons">
        <button 
          className={activeIcon === 'account' ? 'icon-button active' : 'icon-button'} 
          onClick={() => setActiveIcon('account')}
          title="Account"
        >
          <VscAccount />
        </button>
        <button 
          className={activeIcon === 'settings' ? 'icon-button active' : 'icon-button'} 
          onClick={() => setActiveIcon('settings')}
          title="Settings"
        >
          <VscSettingsGear />
        </button>
      </div>
    </div>
  );
}