export const getLanguageFromExtension = (filename) => {
    const extension = filename.split('.').pop();
    switch (extension) {
        case 'js':
            return 'javascript';
        case 'jsx':
            return 'javascript';
        case 'ts':
            return 'typescript';
        case 'tsx':
            return 'typescript';
        case 'py':
            return 'python';
        case 'java':
            return 'java';
        case 'c':
            return 'c';
        case 'cpp':
            return 'cpp';
        case 'cs':
            return 'csharp';
        case 'go':
            return 'go';
        case 'html':
            return 'html';
        case 'css':
            return 'css';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        case 'php':
            return 'php';
        case 'rb':
            return 'ruby';
        case 'rs':
            return 'rust';
        case 'swift':
            return 'swift';
        case 'xml':
            return 'xml';
        default:
            return 'plaintext';
    }
};