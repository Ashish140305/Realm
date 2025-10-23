import React, { useState, useEffect, useRef } from "react";
import { Resizable } from "re-resizable";
import { MonacoEditor } from "../components/editor/MonacoEditor";
import { CollaborativeFileTree } from "../components/editor/CollaborativeFileTree";
import { ChatPanel } from "../components/editor/ChatPanel";
import { CollaboratorsList } from "../components/editor/CollaboratorsList";
import { CommitHistoryPanel } from "../components/editor/CommitHistoryPanel";
import { RunCodeModal } from "../components/editor/RunCodeModal";
import { CommitModal } from "../components/editor/CommitModal";
import { DiffViewerModal } from "../components/editor/DiffViewerModal";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "react-toastify";
import {
  Play,
  Share2,
  Sun,
  Moon,
  Settings,
  LogOut,
  GitCommit,
  X,
  Code2,
  Wifi,
} from "lucide-react";

const sampleCode = `import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';

function CollabCodeApp() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      <header>
        <h1>Welcome to CollabCode</h1>
        <p>Real-time collaborative code editor</p>
      </header>

      <main>
        <section className="counter">
          <h2>Counter: {count}</h2>
          <Button onClick={handleIncrement}>
            Increment
          </Button>
        </section>

        <section className="theme-toggle">
          <p>Current theme: {theme}</p>
          <Button onClick={toggleTheme}>
            Toggle Theme
          </Button>
        </section>
      </main>

      <footer>
        <p>Built with React & TypeScript</p>
      </footer>
    </div>
  );
}

export default CollabCodeApp;`;

