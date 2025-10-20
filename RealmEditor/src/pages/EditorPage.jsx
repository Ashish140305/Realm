import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import EditorPanel from '../components/editor/EditorPanel';
import IconSidebar from '../components/layout/IconSidebar';
import SidePanel from '../components/layout/SidePanel';
import TopBar from '../components/editor/TopBar';
import TerminalPanel from '../components/editor/TerminalPanel';
import CollaborationModal from '../components/editor/CollaborationModal';
import { supabase } from '../supabaseClient';
import '../styles/EditorPage.css';

export default function EditorPage() {
    const [activeIcon, setActiveIcon] = useState('files');
    const { projectName } = useParams();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session');

    const [isCollabModalOpen, setCollabModalOpen] = useState(false);
    const editorRef = useRef(null);
    const terminalRef = useRef(null);
    const channelRef = useRef(null);

    const [files, setFiles] = useState([
        { name: 'Demo.java', content: '// Welcome to Realm!\nfunction greet() {\n  console.log("Start coding...");\n}' },
        { name: 'App.py', content: '# Your Python code here' },
        { name: 'Main.cpp', content: '// Your C++ code here' }
    ]);
    const [activeFile, setActiveFile] = useState(files[0]);

    const handleFileSelect = (file) => {
        setActiveFile(file);
    };

    const handleAddFile = (fileName) => {
        const newFile = { name: fileName, content: '' };
        setFiles([...files, newFile]);
        setActiveFile(newFile);
    };

    const handleCodeChange = (newCode) => {
        const updatedFiles = files.map(file =>
            file.name === activeFile.name ? { ...file, content: newCode } : file
        );
        setFiles(updatedFiles);
        setActiveFile({ ...activeFile, content: newCode });

        if (channelRef.current && sessionId) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'code-update',
                payload: { code: newCode, fileName: activeFile.name },
            });
        }
    };

    const handleRunCode = () => {
        if (terminalRef.current) {
            terminalRef.current.writeln(`\n> Running ${activeFile.name}...`);
            // This is a mock execution. A real implementation would
            // send the code to a backend service for execution.
            terminalRef.current.writeln(`> Code executed successfully.`);
        }
    };
    
    useEffect(() => {
        if (!sessionId) return;

        const channel = supabase.channel(`session:${sessionId}`, {
            config: {
                broadcast: {
                    self: false, 
                },
            },
        });

        channel
            .on('broadcast', { event: 'code-update' }, ({ payload }) => {
                const updatedFiles = files.map(file =>
                    file.name === payload.fileName ? { ...file, content: payload.code } : file
                );
                setFiles(updatedFiles);
                if (activeFile.name === payload.fileName) {
                    editorRef.current.setValue(payload.code);
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Successfully subscribed to collaboration channel!');
                }
            });

        channelRef.current = channel;

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [sessionId, files, activeFile]);


    return (
        <div className="editor-container">
            <TopBar 
                onCollaborateClick={() => setCollabModalOpen(true)}
                onRunCode={handleRunCode}
            />
            <div className="main-workspace">
                <IconSidebar activeIcon={activeIcon} setActiveIcon={setActiveIcon} />

                <PanelGroup direction="horizontal">
                    <Panel defaultSize={20} minSize={15} maxSize={30}>
                        <SidePanel 
                            files={files}
                            onFileSelect={handleFileSelect}
                            onAddFile={handleAddFile}
                        />
                    </Panel>
                    <PanelResizeHandle className="resize-handle" />
                    <Panel>
                        <PanelGroup direction="vertical">
                            <Panel defaultSize={75} minSize={50}>
                                <EditorPanel
                                    activeFile={activeFile}
                                    onCodeChange={handleCodeChange}
                                    editorRef={editorRef}
                                />
                            </Panel>
                            <PanelResizeHandle className="resize-handle" />
                            <Panel defaultSize={25} minSize={10}>
                                <TerminalPanel terminalRef={terminalRef} />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>
            {isCollabModalOpen && <CollaborationModal onClose={() => setCollabModalOpen(false)} projectName={projectName} />}
        </div>
    );
}