import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Plus,
  FileCode,
  FileJson,
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";

export function CollaborativeFileTree({
  onFileClick,
  activeFileId,
  theme,
}) {
  const [files, setFiles] = useState([
    {
      id: "1",
      name: "src",
      type: "folder",
      children: [
        {
          id: "2",
          name: "components",
          type: "folder",
          children: [
            { id: "3", name: "App.tsx", type: "file", extension: "tsx" },
            { id: "4", name: "Header.tsx", type: "file", extension: "tsx" },
            { id: "5", name: "Sidebar.tsx", type: "file", extension: "tsx" },
          ],
        },
        {
          id: "6",
          name: "utils",
          type: "folder",
          children: [
            { id: "7", name: "helpers.ts", type: "file", extension: "ts" },
          ],
        },
        { id: "8", name: "index.tsx", type: "file", extension: "tsx" },
        { id: "9", name: "styles.css", type: "file", extension: "css" },
      ],
    },
    {
      id: "10",
      name: "public",
      type: "folder",
      children: [
        { id: "11", name: "index.html", type: "file", extension: "html" },
      ],
    },
    { id: "12", name: "package.json", type: "file", extension: "json" },
    { id: "13", name: "tsconfig.json", type: "file", extension: "json" },
    { id: "14", name: "README.md", type: "file", extension: "md" },
  ]);

  const [expandedFolders, setExpandedFolders] = useState(
    new Set(["1", "2"])
  );
  const [isAdding, setIsAdding] = useState({
    parentId: null,
    type: null,
  });
  const [newItemName, setNewItemName] = useState("");

  const toggleFolder = (id) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (extension) => {
    if (!extension) return <File className="h-4 w-4" />;
    
    switch (extension) {
      case "tsx":
      case "ts":
      case "jsx":
      case "js":
        return <FileCode className="h-4 w-4 text-blue-500" />;
      case "json":
        return <FileJson className="h-4 w-4 text-yellow-500" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const handleAddItem = (parentId, type) => {
    setIsAdding({ parentId, type });
    setNewItemName("");
  };

  const confirmAddItem = () => {
    if (!newItemName.trim() || !isAdding.type) return;

    const newNode = {
      id: Date.now().toString(),
      name: newItemName,
      type: isAdding.type,
      extension: isAdding.type === "file" ? newItemName.split(".").pop() : undefined,
      children: isAdding.type === "folder" ? [] : undefined,
    };

    setFiles([...files, newNode]);
    setIsAdding({ parentId: null, type: null });
    setNewItemName("");
  };

  const renderFileNode = (node, level = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isActive = node.id === activeFileId;

    return (
      <div key={node.id}>
        <button
          onClick={() =>
            node.type === "folder" ? toggleFolder(node.id) : onFileClick(node)
          }
          className={`flex items-center gap-1 w-full px-2 py-1 rounded-sm transition-colors ${
            isActive
              ? theme === "dark"
                ? "bg-[#37373d]"
                : "bg-[#e8e8e8]"
              : theme === "dark"
              ? "hover:bg-[#2a2d2e]"
              : "hover:bg-[#f3f3f3]"
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {node.type === "folder" ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-400" />
              ) : (
                <Folder className="h-4 w-4 text-blue-400" />
              )}
            </>
          ) : (
            <>
              <span className="w-4" />
              {getFileIcon(node.extension)}
            </>
          )}
          <span className="font-mono text-sm">{node.name}</span>
        </button>
        {node.type === "folder" && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderFileNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className={`p-3 border-b flex items-center justify-between ${
          theme === "dark"
            ? "bg-[#252526] border-[#2d2d2d]"
            : "bg-[#f3f3f3] border-[#e5e5e5]"
        }`}
      >
        <h4 className="uppercase tracking-wide">Explorer</h4>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleAddItem(null, "file")}
            title="New File"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleAddItem(null, "folder")}
            title="New Folder"
          >
            <Folder className="h-3 w-3" />
            <Plus className="h-2 w-2 -ml-1" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {files.map((node) => renderFileNode(node))}
          {isAdding.type && (
            <div className="px-2 py-1">
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmAddItem();
                  if (e.key === "Escape")
                    setIsAdding({ parentId: null, type: null });
                }}
                placeholder={`New ${isAdding.type}...`}
                className="h-6 text-sm font-mono"
                autoFocus
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}