import React, { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../components/ui/resizable";
import EditorPanel from '../components/editor/EditorPanel';
import SidePanel from '../components/layout/SidePanel';
import TopBar from '../components/editor/TopBar';
import TerminalPanel from '../components/editor/TerminalPanel';
import CollaboratorsList from '../components/editor/CollaboratorsList';
import ChatPanel from '../components/editor/ChatPanel';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const sampleCode = `function HelloWorld() {
  return <h1>Hello, World!</h1>;
}`;

const CollaborativeEditor = () => {
  const [files, setFiles] = useState([
    { name: "App.js", content: sampleCode, language: "javascript" },
  ]);
  const [activeFile, setActiveFile] = useState(files[0]);
  const [collaborators, setCollaborators] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const { projectName } = useParams();
  const [currentUser, setCurrentUser] = useState(null);

  // Effect for setting the current user from localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }, []);

  // Effect for fetching collaborators once we have a current user
  useEffect(() => {
    const fetchCollaborators = async () => {
      // Only run if currentUser is set
      if (currentUser) {
        try {
          const response = await axios.get('http://localhost:8080/api/collaboration/users');
          // Filter out the current user from the collaborators list
          const filteredCollaborators = response.data.filter(collaborator => collaborator.id !== currentUser.id);
          setCollaborators(filteredCollaborators);
        } catch (error) {
          console.error("Failed to fetch collaborators", error);
        }
      }
    };

    fetchCollaborators();
  }, [currentUser]); // Dependency array ensures this runs when currentUser is updated
  
  // Effect for WebSocket connection
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    
    // Disable debug logging to clean up the console
    client.debug = null;

    console.log("Attempting to connect to WebSocket...");
    client.connect({}, 
      () => { // onConnect callback
        console.log("WebSocket connected successfully!");
        setStompClient(client);
      },
      (error) => { // onError callback
        console.error("WebSocket connection error:", error);
      }
    );

    return () => {
      if (client && client.connected) {
        console.log("Disconnecting WebSocket.");
        client.disconnect();
      }
    };
  }, []); // Empty dependency array, so it runs only once on mount

  const onFileSelect = (file) => {
    setActiveFile(file);
  };
  
  const onAddFile = async (fileName, type) => {
    try {
      const response = await axios.post('http://localhost:8080/api/files', {
        name: fileName,
        type: type,
        content: ''
      });
      setFiles([...files, response.data]);
      setActiveFile(response.data);
    } catch (error) {
      console.error("Failed to add file", error);
    }
  };

  const onSelectUser = async (user) => {
    if (!currentUser) {
      alert("You are not logged in.");
      return;
    }
    try {
        const userIds = [currentUser.id, user.id];
        await axios.post('http://localhost:8080/api/collaboration/start-with-user', userIds);
        alert(`Collaboration started with ${user.name}`);
    } catch (error) {
        console.error("Failed to start collaboration", error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-white">
      <TopBar />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={15}>
          <SidePanel files={files} onFileSelect={onFileSelect} onAddFile={onAddFile} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75}>
              <EditorPanel activeFile={activeFile} onCodeChange={() => {}} onMount={() => {}} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25}>
              <TerminalPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <CollaboratorsList collaborators={collaborators} onSelectUser={onSelectUser} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              {currentUser && stompClient && <ChatPanel stompClient={stompClient} chatRoomId="1" currentUser={currentUser} />}
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CollaborativeEditor;