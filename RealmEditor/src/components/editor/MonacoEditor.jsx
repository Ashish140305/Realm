import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

export function MonacoEditor({
  content,
  onChange,
  language,
  onCursorChange,
  collaborators,
  theme,
}) {
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const textareaRef = useRef(null);

  const highlightCode = (code) => {
    const keywords = /\b(import|export|const|let|var|function|return|if|else|for|while|class|interface|type|extends|implements|async|await|try|catch|throw|new)\b/g;
    const strings = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    const numbers = /\b(\d+)\b/g;
    const functions = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g;

    let highlighted = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    highlighted = highlighted
      .replace(comments, '<span class="token-comment">$1</span>')
      .replace(strings, '<span class="token-string">$1</span>')
      .replace(keywords, '<span class="token-keyword">$1</span>')
      .replace(numbers, '<span class="token-number">$1</span>')
      .replace(functions, '<span class="token-function">$1</span>');

    return highlighted;
  };

  const lines = content.split("\n");

  const handleTextareaChange = (e) => {
    onChange(e.target.value);
    updateCursorPosition();
  };

  const updateCursorPosition = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const position = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, position);
      const lines = textBeforeCursor.split("\n");
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      setCursorPosition({ line, column });
      onCursorChange(line, column);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.addEventListener("click", updateCursorPosition);
      textareaRef.current.addEventListener("keyup", updateCursorPosition);
    }
    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener("click", updateCursorPosition);
        textareaRef.current.removeEventListener("keyup", updateCursorPosition);
      }
    };
  }, []);

  return (
    <div className="relative h-full flex">
      {/* Line numbers */}
      <div
        className={`select-none border-r ${
          theme === "dark"
            ? "bg-[#1e1e1e] border-[#2d2d2d] text-[#858585]"
            : "bg-[#f5f5f5] border-[#e5e5e5] text-[#6e7781]"
        }`}
        style={{ width: "50px", padding: "16px 8px" }}
      >
        {lines.map((_, i) => (
          <div
            key={i}
            className="font-mono h-[19px] text-right pr-2"
            style={{ fontSize: "13px" }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Editor area */}
      <div className="flex-1 relative">
        <ScrollArea className="h-full">
          <div className="relative p-4">
            {/* Syntax highlighted display */}
            <pre
              className="font-mono pointer-events-none absolute inset-4"
              style={{ fontSize: "13px", lineHeight: "19px" }}
            >
              {lines.map((line, i) => (
                <div key={i} className="h-[19px]">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(line) || " ",
                    }}
                  />
                </div>
              ))}
            </pre>

            {/* Collaborative cursors */}
            {collaborators.map((cursor) => (
              <div
                key={cursor.userId}
                className="absolute pointer-events-none"
                style={{
                  top: `${(cursor.line - 1) * 19}px`,
                  left: `${cursor.column * 7.2}px`,
                }}
              >
                <div
                  className="w-0.5 h-[19px] animate-pulse"
                  style={{ backgroundColor: cursor.color }}
                />
                {cursor.isTyping && (
                  <div
                    className="absolute top-0 left-2 px-2 py-1 rounded text-white whitespace-nowrap shadow-lg"
                    style={{
                      backgroundColor: cursor.color,
                      fontSize: "11px",
                    }}
                  >
                    {cursor.userName} is typing...
                  </div>
                )}
              </div>
            ))}

            {/* Actual textarea for input */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextareaChange}
              className="font-mono w-full bg-transparent text-transparent caret-primary outline-none resize-none"
              style={{
                fontSize: "13px",
                lineHeight: "19px",
                caretColor: theme === "dark" ? "#fff" : "#000",
              }}
              spellCheck={false}
              rows={lines.length}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Minimap */}
      <div
        className={`w-24 border-l ${
          theme === "dark"
            ? "bg-[#1e1e1e] border-[#2d2d2d]"
            : "bg-[#f5f5f5] border-[#e5e5e5]"
        } overflow-hidden`}
      >
        <div className="p-2">
          <div
            className={`font-mono ${
              theme === "dark" ? "text-[#858585]" : "text-[#6e7781]"
            }`}
            style={{ fontSize: "2px", lineHeight: "3px", opacity: 0.6 }}
          >
            {lines.map((line, i) => (
              <div key={i}>{line.substring(0, 100)}</div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .token-keyword {
          color: ${theme === "dark" ? "#569cd6" : "#0000ff"};
        }
        .token-string {
          color: ${theme === "dark" ? "#ce9178" : "#a31515"};
        }
        .token-comment {
          color: ${theme === "dark" ? "#6a9955" : "#008000"};
          font-style: italic;
        }
        .token-number {
          color: ${theme === "dark" ? "#b5cea8" : "#098658"};
        }
        .token-function {
          color: ${theme === "dark" ? "#dcdcaa" : "#795e26"};
        }
      `}</style>
    </div>
  );
}