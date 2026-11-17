import React from 'react';
import { Bookmark, ArrowUpRight, Trash2 } from 'lucide-react';
import { getSimulationById } from '../../registry/simulationRegistry';
import { useLabStore } from '../../stores/useLabStore';
import { Button } from '../ui/Button';

export const MyLabView: React.FC = () => {
  const savedIds = useLabStore((s) => s.savedSimulationIds);
  const labNotes = useLabStore((s) => s.labNotes);
  const toggleSaved = useLabStore((s) => s.toggleSavedSimulation);
  const stageSimulation = useLabStore((s) => s.stageSimulation);
  const navigateTo = useLabStore((s) => s.navigateTo);

  const savedSimulations = savedIds
    .map((id) => getSimulationById(id))
    .filter((sim): sim is NonNullable<typeof sim> => Boolean(sim));

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#0B0F17] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-widest text-[#F59E0B]">
              Personal Workbench
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white">
              My Lab
            </h1>
            <p className="text-sm text-slate-400">
              Your bookmarked experiment previews and recorded hypothesis notes.
            </p>
          </div>

          <Button variant="blue" size="sm" onClick={() => navigateTo('explore')}>
            Add Experiments
          </Button>
        </div>

        {savedSimulations.length === 0 ? (
          <div className="rounded-xl bg-[#101827] border border-slate-800 p-12 text-center space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#131B29] border border-slate-800 flex items-center justify-center mx-auto text-[#F59E0B]">
              <Bookmark className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-xl text-white">Your lab bench is empty</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Bookmark any experiment preview from the catalog to keep quick access and
                save hypothesis notes here.
              </p>
            </div>
            <Button variant="amber" size="sm" onClick={() => navigateTo('explore')}>
              Browse Experiments
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {savedSimulations.map((sim) => (
              <div
                key={sim.id}
                className="rounded-xl bg-[#101827] border border-slate-800/90 p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span className="text-[#22D3EE]">
                      {sim.subdiscipline} · {sim.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSaved(sim.id)}
                      aria-label={`Remove ${sim.title} from My Lab`}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800/70 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">
                      {sim.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {sim.description}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#080C14] border border-slate-800/90 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                      Saved Hypothesis Note
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {labNotes[sim.id]?.trim()
                        ? labNotes[sim.id]
                        : 'No hypothesis notes recorded yet. Stage this experiment to add observations.'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-400">{sim.equation}</span>
                  <Button
                    variant="blue"
                    size="sm"
                    onClick={() => stageSimulation(sim.id)}
                  >
                    <span>Open Stage</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
