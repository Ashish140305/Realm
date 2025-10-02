// src/components/overview/CommandPalette.jsx
import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FiSearch } from 'react-icons/fi';
import '../../styles/CommandPalette.css';

export default function CommandPalette({ isOpen, onClose }) {
  const containerRef = useRef(null);
  const paletteRef = useRef(null);
  const inputRef = useRef(null);

  useGSAP(() => {
    // This simplified logic now works correctly because the parent page is no longer interfering.
    if (isOpen) {
      gsap.to(containerRef.current, { autoAlpha: 1, duration: 0.2 });
      gsap.fromTo(
        paletteRef.current,
        { scale: 0.95, y: -20 },
        {
          scale: 1,
          y: 0,
          duration: 0.25,
          ease: 'power3.out',
          onComplete: () => {
            inputRef.current?.focus();
          }
        }
      );
    } else {
      gsap.to(paletteRef.current, {
        scale: 0.95,
        y: -20,
        duration: 0.25,
        ease: 'power3.in',
        onComplete: () => {
          gsap.to(containerRef.current, { autoAlpha: 0, duration: 0.1 });
        }
      });
    }
  }, { dependencies: [isOpen], scope: containerRef });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div ref={containerRef} className="command-palette-container" style={{ visibility: 'hidden' }}>
      <div className="command-palette-backdrop" onClick={onClose}></div>
      <div ref={paletteRef} className="command-palette-modal">
        <div className="palette-search-bar">
          <FiSearch />
          <input ref={inputRef} type="text" placeholder="Type a command or search..." />
        </div>
        <div className="palette-results">
          <p>No results found</p>
        </div>
      </div>
    </div>
  );
}