// import React from 'react';
// import Editor from '@monaco-editor/react';

// const CodeEditor = () => {
//     return (
//         <Editor
//             height="90vh"
//             width="150vh"
//             defaultLanguage="javascript"
//             defaultValue="// Start coding here..."
//             theme="vs-dark"
//         />
//     );
// };

// export default CodeEditor;
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const CodeEditor = () => {
    const [code, setCode] = useState('// Write your code here');
    const [output, setOutput] = useState('');
    const [languageId, setLanguageId] = useState(63); // 63 = JavaScript (Node.js)

    const handleRun = async () => {
        setOutput('Running...');
        try {
            const { data: tokenData } = await axios.post(
                'https://judge0-ce.p.rapidapi.com/submissions',
                {
                    source_code: code,
                    language_id: languageId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': 'bb7456a644msh812a35c982b8328p198ce5jsneddb2f3f373a',
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    },
                }
            );

            const token = tokenData.token;

            // Wait for result
            setTimeout(async () => {
                const { data: result } = await axios.get(
                    `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
                    {
                        headers: {
                            'X-RapidAPI-Key': 'bb7456a644msh812a35c982b8328p198ce5jsneddb2f3f373a',
                            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                        },
                    }
                );

                if (result.stdout) {
                    setOutput(result.stdout);
                } else if (result.stderr) {
                    setOutput(result.stderr);
                } else if (result.compile_output) {
                    setOutput(result.compile_output);
                } else {
                    setOutput('No output.');
                }
            }, 2000);
        } catch (err) {
            console.error(err);
            setOutput('Error compiling code.');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', padding: '10px', gap: '10px' }}>
                <button onClick={handleRun}>▶️ Run Code</button>
                <select onChange={(e) => setLanguageId(Number(e.target.value))}>
                    <option value={63}>JavaScript</option>
                    <option value={62}>Java</option>
                    <option value={71}>Python (3)</option>
                    <option value={54}>C++</option>
                    <option value={50}>C</option>
                </select>
            </div>

            <Editor
                height="400px"
                width="800px"
                defaultLanguage="javascript"
                defaultValue={code}
                theme="vs-dark"
                onChange={(value) => setCode(value)}
            />

            <div style={{ padding: '10px', background: '#222', color: 'white' }}>
                <h4>Output:</h4>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;
