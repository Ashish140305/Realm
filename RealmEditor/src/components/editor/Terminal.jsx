import React, { useEffect, useImperativeHandle } from 'react';
import { Terminal as XtermTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const Terminal = React.forwardRef((props, ref) => {
    const terminalRef = React.useRef(null);
    const term = React.useRef(null);

    useImperativeHandle(ref, () => ({
        writeln: (text) => {
            if (term.current) {
                term.current.writeln(text);
            }
        }
    }));

    useEffect(() => {
        if (!terminalRef.current || terminalRef.current.children.length > 0) {
            return;
        }

        term.current = new XtermTerminal({
            cursorBlink: true,
            theme: {
                background: '#202124',
                foreground: '#d4d4d4',
            },
            fontFamily: 'monospace',
        });

        const fitAddon = new FitAddon();
        term.current.loadAddon(fitAddon);
        term.current.open(terminalRef.current);
        fitAddon.fit();
        term.current.write('Welcome to Realm Terminal!\r\n$ ');

        term.current.onData(data => {
            term.current.write(data);
        });

        return () => {
            if (term.current) {
                term.current.dispose();
            }
        };
    }, []);

    return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />;
});

export default Terminal;