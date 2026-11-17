import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';

export const PhysicsHeroVisual: React.FC = () => {
  const prefersReduced = useReducedMotionPref();
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setPointerOffset({ x: nx * 14, y: ny * 14 });
  };

  const handleMouseLeave = () => {
    setPointerOffset({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl overflow-hidden bg-[#ECEAE2] border border-[#171C24]/10 shadow-[0_20px_50px_-28px_rgba(23,28,36,0.22)]"
    >
      <div className="relative aspect-[4/3] bg-museum-grid overflow-hidden flex items-center justify-center">
        {/* Soft warm radial paper vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, rgba(250, 249, 245, 0.72) 0%, rgba(236, 234, 226, 0.3) 65%, rgba(23, 28, 36, 0.05) 100%)',
          }}
        />

        <svg
          viewBox="0 0 560 420"
          className="relative w-full h-full select-none"
          role="img"
          aria-label="Interactive physics diagram illustrating orbital motion, harmonic waves, pendulum swing, and prism light refraction"
        >
          <defs>
            <linearGradient id="physics-beam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#171C24" stopOpacity="0.65" />
              <stop offset="52%" stopColor="#5578F5" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#5578F5" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="physics-orb-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5578F5" />
              <stop offset="100%" stopColor="#2A44A8" />
            </linearGradient>
          </defs>

          {/* Reference axes & concentric scale rings */}
          <g opacity="0.22">
            <line x1="280" y1="36" x2="280" y2="384" stroke="#171C24" strokeWidth="1" strokeDasharray="3 4" />
            <line x1="60" y1="210" x2="500" y2="210" stroke="#171C24" strokeWidth="1" strokeDasharray="3 4" />
            <circle cx="280" cy="210" r="154" fill="none" stroke="#171C24" strokeWidth="1" />
            <circle cx="280" cy="210" r="108" fill="none" stroke="#171C24" strokeWidth="0.9" strokeDasharray="4 4" />
          </g>

          {/* Subtle pointer-responsive orbital plane */}
          <g
            style={{
              transform: `translate3d(${pointerOffset.x}px, ${pointerOffset.y}px, 0)`,
              transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Tilted Elliptical Orbit */}
            <g transform="rotate(-22 280 210)">
              <ellipse
                cx="280"
                cy="210"
                rx="186"
                ry="68"
                fill="none"
                stroke="#5578F5"
                strokeOpacity="0.55"
                strokeWidth="1.5"
              />
              <ellipse
                cx="280"
                cy="210"
                rx="142"
                ry="48"
                fill="none"
                stroke="#171C24"
                strokeOpacity="0.25"
                strokeWidth="1"
              />

              {/* Orbiting Body */}
              {prefersReduced ? (
                <g transform="translate(466 210)">
                  <circle r="7" fill="url(#physics-orb-fill)" />
                  <circle r="13" fill="none" stroke="#5578F5" strokeOpacity="0.35" strokeWidth="1" />
                </g>
              ) : (
                <motion.g
                  animate={{
                    x: [186, 0, -186, 0, 186],
                    y: [0, 68, 0, -68, 0],
                  }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <circle cx="280" cy="210" r="7" fill="url(#physics-orb-fill)" />
                  <circle cx="280" cy="210" r="13" fill="none" stroke="#5578F5" strokeOpacity="0.35" strokeWidth="1" />
                </motion.g>
              )}
            </g>

            {/* Optical Prism & Refracted Spectrum Rays */}
            <g transform="translate(0, 0)">
              {/* Incoming ray */}
              <line x1="74" y1="158" x2="246" y2="206" stroke="#171C24" strokeOpacity="0.6" strokeWidth="1.75" />
              {/* Refracted outgoing rays */}
              <line x1="312" y1="208" x2="486" y2="176" stroke="#5578F5" strokeOpacity="0.85" strokeWidth="1.75" />
              <line x1="312" y1="212" x2="486" y2="212" stroke="#5578F5" strokeOpacity="0.55" strokeWidth="1.4" />
              <line x1="312" y1="216" x2="486" y2="248" stroke="#171C24" strokeOpacity="0.45" strokeWidth="1.4" />

              {/* Geometric Prism Triangle */}
              <polygon
                points="280,148 334,242 226,242"
                fill="#FAF9F5"
                fillOpacity="0.88"
                stroke="#171C24"
                strokeWidth="1.75"
              />
              <polygon
                points="280,162 320,232 240,232"
                fill="#5578F5"
                fillOpacity="0.08"
              />
            </g>
          </g>

          {/* Harmonic Wave Trace at bottom */}
          <motion.path
            d="M 70 332 Q 122 294 175 332 T 280 332 T 385 332 T 490 332"
            fill="none"
            stroke="#5578F5"
            strokeWidth="1.75"
            strokeLinecap="round"
            animate={
              prefersReduced
                ? undefined
                : {
                    d: [
                      'M 70 332 Q 122 296 175 332 T 280 332 T 385 332 T 490 332',
                      'M 70 332 Q 122 368 175 332 T 280 332 T 385 332 T 490 332',
                      'M 70 332 Q 122 296 175 332 T 280 332 T 385 332 T 490 332',
                    ],
                  }
            }
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <path
            d="M 70 332 Q 122 356 175 332 T 280 332 T 385 332 T 490 332"
            fill="none"
            stroke="#171C24"
            strokeOpacity="0.22"
            strokeWidth="1.2"
          />

          {/* Suspended Pendulum Arc on upper right */}
          <g transform="translate(425, 42)">
            <circle cx="0" cy="0" r="3" fill="#171C24" />
            <path
              d="M -42 98 A 106 106 0 0 0 42 98"
              fill="none"
              stroke="#171C24"
              strokeOpacity="0.2"
              strokeDasharray="3 3"
              strokeWidth="1.2"
            />
            <motion.g
              style={{ transformOrigin: '0px 0px' }}
              animate={prefersReduced ? undefined : { rotate: [-18, 18, -18] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <line x1="0" y1="0" x2="0" y2="104" stroke="#171C24" strokeWidth="1.4" />
              <circle cx="0" cy="104" r="9" fill="#FAF9F5" stroke="#171C24" strokeWidth="1.6" />
              <circle cx="0" cy="104" r="3.5" fill="#5578F5" />
            </motion.g>
          </g>
        </svg>
      </div>

      <div className="px-5 py-3 bg-[#FAF9F5]/95 border-t border-[#171C24]/10 flex items-center justify-between text-xs text-[#555D6B]">
        <span>Fig. 01 · Motion, Waves, Fields &amp; Light</span>
        <span className="font-mono text-[11px] text-[#5578F5]">
          8 Core Topics
        </span>
      </div>
    </div>
  );
};
