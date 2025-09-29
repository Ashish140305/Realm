// src/components/editor/TerminalPanel.jsx
import React from 'react';
import Terminal from './Terminal';
import "../../styles/TerminalPanel.css";

export default function TerminalPanel() {
  return (
    <div className="terminal-panel">
      <div className="terminal-tabs">
        <div className="tab">Output</div>
        <div className="tab active">Terminal</div>
        <div className="tab">Debug</div>
      </div>
      <div className="terminal-wrapper">
        <Terminal />
      </div>
    </div>
  );
}