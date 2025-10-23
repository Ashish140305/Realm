import React, { useState } from 'react';
import { File, Folder, Plus } from 'lucide-react';

const SidePanel = ({ files, onFileSelect, onAddFile }) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('file');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddFile(newItemName, newItemType);
      setNewItemName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="h-full bg-card text-white flex flex-col">
      <div className="p-3 border-b border-border">
        <h4 className="uppercase tracking-wide">File Explorer</h4>
      </div>
      <div className="flex-1 p-3 space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent"
            onClick={() => onFileSelect(file)}
          >
            {file.type === 'folder' ? <Folder className="h-4 w-4" /> : <File className="h-4 w-4" />}
            <span>{file.name}</span>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-border">
        {isAdding ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={newItemType === 'file' ? 'Enter file name' : 'Enter folder name'}
              className="bg-secondary border-secondary p-2 rounded-md"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setNewItemType('file')}
                className={`p-2 rounded-md ${newItemType === 'file' ? 'bg-primary' : 'bg-secondary'}`}
              >
                File
              </button>
              <button
                onClick={() => setNewItemType('folder')}
                className={`p-2 rounded-md ${newItemType === 'folder' ? 'bg-primary' : 'bg-secondary'}`}
              >
                Folder
              </button>
            </div>
            <button onClick={handleAddItem} className="bg-primary p-2 rounded-md">
              Add
            </button>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="w-full flex items-center justify-center gap-2 p-2 rounded-md bg-primary">
            <Plus className="h-4 w-4" />
            <span>New</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SidePanel;