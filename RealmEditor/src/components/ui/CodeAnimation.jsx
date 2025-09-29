// src/components/ui/CodeAnimation.jsx
import React from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import './CodeAnimation.css';

export default function CodeAnimation() {
  const [text] = useTypewriter({
    words: [
      'public class Realm {\n  public static void main(String[] args) {\n    System.out.println("Collaborate in real-time...");\n  }\n}',
      'function workEfficiently() {\n  const realm = new CodeEditor();\n  realm.run();\n}',
      'const effective_solution = () => {\n  return "Build, test, and deploy together."\n};',
    ],
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 50,
  });

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="dot red"></div>
        <div className="dot yellow"></div>
        <div className="dot green"></div>
      </div>
      <div className="terminal-body">
        <pre>
          <code>{text}</code>
          <Cursor cursorStyle='_' />
        </pre>
      </div>
    </div>
  );
}