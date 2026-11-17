import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';

interface CapabilityItem {
  index: string;
  title: string;
  description: string;
  schematic: React.ReactNode;
}

const CAPABILITIES: CapabilityItem[] = [
  {
    index: '01',
    title: 'Interactive scientific visualizations',
    description:
      'Spatial models that render physical forces, molecular geometry, and biological structures with museum-grade clarity.',
    schematic: (
      <svg viewBox="0 0 160 64" className="w-full h-14" aria-hidden="true">
        <circle cx="48" cy="32" r="20" fill="none" stroke="#5578F5" strokeOpacity="0.55" strokeWidth="1.2" />
        <ellipse cx="48" cy="32" rx="34" ry="11" fill="none" stroke="#94A3B8" strokeOpacity="0.35" strokeWidth="1" transform="rotate(-18 48 32)" />
        <circle cx="48" cy="32" r="4" fill="#5578F5" />
        <circle cx="77" cy="24" r="2.5" fill="#E2E8F0" />
      </svg>
    ),
  },
  {
    index: '02',
    title: 'Animated concept explanations',
    description:
      'Step-by-step visual narratives that reveal how invisible mechanisms unfold across time and scale.',
    schematic: (
      <svg viewBox="0 0 160 64" className="w-full h-14" aria-hidden="true">
        <path d="M 16 44 C 40 12, 68 52, 92 20 S 132 42, 148 22" fill="none" stroke="#5578F5" strokeWidth="1.5" />
        <circle cx="46" cy="28" r="3" fill="#E2E8F0" />
        <circle cx="92" cy="20" r="3" fill="#5578F5" />
        <circle cx="130" cy="34" r="3" fill="#E2E8F0" />
      </svg>
    ),
  },
  {
    index: '03',
    title: 'Real-time measurements',
    description:
      'Precision readouts calibrated to physical units so learners observe exact quantitative relationships as conditions shift.',
    schematic: (
      <svg viewBox="0 0 160 64" className="w-full h-14" aria-hidden="true">
        <line x1="18" y1="42" x2="142" y2="42" stroke="#475569" strokeWidth="1.2" />
        {[24, 40, 56, 72, 88, 104, 120, 136].map((x, idx) => (
          <line
            key={x}
            x1={x}
            y1={idx % 2 === 0 ? 30 : 35}
            x2={x}
            y2="42"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />
        ))}
        <polygon points="88,20 84,28 92,28" fill="#5578F5" />
      </svg>
    ),
  },
  {
    index: '04',
    title: 'Dynamic scientific graphs',
    description:
      'Coordinated coordinate plots, phase diagrams, and distributions designed for intuitive pattern recognition.',
    schematic: (
      <svg viewBox="0 0 160 64" className="w-full h-14" aria-hidden="true">
        <line x1="20" y1="12" x2="20" y2="52" stroke="#475569" strokeWidth="1.2" />
        <line x1="20" y1="52" x2="144" y2="52" stroke="#475569" strokeWidth="1.2" />
        <path d="M 24 48 Q 58 46, 82 28 T 140 16" fill="none" stroke="#5578F5" strokeWidth="1.6" />
        <path d="M 24 22 Q 66 26, 98 38 T 140 46" fill="none" stroke="#94A3B8" strokeOpacity="0.5" strokeDasharray="3 3" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    index: '05',
    title: 'Guided practical learning',
    description:
      'Structured inquiry pathways within each subject that encourage prediction, observation, and reflection.',
    schematic: (
      <svg viewBox="0 0 160 64" className="w-full h-14" aria-hidden="true">
        <rect x="20" y="16" width="28" height="32" rx="4" fill="none" stroke="#475569" strokeWidth="1.2" />
        <rect x="66" y="16" width="28" height="32" rx="4" fill="none" stroke="#5578F5" strokeWidth="1.4" />
        <rect x="112" y="16" width="28" height="32" rx="4" fill="none" stroke="#475569" strokeWidth="1.2" />
        <line x1="48" y1="32" x2="66" y2="32" stroke="#94A3B8" strokeWidth="1.2" />
        <line x1="94" y1="32" x2="112" y2="32" stroke="#5578F5" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    index: '06',
    title: 'Advanced scientific analysis',
    description:
      'Tools for comparing trials, evaluating mathematical models, and connecting empirical data to core principles.',
    schematic: (
      <svg viewBox="0 0 160 64" className="w-full h-14" aria-hidden="true">
        <rect x="24" y="34" width="14" height="16" fill="#475569" fillOpacity="0.6" />
        <rect x="46" y="24" width="14" height="26" fill="#5578F5" fillOpacity="0.7" />
        <rect x="68" y="16" width="14" height="34" fill="#5578F5" />
        <rect x="90" y="28" width="14" height="22" fill="#475569" fillOpacity="0.6" />
        <rect x="112" y="20" width="14" height="30" fill="#94A3B8" fillOpacity="0.5" />
      </svg>
    ),
  },
];

export const PlatformCapabilitiesSection: React.FC = () => {
  const prefersReduced = useReducedMotionPref();

  return (
    <section className="py-20 lg:py-28 bg-[#101827] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14 items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5] mb-3">
              Platform Capabilities
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-white leading-[1.12] text-balance">
              Complex concepts. Made understandable.
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-base text-slate-300 leading-relaxed">
              Inside every subject journey, LABVERSE brings together visual clarity,
              precision measurement, and analytical depth to illuminate how the natural
              world works.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES.map((cap, idx) => (
            <motion.div
              key={cap.index}
              initial={prefersReduced ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.4,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-xl bg-[#151F32] border border-slate-800/90 p-6 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="rounded-lg bg-[#0D1422] border border-slate-800 px-3 py-2">
                  {cap.schematic}
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[11px] text-[#5578F5]">
                    {cap.index}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
