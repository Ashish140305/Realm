// src/components/editor/Terminal.jsx
import React, { useEffect, useRef } from 'react';
import { Terminal as XtermTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default function Terminal() {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (!terminalRef.current || terminalRef.current.children.length > 0) {
      return;
    }

    const term = new XtermTerminal({
      cursorBlink: true,
      theme: {
        background: '#202124',
        foreground: '#d4d4d4',
      },
      fontFamily: 'monospace',
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    term.write('Welcome to Realm Terminal!\r\n$ ');

    term.onData(data => {
      term.write(data);
    });

    return () => {
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />;
}