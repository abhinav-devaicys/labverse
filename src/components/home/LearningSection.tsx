import React from 'react';
import { BookOpen, Activity, Globe2, ArrowRight } from 'lucide-react';
import { useLabStore } from '../../stores/useLabStore';
import { Button } from '../ui/Button';
import { TelemetryDeck } from './TelemetryDeck';

const LEARNING_PILLARS = [
  {
    icon: <BookOpen className="w-4 h-4 text-[#10B981]" />,
    title: 'Guided Experiments & Lab Notebooks',
    description:
      'Structured inquiry prompts align with AP Physics, IB Science, and university introductory syllabi so learners form testable hypotheses before running trials.',
  },
  {
    icon: <Activity className="w-4 h-4 text-[#5578F5]" />,
    title: 'Scientific Graphs & Quantitative Analysis',
    description:
      'Inspect time-domain curves, phase portraits, and frequency spectra side-by-side with experimental error bounds and exportable CSV datasets.',
  },
  {
    icon: <Globe2 className="w-4 h-4 text-[#22D3EE]" />,
    title: 'Real-World Applications',
    description:
      'Connect idealized equations directly to physical engineering—from seismometer damping and RC biomedical filters to optical interferometry.',
  },
];

export const LearningSection: React.FC = () => {
  const setLearningModalOpen = useLabStore((s) => s.setLearningModalOpen);

  return (
    <section className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#0B0F17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Learning Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#10B981] mb-2.5">
                Educational Integration
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white text-balance">
                Guided Notebooks &amp; Hypothesis Testing
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
                LABVERSE pairs each experiment with structured scientific prompts.
                Students don&apos;t just move sliders—they form hypotheses, run controlled
                trials, and interpret quantitative graphs.
              </p>
            </div>

            <div className="space-y-3">
              {LEARNING_PILLARS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl bg-[#101827] border border-slate-800/90 p-4 flex items-start gap-3.5"
                >
                  <div className="p-2 rounded-lg bg-[#131B29] border border-slate-800 shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="blue"
              size="md"
              onClick={() => setLearningModalOpen(true)}
            >
              <span>Explore Guided Learning Modules</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Right Scientific Visualization Deck */}
          <div className="lg:col-span-7">
            <TelemetryDeck />
          </div>
        </div>
      </div>
    </section>
  );
};
