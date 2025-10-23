import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Resizable } from "re-resizable";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { toast } from "react-toastify";

// Import components
import { MonacoEditor } from "../components/editor/MonacoEditor";
import { CollaborativeFileTree } from "../components/editor/CollaborativeFileTree";
import { ChatPanel } from "../components/editor/ChatPanel";
import { CollaboratorsList } from "../components/editor/CollaboratorsList";
import { CommitHistoryPanel } from "../components/editor/CommitHistoryPanel";
import { RunCodeModal } from "../components/editor/RunCodeModal";
import { CommitModal } from "../components/editor/CommitModal";
import { DiffViewerModal } from "../components/editor/DiffViewerModal";

// Import UI elements
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
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
  WifiOff,
} from "lucide-react";

const sampleCode = `// Welcome to your collaborative editor!
// Your code will be synced in real-time with others.
import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello, Realm!</h1>
    </div>
  );
}`;

const CollaborativeEditor = () => {
    const { projectName } = useParams();
    const navigate = useNavigate();
    const [theme, setTheme] = useState("dark");
    const stompClientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const [allUsers, setAllUsers] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const stateRef = useRef();
    stateRef.current = { allUsers, currentUser };

    const [openFiles, setOpenFiles] = useState([{ id: "1", name: "App.jsx", content: sampleCode, language: "javascript" }]);
    const [activeFileId, setActiveFileId] = useState("1");
    const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
    const [collaborativeCursors, setCollaborativeCursors] = useState([]);
    const [showRunModal, setShowRunModal] = useState(false);
    const [showCommitModal, setShowCommitModal] = useState(false);
    const [showDiffModal, setShowDiffModal] = useState(false);
    const [selectedCommitId, setSelectedCommitId] = useState("");
    const [commits, setCommits] = useState([{ id: "d4e5f6g", message: "Initial commit", author: "System", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=system", timestamp: new Date(Date.now() - 7200000), filesChanged: 1, additions: 15, deletions: 0 }]);

    const activeFile = openFiles.find((f) => f.id === activeFileId);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const username = localStorage.getItem("username");
                if (!username) {
                    toast.error("You are not logged in. Redirecting...");
                    navigate("/login");
                    return;
                }
                const profileRes = await axios.get(`/api/profile/${username}`);
                setCurrentUser(profileRes.data);
                
                const usersRes = await axios.get("/api/profile/users");
                const filteredUsers = (usersRes.data || []).filter(user => user.username !== username);
                setAllUsers(filteredUsers);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                toast.error("Could not fetch user data. Please log in again.");
                localStorage.removeItem("username");
                navigate("/login");
            }
        };
        fetchUserData();
    }, [navigate]);
  
    useEffect(() => {
        if (!currentUser) return;

        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        stompClientRef.current = client;

        client.connect({}, () => {
            setIsConnected(true);
            toast.success("Connected to collaboration server!");
            client.send(`/app/session/${projectName}/join`, {}, JSON.stringify({ username: currentUser.username }));
            
            client.subscribe(`/topic/session/${projectName}/presence`, (message) => {
                const data = JSON.parse(message.body);
                const { allUsers: currentAllUsers, currentUser: aCurrentUser } = stateRef.current;
                
                if (!currentAllUsers || !aCurrentUser) return;

                const allPossibleUsers = [...currentAllUsers, aCurrentUser];
                const activeCollaborators = allPossibleUsers.filter(u => u && data.users.includes(u.username));
                const otherCollaborators = activeCollaborators.filter(u => u.username !== aCurrentUser.username);
                
                setCollaborators(otherCollaborators);
                
                if(data.username !== aCurrentUser.username){
                    toast.info(`${data.username} ${data.event === 'join' ? 'joined' : 'left'} the session.`);
                }
            });

            client.subscribe(`/topic/session/${projectName}/code`, (m) => handleRemoteCodeChange(JSON.parse(m.body)));
            client.subscribe(`/topic/session/${projectName}/cursor`, (m) => handleRemoteCursorChange(JSON.parse(m.body)));

        }, (error) => {
            setIsConnected(false);
            console.error("STOMP error:", error);
            toast.error("Disconnected from collaboration server.");
        });

        // ✅ DEFINITIVE FIX: The cleanup function now checks if currentUser exists before using it.
        return () => {
            const stompClient = stompClientRef.current;
            if (stompClient && stompClient.connected && currentUser) {
                stompClient.send(`/app/session/${projectName}/leave`, {}, JSON.stringify({ username: currentUser.username }));
                stompClient.disconnect();
            }
        };
    }, [projectName, currentUser]);
  
    const handleRemoteCodeChange = (data) => { if (data.sender !== currentUser?.username) { setOpenFiles(p => p.map(f => (f.id === data.fileId ? { ...f, content: data.content } : f))); }};
    const handleRemoteCursorChange = (data) => { if (data.sender !== currentUser?.username) { setCollaborativeCursors(p => { const i = p.findIndex(c => c.userId === data.userId); if (i > -1) { const newP = [...p]; newP[i] = data; return newP; } return [...p, data]; }); }};
    const handleCodeChange = (content) => { setOpenFiles(p => p.map(f => f.id === activeFileId ? { ...f, content } : f)); const c = stompClientRef.current; if (c?.connected && currentUser) { c.send(`/app/session/${projectName}/code`, {}, JSON.stringify({ fileId: activeFileId, content, sender: currentUser.username, })); } };
    const handleCursorChange = (line, column) => { setCursorPosition({ line, column }); const c = stompClientRef.current; if (c?.connected && currentUser) { c.send(`/app/session/${projectName}/cursor`, {}, JSON.stringify({ userId: currentUser.username, userName: currentUser.name, color: "#3b82f6", line, column, isTyping: true, sender: currentUser.username, })); } };
    const handleFileClick = (file) => { if (file.type === "file") { if (!openFiles.some(f => f.id === file.id)) { setOpenFiles(p => [...p, { id: file.id, name: file.name, content: `// ${file.name}\n`, language: "javascript" }]); } setActiveFileId(file.id); } };
    const handleCloseFile = (id) => { const n = openFiles.filter((f) => f.id !== id); setOpenFiles(n); if (activeFileId === id && n.length > 0) { setActiveFileId(n[0].id); } else if (n.length === 0) { setActiveFileId(null); } };
    const handleShare = () => { navigator.clipboard.writeText(window.location.href); toast.success("Invite link copied!"); };
    const handleCommit = (message) => { const n = { id: Date.now().toString(36), message, author: currentUser?.name || "You", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`, timestamp: new Date(), filesChanged: 1, additions: 10, deletions: 2, }; setCommits([n, ...commits]); toast.success("Changes committed!"); };
    const handleViewDiff = (commitId) => { setSelectedCommitId(commitId); setShowDiffModal(true); };
    const toggleTheme = () => { const n = theme === "dark" ? "light" : "dark"; setTheme(n); document.documentElement.classList.toggle("dark", n === "dark"); };
    const handleLogout = () => { localStorage.removeItem("username"); toast.success("Logged out."); navigate("/login"); };

    return (
        <div className={`h-screen flex flex-col ${ theme === "dark" ? "bg-[#1e1e1e] text-white" : "bg-white text-black" }`} >
            <div className={`h-12 border-b flex items-center justify-between px-4 ${ theme === "dark" ? "bg-[#252526] border-[#2d2d2d]" : "bg-[#f3f3f3] border-[#e5e5e5]"}`}>
                <div className="flex items-center gap-4">
                    <Code2 className="h-5 w-5 text-primary" />
                    <h3 className="font-mono">{projectName || "Realm Editor"}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" className="gap-2" onClick={() => setShowRunModal(true)}><Play className="h-4 w-4" /> Run</Button>
                    <Button size="sm" variant="outline" className="gap-2" onClick={handleShare}><Share2 className="h-4 w-4" /> Share</Button>
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowCommitModal(true)}><GitCommit className="h-4 w-4" /> Commit</Button>
                    <Button size="sm" variant="ghost" onClick={toggleTheme}>{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
                    {currentUser ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><Avatar className="h-8 w-8"><AvatarImage src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} /><AvatarFallback>{currentUser.name[0]}</AvatarFallback></Avatar></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><Settings className="h-4 w-4 mr-2" /> Settings</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (<div className="h-8 w-8 rounded-full bg-muted animate-pulse" />)}
                </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <Resizable defaultSize={{ width: 250, height: "100%" }} minWidth={150} maxWidth={400} enable={{ right: true }} className={`border-r ${theme === "dark" ? "bg-[#252526] border-[#2d2d2d]" : "bg-[#f3f3f3] border-[#e5e5e5]"}`}><CollaborativeFileTree onFileClick={handleFileClick} activeFileId={activeFileId} theme={theme} /></Resizable>
                <div className="flex-1 flex flex-col">
                    <div className={`flex items-center border-b ${theme === "dark" ? "bg-[#252526] border-[#2d2d2d]" : "bg-[#f3f3f3] border-[#e5e5e5]"}`}>{openFiles.map((file) => (<div key={file.id} className={`flex items-center gap-2 px-4 py-2 border-r cursor-pointer group ${file.id === activeFileId ? (theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white') : (theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#e8e8e8]')}`} onClick={() => setActiveFileId(file.id)}><span className="font-mono text-sm">{file.name}</span><Button variant="ghost" size="icon" className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleCloseFile(file.id); }}><X className="h-3 w-3" /></Button></div>))}</div>
                    <div className="flex-1 overflow-hidden">{activeFile ? (<MonacoEditor content={activeFile.content} onChange={handleCodeChange} language={activeFile.language} onCursorChange={handleCursorChange} collaborators={collaborativeCursors} theme={theme} />) : ( <div className="flex items-center justify-center h-full text-muted-foreground">Select a file to begin.</div> )}</div>
                </div>
                <Resizable defaultSize={{ width: 320, height: "100%" }} minWidth={250} maxWidth={500} enable={{ left: true }} className={`border-l ${theme === "dark" ? "bg-[#252526] border-[#2d2d2d]" : "bg-[#f3f3f3] border-[#e5e5e5]"}`}>
                    <Tabs defaultValue="collaborators" className="h-full flex flex-col">
                        <TabsList className={`w-full rounded-none ${theme === "dark" ? "bg-[#252526]" : "bg-[#f3f3f3]"}`}><TabsTrigger value="collaborators" className="flex-1 text-xs">Collaborators</TabsTrigger><TabsTrigger value="chat" className="flex-1 text-xs">Chat</TabsTrigger><TabsTrigger value="history" className="flex-1 text-xs">History</TabsTrigger></TabsList>
                        <TabsContent value="collaborators" className="flex-1 m-0"><CollaboratorsList collaborators={collaborators} allUsers={allUsers} currentUser={currentUser} theme={theme} /></TabsContent>
                        <TabsContent value="chat" className="flex-1 m-0"><ChatPanel theme={theme} /></TabsContent>
                        <TabsContent value="history" className="flex-1 m-0"><CommitHistoryPanel commits={commits} onViewDiff={handleViewDiff} theme={theme} /></TabsContent>
                    </Tabs>
                </Resizable>
            </div>
            <div className={`h-6 border-t flex items-center justify-between px-4 text-xs ${theme === "dark" ? "bg-[#007acc] text-white" : "bg-[#007acc] text-white"}`}>
                <div className="flex items-center gap-4"><div className="flex items-center gap-1">{isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3 text-red-400" />}<span>{isConnected ? "Connected" : "Disconnected"}</span></div></div>
                <div className="flex items-center gap-4"><span>{activeFile?.name || "No file"}</span><span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span><span>{activeFile?.language || "plaintext"}</span></div>
            </div>
            <RunCodeModal open={showRunModal} onOpenChange={setShowRunModal} theme={theme} />
            <CommitModal open={showCommitModal} onOpenChange={setShowCommitModal} onCommit={handleCommit} />
            <DiffViewerModal open={showDiffModal} onOpenChange={setShowDiffModal} commitId={selectedCommitId} theme={theme} />
        </div>
    );
};

export default CollaborativeEditor;