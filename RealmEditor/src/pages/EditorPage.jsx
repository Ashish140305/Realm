import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import IconSidebar from '../components/layout/IconSidebar';
import SidePanel from '../components/layout/SidePanel';
import EditorPanel from '../components/editor/EditorPanel';
import TopBar from '../components/editor/TopBar';
import TerminalPanel from '../components/editor/TerminalPanel';
import '../styles/EditorPage.css';

export default function EditorPage() {
  const [activeIcon, setActiveIcon] = useState('files');
  const { projectName } = useParams(); // Get projectName from URL

  return (
    <div className="editor-container">
      {/* You can pass the projectName to the TopBar to display it */}
      <TopBar projectName={projectName} />
      <div className="main-workspace">
        <IconSidebar activeIcon={activeIcon} setActiveIcon={setActiveIcon} />

        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            {/* You can also pass the projectName here to show project-specific files */}
            <SidePanel activeIcon={activeIcon} projectName={projectName} />
          </Panel>
          <PanelResizeHandle className="resize-handle" />
          <Panel>
            <PanelGroup direction="vertical">
              <Panel defaultSize={75} minSize={50}>
                <EditorPanel />
              </Panel>
              <PanelResizeHandle className="resize-handle" />
              <Panel defaultSize={25} minSize={10}>
                <TerminalPanel />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}