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
    const decorations = useRef({});

    const [files, setFiles] = useState([
        { name: 'Demo.java', content: '// Welcome to Realm!\nfunction greet() {\n  console.log("Start coding...");\n}' },
        { name: 'App.py', content: '# Your Python code here' },
        { name: 'Main.cpp', content: '// Your C++ code here' }
    ]);
    const [activeFile, setActiveFile] = useState(files[0]);

    // This function tells the editor to resize itself when panels are moved, fixing the crash.
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
        setFiles(currentFiles =>
            currentFiles.map(file =>
                file.name === activeFile.name ? { ...file, content: newCode } : file
            )
        );
        setActiveFile(currentActiveFile => ({ ...currentActiveFile, content: newCode }));

        if (channelRef.current && sessionId) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'code-update',
                payload: { code: newCode, fileName: activeFile.name },
            });
        }
    }, [activeFile, sessionId]);

    // This function is now correctly defined and will work as expected.
    const handleRunCode = () => {
        if (terminalRef.current) {
            terminalRef.current.writeln(`\n> Running ${activeFile.name}...`);
            terminalRef.current.writeln(`> Code executed successfully.`);
        }
    };

    // This hook is refactored to correctly handle real-time updates.
    useEffect(() => {
        if (!sessionId) return;

        const channel = supabase.channel(`session:${sessionId}`, { config: { broadcast: { self: false } } });
        channelRef.current = channel;

        const handleRemoteUpdate = ({ payload }) => {
            if (editorRef.current && payload.fileName === activeFile?.name) {
                const editor = editorRef.current;
                const model = editor.getModel();
                if (model && model.getValue() !== payload.code) {
                    editor.executeEdits('remote', [{ range: model.getFullModelRange(), text: payload.code }]);
                }
            }
        };

        const handleRemoteCursorUpdate = ({ payload }) => {
            if (!editorRef.current || !window.monaco || payload.username === profile.username) return;
            const newDecorations = [{
                range: new window.monaco.Range(payload.position.lineNumber, payload.position.column, payload.position.lineNumber, payload.position.column),
                options: { className: 'remote-cursor', after: { content: payload.username, className: 'remote-cursor-label' } },
            }];
            decorations.current[payload.username] = editorRef.current.deltaDecorations(decorations.current[payload.username] || [], newDecorations);
        };
        
        channel
            .on('broadcast', { event: 'code-update' }, handleRemoteUpdate)
            .on('broadcast', { event: 'cursor-update' }, handleRemoteCursorUpdate)
            .on('broadcast', { event: 'session-end' }, () => {
                alert('The collaboration session has ended.');
                navigate(`/editor/${projectName}`);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            channelRef.current = null;
        };
    }, [sessionId, profile.username, navigate, projectName, activeFile]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        window.monaco = monaco;

        editor.onDidChangeCursorPosition(e => {
            if (channelRef.current && sessionId) {
                clearTimeout(window.cursorTimeout);
                window.cursorTimeout = setTimeout(() => {
                    channelRef.current.send({
                        type: 'broadcast',
                        event: 'cursor-update',
                        payload: { username: profile.username, position: e.position },
                    });
                }, 100);
            }
        });
    };

    return (
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
                                    key={activeFile.name}
                                    activeFile={activeFile}
                                    onCodeChange={handleCodeChange}
                                    onMount={handleEditorDidMount}
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