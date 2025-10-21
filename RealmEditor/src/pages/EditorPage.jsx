import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import EditorPanel from '../components/editor/EditorPanel';
import IconSidebar from '../components/layout/IconSidebar';
import SidePanel from '../components/layout/SidePanel';
import TopBar from '../components/editor/TopBar';
import TerminalPanel from '../components/editor/TerminalPanel';
import CollaborationModal from '../components/editor/CollaborationModal';
import EndSessionButton from '../components/editor/EndSessionButton';
import { supabase } from '../supabaseClient';
import useSettingsStore from '../store/useSettingsStore';
import '../styles/EditorPage.css';

export default function EditorPage() {
    const navigate = useNavigate();
    const { profile } = useSettingsStore();
    const [activeIcon, setActiveIcon] = useState('files');
    const { projectName } = useParams();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session');

    const [isCollabModalOpen, setCollabModalOpen] = useState(false);
    const editorRef = useRef(null);
    const terminalRef = useRef(null);
    const channelRef = useRef(null);
    const activeFileRef = useRef(null);
    
    // **FIX PART 1: Add a ref to track remote changes.**
    const isApplyingRemoteChange = useRef(false);

    const [files, setFiles] = useState([
        { name: 'Demo.java', content: '// Welcome to Realm!\nfunction greet() {\n  console.log("Start coding...");\n}' },
        { name: 'App.py', content: '# Your Python code here' },
        { name: 'Main.cpp', content: '// Your C++ code here' }
    ]);
    const [activeFile, setActiveFile] = useState(files[0]);

    useEffect(() => {
        activeFileRef.current = activeFile;
    }, [activeFile]);

    const handleLayout = useCallback(() => {
        if (editorRef.current) {
            setTimeout(() => editorRef.current.layout(), 0);
        }
    }, []);

    const handleFileSelect = (file) => {
        setActiveFile(file);
    };

    const handleAddFile = (fileName) => {
        const newFile = { name: fileName, content: '' };
        setFiles([...files, newFile]);
        setActiveFile(newFile);
    };

    const handleCodeChange = useCallback((newCode) => {
        const currentActiveFile = activeFileRef.current;
        if (currentActiveFile) {
            // This function is the single source of truth for updating React state
            setFiles(currentFiles =>
                currentFiles.map(file =>
                    file.name === currentActiveFile.name ? { ...file, content: newCode } : file
                )
            );
            setActiveFile({ ...currentActiveFile, content: newCode });

            // **FIX PART 2: Only broadcast if the change was made locally.**
            if (isApplyingRemoteChange.current) {
                return; // Do not broadcast if this change came from a remote user
            }

            if (channelRef.current && sessionId) {
                channelRef.current.send({
                    type: 'broadcast',
                    event: 'code-update',
                    payload: {
                        code: newCode,
                        fileName: currentActiveFile.name,
                        senderId: profile.username
                    },
                });
            }
        }
    }, [sessionId, profile.username]);

    const handleRunCode = () => {
        if (terminalRef.current && activeFileRef.current) {
            terminalRef.current.writeln(`\n> Running ${activeFileRef.current.name}...`);
            terminalRef.current.writeln(`> Code executed successfully.`);
        }
    };

    useEffect(() => {
        if (!sessionId) return;

        const channel = supabase.channel(`session:${sessionId}`);
        channelRef.current = channel;

        const handleRemoteUpdate = (payload) => {
            if (payload.senderId === profile.username) {
                return;
            }

            if (editorRef.current && payload.fileName === activeFileRef.current?.name) {
                const editor = editorRef.current;
                const model = editor.getModel();
                if (model && model.getValue() !== payload.code) {
                    // **FIX PART 3: Set the flag before applying the remote change.**
                    isApplyingRemoteChange.current = true;
                    editor.executeEdits('remote', [{ range: model.getFullModelRange(), text: payload.code }]);
                    // **FIX PART 4: Unset the flag after the change is applied.**
                    isApplyingRemoteChange.current = false;
                }
            }
        };

        channel
            .on('broadcast', { event: 'code-update' }, ({ payload }) => handleRemoteUpdate(payload))
            .on('broadcast', { event: 'session-end' }, () => {
                alert('The collaboration session has ended.');
                navigate(`/editor/${projectName}`);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            channelRef.current = null;
        };
    }, [sessionId, navigate, projectName, profile.username]);

    const handleEditorMount = (editor) => {
        editorRef.current = editor;
    };

    return (
        // The JSX for your component remains unchanged...
        <div className="editor-container">
            <TopBar onCollaborateClick={() => setCollabModalOpen(true)} onRunCode={handleRunCode} />
            <div className="main-workspace">
                <IconSidebar activeIcon={activeIcon} setActiveIcon={setActiveIcon} />
                <PanelGroup direction="horizontal" onLayout={handleLayout}>
                    <Panel defaultSize={20} minSize={15} maxSize={30}>
                        <SidePanel files={files} onFileSelect={handleFileSelect} onAddFile={handleAddFile} />
                    </Panel>
                    <PanelResizeHandle className="resize-handle" />
                    <Panel>
                        <PanelGroup direction="vertical" onLayout={handleLayout}>
                            <Panel defaultSize={75} minSize={50}>
                                <EditorPanel
                                    activeFile={activeFile}
                                    onCodeChange={handleCodeChange}
                                    onMount={handleEditorMount}
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
            {sessionId && <EndSessionButton sessionId={sessionId} />}
        </div>
    );
}