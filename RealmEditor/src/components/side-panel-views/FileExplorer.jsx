import React from 'react';

export default function FileExplorer() {
  return (
    <div>
      <div className="panel-header">EXPLORER</div>
      <div className="file-list">
        <div className="folder">Project Folder</div>
        <div className="file indent-1">Demo.java</div>
        <div className="file indent-1">App.py</div>
        <div className="file indent-1">Main.cpp</div>
      </div>
    </div>
  );
}