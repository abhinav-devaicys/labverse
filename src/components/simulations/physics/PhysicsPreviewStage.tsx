import React from 'react';
import type { SimulationModule } from '../../../types/simulation';
import { ExperimentPreviewVisual } from '../../home/ExperimentPreviewVisual';

interface PhysicsPreviewStageProps {
  simulation: SimulationModule;
  params: Record<string, number>;
}

export const PhysicsPreviewStage: React.FC<PhysicsPreviewStageProps> = ({
  simulation,
  params,
}) => {
  const renderComputedSummary = () => {
    if (simulation.id === 'pendulum-motion') {
      const L = params.length ?? 1.2;
      const g = params.gravity ?? 9.81;
      const T = 2 * Math.PI * Math.sqrt(L / g);
      return (
        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">EST. PERIOD (T)</span>
            <span className="text-[#10B981] text-sm font-semibold tabular-nums">
              {T.toFixed(2)} s
            </span>
          </div>
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">ANGULAR FREQ (ω₀)</span>
            <span className="text-slate-100 text-sm font-semibold tabular-nums">
              {Math.sqrt(g / L).toFixed(2)} rad/s
            </span>
          </div>
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">DAMPING (γ)</span>
            <span className="text-[#F59E0B] text-sm font-semibold tabular-nums">
              {(params.damping ?? 0.04).toFixed(2)} s⁻¹
            </span>
          </div>
        </div>
      );
    }

    if (simulation.id === 'electric-circuit-builder') {
      const V = params.voltage ?? 12;
      const R = params.resistance ?? 100;
      const I = V / R;
      const P = V * I;
      return (
        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">LOOP CURRENT (I)</span>
            <span className="text-[#10B981] text-sm font-semibold tabular-nums">
              {I.toFixed(3)} A
            </span>
          </div>
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">POWER (P = VI)</span>
            <span className="text-[#F59E0B] text-sm font-semibold tabular-nums">
              {P.toFixed(2)} W
            </span>
          </div>
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">TIME CONST (τ)</span>
            <span className="text-[#22D3EE] text-sm font-semibold tabular-nums">
              {((R * (params.capacitance ?? 100)) / 1000).toFixed(2)} ms
            </span>
          </div>
        </div>
      );
    }

    if (simulation.id === 'newtons-laws') {
      const F = params.appliedForce ?? 45;
      const m = params.mass ?? 8;
      const mu = params.frictionCoeff ?? 0.3;
      const fFriction = mu * m * 9.81;
      const netForce = Math.max(0, F - fFriction);
      const accel = netForce / m;
      return (
        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">FRICTION (f_k)</span>
            <span className="text-[#F59E0B] text-sm font-semibold tabular-nums">
              {fFriction.toFixed(1)} N
            </span>
          </div>
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">NET FORCE (∑F)</span>
            <span className="text-slate-100 text-sm font-semibold tabular-nums">
              {netForce.toFixed(1)} N
            </span>
          </div>
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">ACCELERATION (a)</span>
            <span className="text-[#10B981] text-sm font-semibold tabular-nums">
              {accel.toFixed(2)} m/s²
            </span>
          </div>
        </div>
      );
    }

    if (simulation.id === 'wave-interference') {
      const lambdaNm = params.wavelength ?? 500;
      const dMm = params.slitSeparation ?? 0.15;
      const L = params.screenDistance ?? 1.5;
      const fringeSpacingMm = ((lambdaNm * 1e-9 * L) / (dMm * 1e-3)) * 1000;
      return (
        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">FRINGE SPACING (Δy)</span>
            <span className="text-[#10B981] text-sm font-semibold tabular-nums">
              {fringeSpacingMm.toFixed(2)} mm
            </span>
          </div>
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">WAVELENGTH (λ)</span>
            <span className="text-[#22D3EE] text-sm font-semibold tabular-nums">
              {lambdaNm} nm
            </span>
          </div>
          <div className="rounded-lg bg-[#0B101B] border border-slate-800 p-3">
            <span className="text-slate-500 block text-[10px]">OPTICAL PATH (L)</span>
            <span className="text-slate-100 text-sm font-semibold tabular-nums">
              {L.toFixed(1)} m
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <ExperimentPreviewVisual simulationId={simulation.id} />
      {renderComputedSummary()}
    </div>
  );
};
