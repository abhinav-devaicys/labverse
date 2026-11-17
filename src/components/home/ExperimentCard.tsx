import React from 'react';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { useLabStore } from '../../stores/useLabStore';
import type { SimulationModule } from '../../types/simulation';
import { Button } from '../ui/Button';
import { ExperimentPreviewVisual } from './ExperimentPreviewVisual';

interface ExperimentCardProps {
  simulation: SimulationModule;
  wide?: boolean;
}

export const ExperimentCard: React.FC<ExperimentCardProps> = ({ simulation, wide = false }) => {
  const stageSimulation = useLabStore((s) => s.stageSimulation);
  const savedIds = useLabStore((s) => s.savedSimulationIds);
  const toggleSaved = useLabStore((s) => s.toggleSavedSimulation);
  const isSaved = savedIds.includes(simulation.id);

  return (
    <article
      className={`group rounded-xl bg-[#101827] border border-slate-800/90 hover:border-slate-700 transition-colors p-5 flex flex-col justify-between gap-4 ${
        wide ? 'lg:col-span-3' : 'lg:col-span-2'
      }`}
    >
      <div className="space-y-4">
        {/* Clean unboxed metadata header */}
        <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
          <span className="text-[#22D3EE] uppercase tracking-wider truncate">
            {simulation.subdiscipline} · {simulation.code}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400">Preview</span>
            <button
              type="button"
              onClick={() => toggleSaved(simulation.id)}
              aria-label={isSaved ? `Remove ${simulation.title} from My Lab` : `Save ${simulation.title} to My Lab`}
              className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                isSaved
                  ? 'border-[#F59E0B]/50 bg-[#F59E0B]/10 text-[#F59E0B]'
                  : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-display text-xl font-semibold text-white group-hover:text-[#93C5FD] transition-colors">
            {simulation.title}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
            {simulation.description}
          </p>
        </div>

        {/* Scientific Apparatus Diagram */}
        <ExperimentPreviewVisual simulationId={simulation.id} />

        {/* Tabular Parameter Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          {simulation.metrics.map((metric) => (
            <div key={metric.label} className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 truncate">
                {metric.label}
              </p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-slate-100 tabular-nums truncate">
                {metric.value}
                {metric.unit && (
                  <span className="text-xs font-normal text-slate-400 ml-1">{metric.unit}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-xs font-mono text-[#10B981] truncate">
          {simulation.engineLabel}
        </span>

        <Button
          variant="blue"
          size="sm"
          onClick={() => stageSimulation(simulation.id)}
        >
          <span>Stage Experiment</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </article>
  );
};
