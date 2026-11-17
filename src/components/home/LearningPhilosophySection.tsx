import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';

const PHILOSOPHY_STAGES = [
  {
    number: '01',
    title: 'Discover',
    description: 'Choose what you want to understand.',
    detail:
      'Enter through a scientific discipline that sparks your curiosity—from mechanics and light to living cells and planetary motion.',
    diagram: (
      <svg viewBox="0 0 120 72" className="w-28 h-16" aria-hidden="true">
        <circle cx="60" cy="36" r="22" fill="none" stroke="#171C24" strokeOpacity="0.2" strokeWidth="1.2" />
        <circle cx="60" cy="36" r="10" fill="none" stroke="#5578F5" strokeWidth="1.5" />
        <line x1="60" y1="8" x2="60" y2="64" stroke="#171C24" strokeOpacity="0.18" strokeDasharray="2 3" />
        <line x1="22" y1="36" x2="98" y2="36" stroke="#171C24" strokeOpacity="0.18" strokeDasharray="2 3" />
        <circle cx="76" cy="24" r="3" fill="#5578F5" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Visualize',
    description: 'See scientific concepts represented visually.',
    detail:
      'Abstract equations become clear spatial structures, vector fields, molecular bonds, and geometric transformations.',
    diagram: (
      <svg viewBox="0 0 120 72" className="w-28 h-16" aria-hidden="true">
        <path
          d="M 14 48 Q 38 12, 60 36 T 106 24"
          fill="none"
          stroke="#5578F5"
          strokeWidth="1.75"
        />
        <path
          d="M 14 36 Q 38 58, 60 36 T 106 48"
          fill="none"
          stroke="#171C24"
          strokeOpacity="0.3"
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />
        <circle cx="60" cy="36" r="3.5" fill="#171C24" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Interact',
    description: 'Change variables and explore what happens.',
    detail:
      'Form a question, vary physical parameters inside dedicated subject environments, and observe how systems respond.',
    diagram: (
      <svg viewBox="0 0 120 72" className="w-28 h-16" aria-hidden="true">
        <line x1="20" y1="24" x2="100" y2="24" stroke="#171C24" strokeOpacity="0.2" strokeWidth="1.5" />
        <circle cx="48" cy="24" r="4.5" fill="#5578F5" />
        <line x1="20" y1="48" x2="100" y2="48" stroke="#171C24" strokeOpacity="0.2" strokeWidth="1.5" />
        <circle cx="78" cy="48" r="4.5" fill="#171C24" />
        <path d="M 48 29 L 78 43" stroke="#5578F5" strokeOpacity="0.45" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Understand',
    description: 'Analyze results and connect them to scientific principles.',
    detail:
      'Bridge visual intuition with quantitative reasoning so every observation anchors lasting scientific comprehension.',
    diagram: (
      <svg viewBox="0 0 120 72" className="w-28 h-16" aria-hidden="true">
        <rect x="20" y="14" width="80" height="44" fill="none" stroke="#171C24" strokeOpacity="0.18" strokeWidth="1.2" />
        <polyline
          points="26,50 44,44 62,32 80,22 94,18"
          fill="none"
          stroke="#5578F5"
          strokeWidth="1.75"
        />
        <circle cx="94" cy="18" r="3" fill="#5578F5" />
      </svg>
    ),
  },
];

export const LearningPhilosophySection: React.FC = () => {
  const prefersReduced = useReducedMotionPref();

  return (
    <section
      id="philosophy-section"
      className="py-20 lg:py-28 bg-[#FAF9F5] border-b border-[#171C24]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14 items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5] mb-3">
              How Learning Unfolds
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-[#171C24] leading-[1.12] text-balance">
              Don&apos;t just read science. Experience it.
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-base text-[#4B5360] leading-relaxed">
              Every subject journey on LABVERSE guides learners from open curiosity to
              grounded conceptual understanding in four deliberate stages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#171C24]/12">
          {PHILOSOPHY_STAGES.map((stage, idx) => (
            <motion.div
              key={stage.number}
              initial={prefersReduced ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.4,
                delay: idx * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="p-7 border-r border-b border-[#171C24]/12 bg-[#FAF9F5] flex flex-col justify-between gap-8"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-[#5578F5]">
                    {stage.number}
                  </span>
                  {stage.diagram}
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-xl font-semibold text-[#171C24]">
                    {stage.title}
                  </h3>
                  <p className="text-sm font-medium text-[#171C24]">
                    {stage.description}
                  </p>
                  <p className="text-sm text-[#555D6B] leading-relaxed pt-1">
                    {stage.detail}
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
