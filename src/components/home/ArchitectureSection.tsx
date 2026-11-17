import React from 'react';
import { Code2, Database, Share2 } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

const ARCHITECTURE_CARDS = [
  {
    icon: <Code2 className="w-4 h-4 text-[#5578F5]" />,
    title: 'Typed Simulation Registry',
    code: `interface SimulationModule {\n  readonly id: string;\n  equation: string;\n  parameters: SimulationParameter[];\n  status: 'preview' | 'staged' | 'active';\n}`,
    caption: 'Strict TypeScript contracts across every scientific module',
  },
  {
    icon: <Database className="w-4 h-4 text-[#10B981]" />,
    title: 'Zustand Workbench Store',
    code: `const useLabStore = create((set) => ({\n  stagedSimulationId: 'pendulum-motion',\n  previewParamsBySim: {},\n  stageSimulation: (id) => set({ id }),\n}));`,
    caption: 'Decoupled simulation state, bookmarks, and notebook persistence',
  },
  {
    icon: <Share2 className="w-4 h-4 text-[#F59E0B]" />,
    title: 'URL Param State Encoding',
    code: `labverse.app/?sim=pendulum-motion\n  &length=1.20\n  &gravity=9.81\n  &damping=0.04`,
    caption: 'Reproducible parameter configurations for classroom sharing',
  },
];

export const ArchitectureSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#0B0F17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Core Architecture"
          title="Engineered for Precision & Extensibility"
          subtitle="Built with modular React components, typed simulation registries, Zustand state stores, and Recharts scientific visualizations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {ARCHITECTURE_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-xl bg-[#101827] border border-slate-800/90 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-[#131B29] border border-slate-800">
                    {card.icon}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                </div>

                <pre className="rounded-lg bg-[#080C14] border border-slate-800/90 p-3.5 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300">
                  <code>{card.code}</code>
                </pre>
              </div>

              <p className="text-xs text-slate-400">{card.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
