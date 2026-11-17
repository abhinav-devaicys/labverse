import React, { useMemo } from 'react';
import { Search, RotateCcw, FlaskConical } from 'lucide-react';
import { SUBJECT_LIST } from '../../registry/subjectRegistry';
import { filterSimulations } from '../../services/experimentService';
import { useLabStore } from '../../stores/useLabStore';
import type { SimulationDifficulty, SubjectId } from '../../types/simulation';
import { ExperimentCard } from '../home/ExperimentCard';
import { Button } from '../ui/Button';

const DIFFICULTIES: Array<SimulationDifficulty | 'all'> = [
  'all',
  'Introductory',
  'Intermediate',
  'Advanced',
];

export const ExploreCatalogView: React.FC = () => {
  const selectedSubject = useLabStore((s) => s.selectedSubject);
  const selectedDifficulty = useLabStore((s) => s.selectedDifficulty);
  const searchQuery = useLabStore((s) => s.searchQuery);
  const setSubjectFilter = useLabStore((s) => s.setSubjectFilter);
  const setDifficultyFilter = useLabStore((s) => s.setDifficultyFilter);
  const setSearchQuery = useLabStore((s) => s.setSearchQuery);

  const results = useMemo(
    () =>
      filterSimulations({
        query: searchQuery,
        subjectId: selectedSubject,
        difficulty: selectedDifficulty,
      }),
    [searchQuery, selectedSubject, selectedDifficulty]
  );

  const resetAllFilters = () => {
    setSubjectFilter('all');
    setDifficultyFilter('all');
    setSearchQuery('');
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#0B0F17] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Catalog Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="space-y-2 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#22D3EE]">
              Experiment Registry
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white">
              Explore Simulation Previews
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Filter interactive experiment previews by scientific discipline, conceptual
              difficulty, or keyword. Stage any module to inspect its apparatus and
              instrument controls.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search
              aria-hidden="true"
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, code, or topic..."
              aria-label="Filter catalog experiments"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#101827] border border-slate-700/80 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#5578F5]"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Subject Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSubjectFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedSubject === 'all'
                  ? 'bg-[#5578F5] text-white'
                  : 'bg-[#101827] text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              All Subjects
            </button>
            {SUBJECT_LIST.map((subject) => (
              <button
                key={subject.id}
                type="button"
                onClick={() => setSubjectFilter(subject.id as SubjectId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedSubject === subject.id
                    ? 'bg-[#5578F5] text-white'
                    : 'bg-[#101827] text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>

          {/* Difficulty Filter Bar */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#101827] border border-slate-800 self-start">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedDifficulty === diff
                    ? 'bg-[#182234] text-[#F59E0B]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff === 'all' ? 'All Levels' : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid or Empty State */}
        {results.length === 0 ? (
          <div className="rounded-xl bg-[#101827] border border-slate-800 p-12 text-center space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#131B29] border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-xl text-white">
                No experiment previews match your filters
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Try clearing your search query or switching to another scientific domain.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={resetAllFilters}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
            {results.map((sim) => (
              <ExperimentCard key={sim.id} simulation={sim} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
