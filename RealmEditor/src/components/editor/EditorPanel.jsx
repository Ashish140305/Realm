// src/components/editor/EditorPanel.jsx
import React from 'react';
import Editor from '@monaco-editor/react';
import '../../styles/EditorPanel.css';

export default function EditorPanel() {
  const code = `// Welcome to Realm!
function greet() {
  console.log("Start coding...");
}`;

  return (
    <div className="editor-panel">
      <div className="editor-tabs">
        <div className="tab active">Demo.java</div>
        <div className="tab">App.py</div>
        <div className="tab">Main.cpp</div>
      </div>
      <Editor
        height="calc(100% - 35px)" // Adjust height to account for tabs
        defaultLanguage="javascript"
        defaultValue={code}
        theme="vs" // Changed from "vs-dark" to "vs" (light theme)
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}