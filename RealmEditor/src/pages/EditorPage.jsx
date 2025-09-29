// src/pages/EditorPage.jsx

import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import IconSidebar from '../components/layout/IconSidebar';
import SidePanel from '../components/layout/SidePanel';
import EditorPanel from '../components/editor/EditorPanel';
import TopBar from '../components/editor/TopBar';
import TerminalPanel from '../components/editor/TerminalPanel';
import '../styles/EditorPage.css';

export default function EditorPage() {
  const [activeIcon, setActiveIcon] = useState('files');

  return (
    <div className="editor-container">
      <TopBar />
      <div className="main-workspace">
        <IconSidebar activeIcon={activeIcon} setActiveIcon={setActiveIcon} />

        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            <SidePanel activeIcon={activeIcon} />
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