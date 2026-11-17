import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PHYSICS_LEARNING_STEPS } from '../../data/physicsTopics';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';

export const PhysicsLearningJourney: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReduced = useReducedMotionPref();
  const activeStep = PHYSICS_LEARNING_STEPS[activeIndex];

  return (
    <section className="py-20 lg:py-28 bg-[#F5F4EF] border-b border-[#171C24]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]">
            How You&apos;ll Learn
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#171C24] text-balance">
            From first observation to deep physical mastery.
          </h2>
          <p className="text-base text-[#4B5360] leading-relaxed">
            Every Physics topic on LABVERSE follows a clear, five-stage progression
            designed to turn intuition into lasting scientific understanding.
          </p>
        </div>

        {/* 5-Stage Interactive Progression */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PHYSICS_LEARNING_STEPS.map((step, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={step.stage}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`text-left rounded-xl border p-5 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5] ${
                  isActive
                    ? 'bg-[#FAF9F5] border-[#5578F5] shadow-[0_12px_24px_-20px_rgba(85,120,245,0.45)]'
                    : 'bg-[#FAF9F5]/65 border-[#171C24]/10 hover:border-[#171C24]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-[#5578F5]">
                    {step.number}
                  </span>
                  {idx < PHYSICS_LEARNING_STEPS.length - 1 && (
                    <ArrowRight
                      className="hidden lg:block w-3.5 h-3.5 text-[#171C24]/25"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3
                  className={`font-display text-lg font-semibold transition-colors ${
                    isActive ? 'text-[#5578F5]' : 'text-[#171C24]'
                  }`}
                >
                  {step.stage}
                </h3>
                <p className="mt-1.5 text-xs text-[#555D6B] leading-relaxed">
                  {step.headline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Focused Stage Detail Band */}
        <motion.div
          key={activeStep.stage}
          initial={prefersReduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-[#FAF9F5] border border-[#171C24]/12 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-1.5 max-w-2xl">
            <p className="font-mono text-xs text-[#5578F5]">
              Stage {activeStep.number} · {activeStep.stage}
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#171C24]">
              {activeStep.headline}
            </h3>
            <p className="text-sm sm:text-base text-[#4B5360] leading-relaxed">
              {activeStep.detail}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#555D6B] shrink-0">
            <span>Discover</span>
            <span aria-hidden="true">→</span>
            <span>Understand</span>
            <span aria-hidden="true">→</span>
            <span>Experiment</span>
            <span aria-hidden="true">→</span>
            <span>Analyze</span>
            <span aria-hidden="true">→</span>
            <span>Master</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
