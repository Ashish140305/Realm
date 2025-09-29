// src/components/ui/SubtleParticleBackground.jsx
import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

export default function SubtleParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = {
    background: {
      color: {
        value: '#ffffff', // White background
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: '#d1d5db', // Light grey particles
      },
      links: {
        color: '#d1d5db',
        distance: 200,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: true,
        speed: 0.5, // Much slower
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 1200, // Much less dense
        },
        value: 30, // Far fewer particles
      },
      opacity: {
        value: 0.4,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles-subtle"
      init={particlesInit}
      options={options}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}