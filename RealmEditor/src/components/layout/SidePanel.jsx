import React, { useState } from 'react';
import '../../styles/SidePanel.css';
import { VscNewFile } from 'react-icons/vsc';

export default function SidePanel({ files, onFileSelect, onAddFile }) {
    const [newFileName, setNewFileName] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleAddFileClick = () => {
        setShowInput(true);
    };

    const handleInputChange = (e) => {
        setNewFileName(e.target.value);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' && newFileName.trim() !== '') {
            onAddFile(newFileName.trim());
            setNewFileName('');
            setShowInput(false);
        } else if (e.key === 'Escape') {
            setNewFileName('');
            setShowInput(false);
        }
    };

    return (
        <div className="side-panel">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>EXPLORER</span>
                <button onClick={handleAddFileClick} className="icon-button" title="New File">
                    <VscNewFile />
                </button>
            </div>
            <div className="file-list">
                {files.map((file) => (
                    <div
                        key={file.name}
                        className="file"
                        onClick={() => onFileSelect(file)}
                        style={{ cursor: 'pointer' }}
                    >
                        {file.name}
                    </div>
                ))}
                {showInput && (
                    <input
                        type="text"
                        value={newFileName}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onBlur={() => setShowInput(false)}
                        placeholder="Enter file name..."
                        className="search-input"
                        autoFocus
                    />
                )}
            </div>
        </div>
    );
}