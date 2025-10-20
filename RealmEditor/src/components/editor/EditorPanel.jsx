import React from 'react';
import Editor from '@monaco-editor/react';
import '../../styles/EditorPanel.css';
import { getLanguageFromExtension } from '../../utils/languageUtils';

export default function EditorPanel({ activeFile, onCodeChange, editorRef }) {

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    return (
        <div className="editor-panel">
            <div className="editor-tabs">
                {activeFile && <div className="tab active">{activeFile.name}</div>}
            </div>
            <Editor
                height="calc(100% - 35px)"
                language={activeFile ? getLanguageFromExtension(activeFile.name) : 'plaintext'}
                value={activeFile ? activeFile.content : ''}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                onChange={onCodeChange}
                options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    wordWrap: 'on',
                }}
            />
        </div>
    );
}