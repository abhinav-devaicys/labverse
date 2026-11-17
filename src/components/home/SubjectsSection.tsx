import React from 'react';
import {
  Atom,
  FlaskConical,
  Dna,
  Sigma,
  Globe,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { SUBJECT_LIST } from '../../registry/subjectRegistry';
import { useLabStore } from '../../stores/useLabStore';
import type { SubjectId } from '../../types/simulation';
import { SectionHeading } from '../ui/SectionHeading';

const SUBJECT_ICONS: Record<SubjectId, React.ReactNode> = {
  physics: <Atom className="w-4 h-4" />,
  chemistry: <FlaskConical className="w-4 h-4" />,
  biology: <Dna className="w-4 h-4" />,
  mathematics: <Sigma className="w-4 h-4" />,
  'earth-space': <Globe className="w-4 h-4" />,
  engineering: <Cpu className="w-4 h-4" />,
};

export const SubjectsSection: React.FC = () => {
  const setSubjectFilter = useLabStore((s) => s.setSubjectFilter);
  const navigateTo = useLabStore((s) => s.navigateTo);

  const handleOpenSubject = (subjectId: SubjectId) => {
    setSubjectFilter(subjectId);
    navigateTo('explore');
  };

  return (
    <section
      id="subjects-section"
      className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#0B0F17]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Scientific Taxonomy"
          title="Explore by Subject"
          subtitle="Each scientific domain features interactive experiment previews grounded in fundamental mathematical formulations."
          rightSlot={
            <button
              type="button"
              onClick={() => {
                setSubjectFilter('all');
                navigateTo('explore');
              }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#22D3EE] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>View Full Catalog Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUBJECT_LIST.map((subject) => (
            <button
              key={subject.id}
              type="button"
              onClick={() => handleOpenSubject(subject.id)}
              className="group text-left rounded-xl bg-[#101827] border border-slate-800/90 hover:border-slate-600 p-6 transition-all duration-150 flex flex-col justify-between gap-5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="w-9 h-9 rounded-lg bg-[#131B29] border border-slate-800 flex items-center justify-center"
                    style={{ color: subject.accentColor }}
                  >
                    {SUBJECT_ICONS[subject.id]}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 tabular-nums">
                    {subject.simulationCount} Sims
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl font-semibold text-white group-hover:text-[#93C5FD] transition-colors">
                    {subject.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {subject.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <code className="font-mono text-[11px] text-slate-400 truncate">
                  {subject.formula}
                </code>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
