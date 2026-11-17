import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CURIOSITY_QUESTIONS } from '../../data/curiosity';
import { getSubjectBySlug } from '../../data/subjects';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';
import { useLearningStore } from '../../stores/useLearningStore';

export const CuriosityQuestionsSection: React.FC = () => {
  const navigate = useLearningStore((s) => s.navigate);
  const prefersReduced = useReducedMotionPref();

  return (
    <section className="py-20 lg:py-28 bg-[#F5F4EF] border-b border-[#171C24]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 lg:mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5] mb-3">
            Inquiry Prompts
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-[#171C24] leading-[1.12] text-balance">
            One question. A thousand discoveries.
          </h2>
          <p className="mt-3.5 text-base text-[#4B5360] leading-relaxed">
            Every scientific breakthrough began with someone asking why. Pick a question
            to step straight into the subject behind it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CURIOSITY_QUESTIONS.map((item, idx) => {
            const targetSubject = getSubjectBySlug(item.subjectSlug);
            const href = `/subjects/${item.subjectSlug}#${item.targetModuleCode}`;

            return (
              <motion.div
                key={item.id}
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({
                      type: 'subject',
                      slug: item.subjectSlug,
                      highlightModuleCode: item.targetModuleCode,
                    });
                  }}
                  className="group block h-full rounded-xl bg-[#FAF9F5] border border-[#171C24]/12 hover:border-[#5578F5]/65 p-6 sm:p-7 transition-all duration-200 hover:shadow-[0_12px_30px_-16px_rgba(23,28,36,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]"
                >
                  <div className="flex flex-col justify-between h-full gap-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[#5578F5]">
                          {targetSubject?.shortTitle ?? item.subjectSlug} · {item.conceptLabel}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[#555D6B] group-hover:text-[#5578F5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#171C24] group-hover:text-[#5578F5] transition-colors">
                        {item.question}
                      </h3>

                      <p className="text-sm text-[#4B5360] leading-relaxed">
                        {item.teaser}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#171C24]/10 text-xs font-medium text-[#171C24] group-hover:text-[#5578F5] transition-colors">
                      Explore inside {targetSubject?.shortTitle}
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
