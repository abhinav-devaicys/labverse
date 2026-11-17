import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SCIENCE_EVERYWHERE_ITEMS } from '../../data/curiosity';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';
import { useLearningStore } from '../../stores/useLearningStore';

export const ScienceEverywhereSection: React.FC = () => {
  const navigate = useLearningStore((s) => s.navigate);
  const prefersReduced = useReducedMotionPref();

  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F5] border-b border-[#171C24]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Sticky Editorial Lead Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]">
              Connected Perspectives
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-[#171C24] leading-[1.1] text-balance">
              Science is everywhere.
            </h2>
            <p className="text-base text-[#4B5360] leading-relaxed">
              The principles studied inside physics, chemistry, biology, and mathematics
              do not stay inside textbooks. They connect the smallest molecular bond to
              everyday technology, living ecosystems, and cosmic motion.
            </p>

            {/* Minimal Scientific Scale Diagram */}
            <div className="rounded-xl bg-[#F5F4EF] border border-[#171C24]/10 p-5 space-y-3">
              <svg viewBox="0 0 300 110" className="w-full h-24" aria-hidden="true">
                <line x1="20" y1="88" x2="280" y2="88" stroke="#171C24" strokeOpacity="0.2" strokeWidth="1" />
                <circle cx="52" cy="54" r="14" fill="none" stroke="#5578F5" strokeWidth="1.4" />
                <circle cx="52" cy="54" r="3" fill="#5578F5" />
                <circle cx="118" cy="54" r="20" fill="none" stroke="#171C24" strokeOpacity="0.35" strokeDasharray="3 3" />
                <circle cx="118" cy="54" r="6" fill="#171C24" />
                <circle cx="188" cy="54" r="24" fill="none" stroke="#5578F5" strokeOpacity="0.55" strokeWidth="1.2" />
                <circle cx="252" cy="54" r="28" fill="none" stroke="#171C24" strokeOpacity="0.22" strokeWidth="1.2" />
                <circle cx="252" cy="54" r="9" fill="#5578F5" fillOpacity="0.85" />
              </svg>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#555D6B]">
                <span>10⁻¹⁰ m · Atomic</span>
                <span>10⁰ m · Everyday</span>
                <span>10²¹ m · Galactic</span>
              </div>
            </div>
          </div>

          {/* Scrolling Thematic Essays Column */}
          <div className="lg:col-span-7 space-y-5">
            {SCIENCE_EVERYWHERE_ITEMS.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-xl bg-[#F5F4EF] border border-[#171C24]/12 p-6 sm:p-8 space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#5578F5]">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs text-[#646D7A]">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#171C24]">
                  {item.headline}
                </h3>

                <p className="text-sm sm:text-base text-[#4B5360] leading-relaxed">
                  {item.summary}
                </p>

                <p className="text-xs text-[#5E6673]">
                  {item.examples.join(' · ')}
                </p>

                <div className="pt-3 border-t border-[#171C24]/10">
                  <a
                    href={`/subjects/${item.linkedSubject}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate({ type: 'subject', slug: item.linkedSubject });
                    }}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#171C24] hover:text-[#5578F5] transition-colors"
                  >
                    <span>Explore {item.linkedSubjectLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
