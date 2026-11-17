import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  getPhysicsTopicBySlug,
  PHYSICS_CURIOSITY_QUESTIONS,
} from '../../data/physicsTopics';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';
import { useLearningStore } from '../../stores/useLearningStore';
import { PhysicsTopicVisual } from './PhysicsTopicVisual';

export const PhysicsCuriositySection: React.FC = () => {
  const [activeQuestionId, setActiveQuestionId] = useState<string>(
    PHYSICS_CURIOSITY_QUESTIONS[0].id
  );
  const navigate = useLearningStore((s) => s.navigate);
  const prefersReduced = useReducedMotionPref();

  const activeQuestion =
    PHYSICS_CURIOSITY_QUESTIONS.find((q) => q.id === activeQuestionId) ??
    PHYSICS_CURIOSITY_QUESTIONS[0];
  const activeTopic = getPhysicsTopicBySlug(activeQuestion.topicSlug);

  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F5] border-b border-[#171C24]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3 mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]">
            Everyday Phenomena
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#171C24] text-balance">
            Discover What Physics Explains
          </h2>
          <p className="text-base text-[#4B5360] leading-relaxed">
            Every law of physics began with a simple, persistent question about the
            world around us. Select a question to preview the intuition behind it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Question Selector */}
          <div className="lg:col-span-6 space-y-3" role="tablist" aria-label="Physics curiosity questions">
            {PHYSICS_CURIOSITY_QUESTIONS.map((item, idx) => {
              const isSelected = item.id === activeQuestion.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveQuestionId(item.id)}
                  className={`w-full text-left rounded-xl border p-5 sm:p-6 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5] ${
                    isSelected
                      ? 'bg-white border-[#5578F5] shadow-[0_12px_28px_-22px_rgba(85,120,245,0.45)]'
                      : 'bg-[#F5F4EF] border-[#171C24]/10 hover:border-[#171C24]/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-[#5578F5]">
                        0{idx + 1} · {item.topicTitle}
                      </span>
                      <h3 className="font-display text-lg sm:text-xl font-semibold text-[#171C24]">
                        {item.question}
                      </h3>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected
                          ? 'text-[#5578F5] translate-x-0.5'
                          : 'text-[#646D7A]'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Intuition & Topic Connection Panel */}
          <motion.div
            key={activeQuestion.id}
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="tabpanel"
            className="lg:col-span-6 rounded-2xl bg-[#F5F4EF] border border-[#171C24]/12 p-6 sm:p-8 space-y-6"
          >
            {activeTopic && (
              <PhysicsTopicVisual motif={activeTopic.visualMotif} />
            )}

            <div className="space-y-3">
              <p className="text-xs font-mono text-[#5578F5]">
                Connected Topic · {activeQuestion.topicTitle}
              </p>
              <h3 className="font-display text-2xl font-semibold text-[#171C24]">
                {activeQuestion.question}
              </h3>
              <p className="text-base text-[#3D4450] leading-relaxed">
                {activeQuestion.shortAnswer}
              </p>
            </div>

            <div className="pt-4 border-t border-[#171C24]/10 space-y-4">
              <p className="text-sm text-[#4B5360]">
                <span className="font-medium text-[#171C24]">Core Principle: </span>
                {activeQuestion.principle}
              </p>

              <a
                href={`/subjects/physics/${activeQuestion.topicSlug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate({
                    type: 'subject-topic',
                    subjectSlug: 'physics',
                    topicSlug: activeQuestion.topicSlug,
                  });
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]/60"
              >
                <span>Explore {activeQuestion.topicTitle}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
