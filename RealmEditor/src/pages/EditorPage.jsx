import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import IconSidebar from '../components/layout/IconSidebar';
import SidePanel from '../components/layout/SidePanel';
import TopBar from '../components/editor/TopBar';
import TerminalPanel from '../components/editor/TerminalPanel';
import CollaborationModal from '../components/editor/CollaborationModal';
import { supabase } from '../supabaseClient';
import '../styles/EditorPage.css'; // Corrected Path

export default function EditorPage() {
    const [activeIcon, setActiveIcon] = useState('files');
    const { projectName } = useParams();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session');

    const [isCollabModalOpen, setCollabModalOpen] = useState(false);
    const [code, setCode] = useState(`// Welcome to Realm!\n// Session: ${sessionId || 'None'}\n\nfunction greet() {\n  console.log("Start coding...");\n}`);
    const editorRef = useRef(null);
    const channelRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;

        const channel = supabase.channel(`session:${sessionId}`, {
            config: {
                broadcast: {
                    self: false, // Don't receive our own messages
                },
            },
        });

        channel
            .on('broadcast', { event: 'code-update' }, ({ payload }) => {
                console.log('Received code update:', payload.code);
                // To prevent an infinite loop, we only update if the content is different
                if (editorRef.current && editorRef.current.getValue() !== payload.code) {
                    editorRef.current.setValue(payload.code);
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Successfully subscribed to collaboration channel!');
                }
            });

        channelRef.current = channel;

        // Cleanup on component unmount
        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [sessionId]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const handleEditorChange = (value) => {
        setCode(value);
        if (channelRef.current && sessionId) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'code-update',
                payload: { code: value },
            });
        }
    };

    return (
        <div className="editor-container">
            <TopBar projectName={projectName} onCollaborateClick={() => setCollabModalOpen(true)} />
            <div className="main-workspace">
                <IconSidebar activeIcon={activeIcon} setActiveIcon={setActiveIcon} />

                <PanelGroup direction="horizontal">
                    <Panel defaultSize={20} minSize={15} maxSize={30}>
                        <SidePanel activeIcon={activeIcon} projectName={projectName} />
                    </Panel>
                    <PanelResizeHandle className="resize-handle" />
                    <Panel>
                        <PanelGroup direction="vertical">
                            <Panel defaultSize={75} minSize={50}>
                                <Editor
                                    height="100%"
                                    defaultLanguage="javascript"
                                    value={code}
                                    theme="vs-dark"
                                    onMount={handleEditorDidMount}
                                    onChange={handleEditorChange}
                                    options={{
                                        minimap: { enabled: true },
                                        fontSize: 14,
                                        wordWrap: 'on',
                                    }}
                                />
                            </Panel>
                            <PanelResizeHandle className="resize-handle" />
                            <Panel defaultSize={25} minSize={10}>
                                <TerminalPanel />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>
            {isCollabModalOpen && <CollaborationModal onClose={() => setCollabModalOpen(false)} projectName={projectName} />}
        </div>
    );
}