const CollaborativeEditor = () => {
  const [theme, setTheme] = useState("dark");
  const [openFiles, setOpenFiles] = useState([
    {
      id: "3",
      name: "App.tsx",
      content: sampleCode,
      language: "typescript",
    },
  ]);
  const [activeFileId, setActiveFileId] = useState("3");
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [showRunModal, setShowRunModal] = useState(false);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [selectedCommitId, setSelectedCommitId] = useState("");

  const [collaborators, setCollaborators] = useState([
    {
      id: "1",
      name: "You",
      email: "you@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      status: "online",
      cursorColor: "#3b82f6",
      currentFile: "App.tsx",
    },
    {
      id: "2",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      status: "online",
      cursorColor: "#10b981",
      currentFile: "App.tsx",
    },
    {
      id: "3",
      name: "Bob Smith",
      email: "bob@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      status: "online",
      cursorColor: "#8b5cf6",
      currentFile: "helpers.ts",
    },
  ]);

  const [collaborativeCursors, setCollaborativeCursors] = useState([
    {
      userId: "2",
      userName: "Alice Johnson",
      color: "#10b981",
      line: 5,
      column: 10,
      isTyping: true,
    },
  ]);

  const [commits, setCommits] = useState([
    {
      id: "a1b2c3d",
      message: "Add theme toggle functionality",
      author: "Alice Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      timestamp: new Date(Date.now() - 3600000),
      filesChanged: 3,
      additions: 45,
      deletions: 12,
    },
    {
      id: "d4e5f6g",
      message: "Fix responsive layout",
      author: "Bob Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      timestamp: new Date(Date.now() - 7200000),
      filesChanged: 2,
      additions: 23,
      deletions: 8,
    },
  ]);

  const activeFile = openFiles.find((f) => f.id === activeFileId);

  const handleFileClick = (file) => {
    if (file.type === "file") {
      const existingFile = openFiles.find((f) => f.id === file.id);
      if (existingFile) {
        setActiveFileId(file.id);
      } else {
        const newFile = {
          id: file.id,
          name: file.name,
          content: `// ${file.name}\n\n// Start coding here...\n`,
          language: file.extension === "tsx" || file.extension === "ts" ? "typescript" : "javascript",
        };
        setOpenFiles([...openFiles, newFile]);
        setActiveFileId(newFile.id);
      }
    }
  };

  const handleCloseFile = (id) => {
    const newFiles = openFiles.filter((f) => f.id !== id);
    setOpenFiles(newFiles);
    if (activeFileId === id && newFiles.length > 0) {
      setActiveFileId(newFiles[0].id);
    }
  };

  const handleCodeChange = (content) => {
    setOpenFiles(
      openFiles.map((f) =>
        f.id === activeFileId ? { ...f, content } : f
      )
    );
  };

  const handleShare = () => {
    const link = "https://collabcode.app/invite/abc123xyz";
    navigator.clipboard.writeText(link);
    toast.success("Invite link copied to clipboard!", {
      description: link,
    });
  };

  const handleCommit = (message, description) => {
    const newCommit = {
      id: Date.now().toString(36),
      message,
      author: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      timestamp: new Date(),
      filesChanged: 2,
      additions: 15,
      deletions: 3,
    };
    setCommits([newCommit, ...commits]);
    toast.success("Changes committed successfully!");
  };

  const handleViewDiff = (commitId) => {
    setSelectedCommitId(commitId);
    setShowDiffModal(true);
  };

  const handleRestore = (commitId) => {
    toast.success("Version restored successfully!");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborativeCursors((cursors) =>
        cursors.map((cursor) => ({
          ...cursor,
          line: Math.max(1, cursor.line + Math.floor(Math.random() * 3 - 1)),
          column: Math.max(1, cursor.column + Math.floor(Math.random() * 5 - 2)),
          isTyping: Math.random() > 0.5,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`h-screen flex flex-col ${
        theme === "dark" ? "bg-[#1e1e1e] text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <div
        className={`h-12 border-b flex items-center justify-between px-4 ${
          theme === "dark"
            ? "bg-[#252526] border-[#2d2d2d]"
            : "bg-[#f3f3f3] border-[#e5e5e5]"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <h3 className="font-mono">CollabCode</h3>
          </div>
          <Select defaultValue="main">
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">main</SelectItem>
              <SelectItem value="develop">develop</SelectItem>
              <SelectItem value="feature">feature/ui</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setShowRunModal(true)}
          >
            <Play className="h-4 w-4" />
            Run
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => setShowCommitModal(true)}
          >
            <GitCommit className="h-4 w-4" />
            Commit
          </Button>
          <Button size="sm" variant="ghost" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <Resizable
          defaultSize={{ width: 250, height: "100%" }}
          minWidth={150}
          maxWidth={400}
          enable={{ right: true }}
          className={`border-r ${
            theme === "dark"
              ? "bg-[#252526] border-[#2d2d2d]"
              : "bg-[#f3f3f3] border-[#e5e5e5]"
          }`}
        >
          <CollaborativeFileTree
            onFileClick={handleFileClick}
            activeFileId={activeFileId}
            theme={theme}
          />
        </Resizable>

        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div
            className={`flex items-center border-b ${
              theme === "dark"
                ? "bg-[#252526] border-[#2d2d2d]"
                : "bg-[#f3f3f3] border-[#e5e5e5]"
            }`}
          >
            {openFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center gap-2 px-4 py-2 border-r cursor-pointer group ${
                  file.id === activeFileId
                    ? theme === "dark"
                      ? "bg-[#1e1e1e] border-[#2d2d2d]"
                      : "bg-white border-[#e5e5e5]"
                    : theme === "dark"
                    ? "bg-[#2d2d2d] border-[#2d2d2d] hover:bg-[#2a2d2e]"
                    : "bg-[#f3f3f3] border-[#e5e5e5] hover:bg-[#e8e8e8]"
                }`}
                onClick={() => setActiveFileId(file.id)}
              >
                <span className="font-mono text-sm">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseFile(file.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            {activeFile ? (
              <MonacoEditor
                content={activeFile.content}
                onChange={handleCodeChange}
                language={activeFile.language}
                onCursorChange={(line, column) =>
                  setCursorPosition({ line, column })
                }
                collaborators={collaborativeCursors}
                theme={theme}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Open a file to start editing
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Collaborators, Chat, History */}
        <Resizable
          defaultSize={{ width: 320, height: "100%" }}
          minWidth={250}
          maxWidth={500}
          enable={{ left: true }}
          className={`border-l ${
            theme === "dark"
              ? "bg-[#252526] border-[#2d2d2d]"
              : "bg-[#f3f3f3] border-[#e5e5e5]"
          }`}
        >
          <Tabs defaultValue="collaborators" className="h-full flex flex-col">
            <TabsList
              className={`w-full rounded-none ${
                theme === "dark" ? "bg-[#252526]" : "bg-[#f3f3f3]"
              }`}
            >
              <TabsTrigger value="collaborators" className="flex-1 text-xs">
                Collaborators
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1 text-xs">
                Chat
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 text-xs">
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="collaborators" className="flex-1 m-0">
              <CollaboratorsList
                collaborators={collaborators}
                theme={theme}
              />
            </TabsContent>
            <TabsContent value="chat" className="flex-1 m-0">
              <ChatPanel theme={theme} />
            </TabsContent>
            <TabsContent value="history" className="flex-1 m-0">
              <CommitHistoryPanel
                commits={commits}
                onViewDiff={handleViewDiff}
                onRestore={handleRestore}
                theme={theme}
              />
            </TabsContent>
          </Tabs>
        </Resizable>
      </div>

      {/* Status Bar */}
      <div
        className={`h-6 border-t flex items-center justify-between px-4 text-xs ${
          theme === "dark"
            ? "bg-[#007acc] border-[#007acc] text-white"
            : "bg-[#007acc] border-[#007acc] text-white"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            <span>Connected</span>
          </div>
          <span>main</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{activeFile?.name || "No file open"}</span>
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
          <span>{activeFile?.language || "plaintext"}</span>
          <span>UTF-8</span>
        </div>
      </div>

      {/* Modals */}
      <RunCodeModal
        open={showRunModal}
        onOpenChange={setShowRunModal}
        theme={theme}
      />
      <CommitModal
        open={showCommitModal}
        onOpenChange={setShowCommitModal}
        onCommit={handleCommit}
      />
      <DiffViewerModal
        open={showDiffModal}
        onOpenChange={setShowDiffModal}
        commitId={selectedCommitId}
        theme={theme}
      />
    </div>
  );
};

export default CollaborativeEditor;