// src/components/ui/ParticleBackground.jsx

import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // This is the new, more vibrant configuration object
  const options = {
    background: {
      color: {
        value: '#111827', // A darker, richer background
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'grab', // 'grab' creates a connecting line to the cursor
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 0.5,
          },
        },
      },
    },
    particles: {
      // A vibrant, multi-color palette
      color: {
        value: ['#6D28D9', '#EC4899', '#FBBF24', '#10B981', '#3B82F6'],
      },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: true,
        opacity: 0.1, // Thinner, more subtle links
        width: 1,
      },
      collisions: {
        enable: false, // Particles will pass through each other
      },
      move: {
        direction: 'top', // Particles will float upwards
        enable: true,
        outModes: {
          default: 'out', // Particles will disappear off the top of the screen
        },
        random: true, // Movement is more random
        speed: 1.5,     // Slightly faster speed
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50, // A few less particles for a cleaner look
      },
      opacity: {
        value: 0.6, // More visible particles
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 2, max: 6 }, // A wider range of sizes
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}