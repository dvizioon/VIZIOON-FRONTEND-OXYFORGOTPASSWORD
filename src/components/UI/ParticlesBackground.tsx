import React, { useCallback } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';

export const ParticlesBackground = ({ 
  className = '',
  particleColor = '#ffffff',
  particleCount = 80,
  particleSpeed = 1,
  particleOpacity = 0.3,
  enableLinks = true,
  linkColor = '#ffffff',
  linkDistance = 150,
  linkOpacity = 0.3
}) => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    // console.log(container);
  }, []);

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      <Particles
        init={particlesInit}
        loaded={particlesLoaded}
        id="tsparticles"
        options={{
          background: {
            color: {
              value: "transparent",
            },

          },
          
          fullScreen: false,
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: false,
              },
              onHover: {
                enable: false,
              },
              resize: true,
            },
          },
          
          particles: {
            color: {
              value: particleColor,
            },
            links: {
              color: linkColor,
              distance: linkDistance,
              enable: enableLinks,
              opacity: linkOpacity,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: particleSpeed,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: particleCount,
            },
            opacity: {
              value: particleOpacity,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default ParticlesBackground;
