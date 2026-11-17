import React from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { getFeaturedSimulations } from '../../registry/simulationRegistry';
import { useLabStore } from '../../stores/useLabStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const LearningModulesModal: React.FC = () => {
  const isOpen = useLabStore((s) => s.isLearningModalOpen);
  const setOpen = useLabStore((s) => s.setLearningModalOpen);
  const stageSimulation = useLabStore((s) => s.stageSimulation);
  const featured = getFeaturedSimulations();

  return (
    <Modal
      open={isOpen}
      onClose={() => setOpen(false)}
      title="Guided Learning Modules & Curriculum Guide"
      subtitle="Structured inquiry activities paired with LABVERSE experiment previews."
    >
      <div className="space-y-4">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Each LABVERSE module combines a visual experiment stage, quantitative parameter
          controls, and conceptual learning checkpoints suitable for high school AP/IB
          and introductory university coursework.
        </p>

        <div className="space-y-3">
          {featured.map((sim) => (
            <div
              key={sim.id}
              className="rounded-lg bg-[#0B101B] border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#22D3EE]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{sim.subdiscipline}</span>
                  <span>·</span>
                  <span className="text-slate-400">{sim.estimatedMinutes} min</span>
                </div>
                <h4 className="text-sm font-semibold text-white">{sim.title}</h4>
                <p className="text-xs text-slate-400">
                  {sim.learningObjectives[0]}
                </p>
              </div>

              <Button
                variant="blue"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  stageSimulation(sim.id);
                }}
              >
                <span>Open Preview</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
