import React from 'react';
import { Plus } from 'lucide-react';
import type {
  NewtonsParams,
  NewtonsTelemetry,
} from '../../../simulation/newtonsLawsEngine';

interface NewtonsTelemetryPanelProps {
  params: NewtonsParams;
  telemetry: NewtonsTelemetry;
  onRecordObservation: () => void;
}

export const NewtonsTelemetryPanel: React.FC<NewtonsTelemetryPanelProps> = React.memo(
  ({ params, telemetry, onRecordObservation }) => {
    const a = telemetry.bodyA;
    const b = telemetry.bodyB;

    const primaryMetrics = [
      {
        label: 'Net Force (F_net)',
        value: `${a.netForce > 0 ? '+' : ''}${a.netForce.toFixed(2)}`,
        unit: 'N',
        accent: 'text-[#10B981]',
      },
      {
        label: 'Acceleration (a)',
        value: `${a.acceleration > 0 ? '+' : ''}${a.acceleration.toFixed(3)}`,
        unit: 'm/s²',
        accent: 'text-[#38BDF8]',
      },
      {
        label: 'Velocity (v)',
        value: `${a.velocity > 0 ? '+' : ''}${a.velocity.toFixed(3)}`,
        unit: 'm/s',
      },
      {
        label: 'Displacement (x)',
        value: `${a.displacement > 0 ? '+' : ''}${a.displacement.toFixed(3)}`,
        unit: 'm',
      },
      {
        label: 'Frictional Force (F_f)',
        value: `${a.frictionForce.toFixed(2)}`,
        unit: 'N',
        accent: 'text-[#FBBF24]',
      },
      {
        label: 'Normal Force (N = mg)',
        value: `${a.normalForce.toFixed(1)}`,
        unit: 'N',
      },
      {
        label: 'Momentum (p = mv)',
        value: `${a.momentum.toFixed(2)}`,
        unit: 'kg·m/s',
      },
      {
        label: 'Kinetic Energy (Ek)',
        value: `${a.kineticEnergy.toFixed(2)}`,
        unit: 'J',
      },
    ];

    return (
      <aside
        aria-label="Live Force and Motion Measurements"
        className="bg-[#162033] border border-[#24324B] rounded-xl p-5 space-y-5"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5578F5]">
              Live Telemetry
            </p>
            <h2 className="font-display text-lg font-semibold text-[#F5F4EF] mt-0.5">
              {params.mode === 'third-law' ? 'Block A & B Readouts' : 'Measurements'}
            </h2>
          </div>
          <span className="font-mono text-xs tabular-nums text-[#94A3B8]">
            t = {telemetry.time.toFixed(2)} s
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {primaryMetrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg bg-[#101827] border border-[#24324B] p-3"
            >
              <p className="text-[11px] text-[#94A3B8] leading-tight">{m.label}</p>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span
                  className={`font-mono text-base font-semibold tabular-nums ${
                    m.accent ?? 'text-[#F5F4EF]'
                  }`}
                >
                  {m.value}
                </span>
                <span className="font-mono text-[11px] text-[#64748B]">{m.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Friction State Indicator */}
        <div className="rounded-lg bg-[#101827] border border-[#24324B] p-3.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Friction Regime</span>
            <span className="font-mono text-[#FBBF24]">
              {params.frictionCoeff === 0
                ? 'Frictionless'
                : a.isStaticHeld
                  ? 'Static Hold'
                  : 'Kinetic Sliding'}
            </span>
          </div>
          {params.mode === 'second-law' && (
            <p className="font-mono text-[11px] text-[#CBD5E1] pt-1 border-t border-[#24324B]">
              a = {a.netForce.toFixed(1)} N / {params.massA.toFixed(0)} kg ={' '}
              {a.acceleration.toFixed(2)} m/s²
            </p>
          )}
        </div>

        {/* Mode C Action-Reaction Comparison */}
        {params.mode === 'third-law' && (
          <div className="rounded-lg bg-[#101827] border border-[#24324B] p-4 space-y-2.5 text-xs">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#5578F5]">
              Action–Reaction Pair
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono tabular-nums">
              <div>
                <p className="text-[#94A3B8] text-[10px]">Force on A (F_BA)</p>
                <p className="text-[#5578F5] font-semibold">
                  {a.appliedForce.toFixed(1)} N
                </p>
                <p className="text-[#CBD5E1] text-[11px]">
                  a₁ = {a.acceleration.toFixed(2)} m/s²
                </p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-[10px]">Force on B (F_AB)</p>
                <p className="text-[#38BDF8] font-semibold">
                  +{b.appliedForce.toFixed(1)} N
                </p>
                <p className="text-[#CBD5E1] text-[11px]">
                  a₂ = +{b.acceleration.toFixed(2)} m/s²
                </p>
              </div>
            </div>
            <p className="font-mono text-[11px] text-[#94A3B8] pt-1.5 border-t border-[#24324B]">
              Total Momentum (p₁+p₂): {telemetry.totalMomentum.toFixed(2)} kg·m/s
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onRecordObservation}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#5578F5] text-white text-xs sm:text-sm font-medium hover:bg-[#4467E4] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Record Observation</span>
        </button>
      </aside>
    );
  }
);

NewtonsTelemetryPanel.displayName = 'NewtonsTelemetryPanel';
