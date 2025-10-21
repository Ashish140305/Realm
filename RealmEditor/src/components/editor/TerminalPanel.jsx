import React from 'react';
import Terminal from './Terminal';
import "../../styles/TerminalPanel.css";

// This component now accepts a 'terminalRef' to connect to its parent
export default function TerminalPanel({ terminalRef }) {
  return (
    <div className="terminal-panel">
      <div className="terminal-tabs">
        <div className="tab">Output</div>
        <div className="tab active">Terminal</div>
        <div className="tab">Debug</div>
      </div>
      <div className="terminal-wrapper">
        {/* The ref is now passed to the Terminal component */}
        <Terminal ref={terminalRef} />
      </div>
    </div>
  );
}