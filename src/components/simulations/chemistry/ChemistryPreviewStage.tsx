import React from 'react';
import type { SimulationModule } from '../../../types/simulation';
import { ExperimentPreviewVisual } from '../../home/ExperimentPreviewVisual';

interface ChemistryPreviewStageProps {
  simulation: SimulationModule;
  params: Record<string, number>;
}

const ELEMENT_SYMBOLS = [
  'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
];

export const ChemistryPreviewStage: React.FC<ChemistryPreviewStageProps> = ({
  simulation,
  params,
}) => {
  const protons = Math.round(params.protons ?? 6);
  const neutrons = Math.round(params.neutrons ?? 6);
  const electrons = Math.round(params.electrons ?? 6);
  const symbol = ELEMENT_SYMBOLS[Math.min(ELEMENT_SYMBOLS.length - 1, Math.max(0, protons - 1))];
  const netCharge = protons - electrons;
  const massNumber = protons + neutrons;

  return (
    <div className="space-y-4">
      <ExperimentPreviewVisual simulationId={simulation.id} />
      {simulation.id === 'build-an-atom' && (
        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">NUCLIDE NOTATION</span>
            <span className="text-[#22D3EE] text-sm font-semibold tabular-nums">
              {massNumber}
              {symbol}
            </span>
          </div>
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">NET CHARGE</span>
            <span className="text-[#10B981] text-sm font-semibold tabular-nums">
              {netCharge > 0 ? `+${netCharge}` : netCharge}
            </span>
          </div>
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">VALENCE STATE</span>
            <span className="text-slate-100 text-sm font-semibold">
              {netCharge === 0 ? 'Neutral' : netCharge > 0 ? 'Cation' : 'Anion'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
