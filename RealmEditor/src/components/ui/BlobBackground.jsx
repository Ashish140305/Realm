// src/components/ui/BlobBackground.jsx
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

const blobPaths = [
  "M37.5,50.5Q28,68,26.5,75Q25,82,14.5,86Q4,90,13.5,96Q23,102,40,99.5Q57,97,63.5,88Q70,79,74,64.5Q78,50,68.5,41Q59,32,45,35.5Q31,39,37.5,50.5Z",
  "M37.5,50.5Q27,62,21.5,70.5Q16,79,16.5,88Q17,97,32,98Q47,99,57.5,91Q68,83,73,66.5Q78,50,70,36.5Q62,23,49.5,23.5Q37,24,37.5,50.5Z",
  "M37.5,50.5Q26,62,24,71.5Q22,81,19,90Q16,99,28,99.5Q40,100,53,92.5Q66,85,73,67.5Q80,50,69,37.5Q58,25,48.5,23Q39,21,37.5,50.5Z",
  "M37.5,50.5Q28,65,22.5,73Q17,81,16,87Q15,93,25,99Q35,105,48,97.5Q61,90,69,72Q77,54,72,39.5Q67,25,50,22.5Q33,20,37.5,50.5Z"
];

export default function BlobBackground() {
  const blobRef = useRef(null);

  useGSAP(() => {
    let i = 0;
    const animate = () => {
      i = (i + 1) % blobPaths.length;
      gsap.to(blobRef.current, {
        duration: 8,
        attr: { d: blobPaths[i] },
        ease: "power1.inOut",
        onComplete: animate
      });
    };
    animate();
  }, { scope: blobRef });

  return (
    <div className="blob-background-wrapper">
      <svg className="blob-svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.4)" />
          </linearGradient>
        </defs>
        <path
          ref={blobRef}
          fill="url(#blobGradient)"
          d={blobPaths[0]}
          opacity="0.6"
        />
      </svg>
    </div>
  );
}