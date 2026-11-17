import React from 'react';
import { Compass, SlidersHorizontal, BookOpenCheck, LineChart } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

const STEPS = [
  {
    number: '01',
    title: 'Discover an experiment',
    description:
      'Browse curated computational models across six scientific domains. Filter by difficulty, curriculum topic, or mathematical formulation.',
    footer: 'Taxonomy Index Filtered',
    accent: '#93C5FD',
    icon: <Compass className="w-4 h-4" />,
  },
  {
    number: '02',
    title: 'Interact with the simulation',
    description:
      'Adjust physical constants, initial boundary conditions, and system vectors with calibrated instrument controls and immediate visual feedback.',
    footer: 'Calibrated Parameter Staging',
    accent: '#10B981',
    icon: <SlidersHorizontal className="w-4 h-4" />,
  },
  {
    number: '03',
    title: 'Understand the science',
    description:
      'Connect observable apparatus behavior directly to underlying equations, conservation laws, and guided conceptual checkpoints.',
    footer: 'Synchronized Mathematical Context',
    accent: '#22D3EE',
    icon: <BookOpenCheck className="w-4 h-4" />,
  },
  {
    number: '04',
    title: 'Analyze your results',
    description:
      'Inspect time series graphs, phase portraits, and frequency spectra, then export structured telemetry datasets to CSV for lab reports.',
    footer: 'CSV & Lab Notebook Ready',
    accent: '#F59E0B',
    icon: <LineChart className="w-4 h-4" />,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section
      id="how-it-works-section"
      className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#0B0F17]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          kicker="Methodology Architecture"
          title="How Scientific Discovery Works"
          subtitle="From formulating a testable hypothesis to rigorous quantitative analysis, our workflow mirrors modern laboratory inquiry."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-xl bg-[#101827] border border-slate-800/90 p-6 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-2xl font-bold tabular-nums"
                    style={{ color: step.accent }}
                  >
                    {step.number}
                  </span>
                  <span className="p-2 rounded-lg bg-[#131B29] border border-slate-800 text-slate-300">
                    {step.icon}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <span className="font-mono text-[11px]" style={{ color: step.accent }}>
                  {step.footer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
