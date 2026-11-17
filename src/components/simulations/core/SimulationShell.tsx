import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Check,
  Info,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { useSimulationPreview } from '../../../hooks/useSimulationPreview';
import { useLabStore } from '../../../stores/useLabStore';
import { ResultsSummaryPanel } from '../../analysis/ResultsSummaryPanel';
import { Button } from '../../ui/Button';
import { ChemistryPreviewStage } from '../chemistry/ChemistryPreviewStage';
import { PhysicsPreviewStage } from '../physics/PhysicsPreviewStage';

export const SimulationShell: React.FC = () => {
  const stagedSimulationId = useLabStore((s) => s.stagedSimulationId);
  const navigateTo = useLabStore((s) => s.navigateTo);
  const savedIds = useLabStore((s) => s.savedSimulationIds);
  const toggleSaved = useLabStore((s) => s.toggleSavedSimulation);
  const labNotes = useLabStore((s) => s.labNotes);
  const updateLabNote = useLabStore((s) => s.updateLabNote);

  const { simulation, params, permalink, updateParam, resetParams } =
    useSimulationPreview(stagedSimulationId);

  const [copiedPermalink, setCopiedPermalink] = useState(false);

  if (!simulation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl text-white">Simulation module not found</h2>
        <Button variant="blue" onClick={() => navigateTo('explore')}>
          Return to Catalog
        </Button>
      </div>
    );
  }

  const isSaved = savedIds.includes(simulation.id);

  const handleCopyPermalink = async () => {
    try {
      await navigator.clipboard.writeText(permalink);
      setCopiedPermalink(true);
      setTimeout(() => setCopiedPermalink(false), 2000);
    } catch {
      setCopiedPermalink(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#101827] text-slate-100">
      {/* Top Workbench Toolbar */}
      <div className="border-b border-slate-800 bg-[#0B101B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigateTo('explore')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131B29] border border-slate-800 hover:border-slate-600 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#22D3EE]">
                <span>{simulation.code}</span>
                <span>·</span>
                <span className="truncate">{simulation.subdiscipline}</span>
              </div>
              <h1 className="font-display text-lg sm:text-xl font-semibold text-white truncate">
                {simulation.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyPermalink}
            >
              {copiedPermalink ? (
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-[#22D3EE]" />
              )}
              <span>{copiedPermalink ? 'Copied Link' : 'Share State'}</span>
            </Button>

            <Button
              variant={isSaved ? 'amber' : 'secondary'}
              size="sm"
              onClick={() => toggleSaved(simulation.id)}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved in My Lab' : 'Save to My Lab'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Split Simulation Environment */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Honest Staged Preview Notice */}
        <div className="rounded-xl bg-[#0D1422] border border-[#5578F5]/30 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <Info className="w-4 h-4 text-[#5578F5] shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Experiment Preview Environment:</strong>{' '}
              This module is staged in the LABVERSE simulation registry with live parameter
              controls, analytical curve previews, and persistent lab notes. Full solver
              mechanics will mount directly into this shell.
            </p>
          </div>
          <span className="font-mono text-[11px] text-[#22D3EE] whitespace-nowrap shrink-0">
            {simulation.equation}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Stage + Analysis Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl bg-[#0D1422] border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Interactive Apparatus Stage (Preview)
                </h2>
                <span className="font-mono text-[11px] text-slate-400">
                  {simulation.difficulty} · ~{simulation.estimatedMinutes} min
                </span>
              </div>

              {simulation.subjectId === 'chemistry' ? (
                <ChemistryPreviewStage simulation={simulation} params={params} />
              ) : (
                <PhysicsPreviewStage simulation={simulation} params={params} />
              )}
            </div>

            <ResultsSummaryPanel simulation={simulation} params={params} />
          </div>

          {/* Right Instrument Control & Lab Notebook Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Calibrated Parameter Deck */}
            <div className="rounded-xl bg-[#0D1422] border border-slate-800 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Instrument Parameters
                </h2>
                <button
                  type="button"
                  onClick={resetParams}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-4">
                {simulation.parameters.map((param) => {
                  const val = params[param.key] ?? param.defaultValue;
                  return (
                    <div key={param.key} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor={`param-${param.key}`}
                          className="text-xs font-medium text-slate-200"
                        >
                          {param.label}{' '}
                          <span className="font-mono text-slate-500">({param.symbol})</span>
                        </label>
                        <span className="font-mono text-xs text-[#F59E0B] tabular-nums">
                          {val} {param.unit}
                        </span>
                      </div>
                      <input
                        id={`param-${param.key}`}
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={val}
                        onChange={(e) =>
                          updateParam(param.key, parseFloat(e.target.value))
                        }
                        className="w-full lab-slider"
                      />
                      <p className="text-[11px] text-slate-500">{param.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learning Objectives & Hypothesis Notebook */}
            <div className="rounded-xl bg-[#0D1422] border border-slate-800 p-5 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Guided Learning &amp; Lab Notes
              </h2>

              <ul className="space-y-2 text-xs text-slate-300 list-disc pl-4">
                {simulation.learningObjectives.map((obj) => (
                  <li key={obj} className="leading-relaxed">
                    {obj}
                  </li>
                ))}
              </ul>

              <div className="pt-2 space-y-2">
                <label
                  htmlFor="lab-hypothesis-note"
                  className="block text-[11px] font-mono uppercase tracking-wider text-slate-400"
                >
                  Your Hypothesis &amp; Observations (Saved to My Lab)
                </label>
                <textarea
                  id="lab-hypothesis-note"
                  rows={4}
                  value={labNotes[simulation.id] ?? ''}
                  onChange={(e) => updateLabNote(simulation.id, e.target.value)}
                  placeholder="Record your prediction, observed parameter relationships, or experimental error notes..."
                  className="w-full rounded-lg bg-[#080C14] border border-slate-800 p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#5578F5]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
