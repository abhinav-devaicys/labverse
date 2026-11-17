import React from 'react';
import { Plus } from 'lucide-react';
import type { PendulumTelemetry } from '../../../simulation/pendulumEngine';

interface PendulumTelemetryPanelProps {
  telemetry: PendulumTelemetry;
  onRecordObservation: () => void;
}

export const PendulumTelemetryPanel: React.FC<PendulumTelemetryPanelProps> = React.memo(({
  telemetry,
  onRecordObservation,
}) => {
  const metrics = [
    {
      label: 'Angular Displacement (θ)',
      value: `${telemetry.angleDeg.toFixed(1)}°`,
      sub: `${telemetry.angleRad.toFixed(3)} rad`,
    },
    {
      label: 'Angular Velocity (ω)',
      value: `${telemetry.angularVelocity.toFixed(3)}`,
      sub: 'rad/s',
    },
    {
      label: 'Angular Acceleration (α)',
      value: `${telemetry.angularAcceleration.toFixed(3)}`,
      sub: 'rad/s²',
    },
    {
      label: 'Linear Velocity (v)',
      value: `${telemetry.linearVelocity.toFixed(3)}`,
      sub: 'm/s',
    },
    {
      label: 'Kinetic Energy (Ek)',
      value: `${telemetry.kineticEnergy.toFixed(3)}`,
      sub: 'J',
      accent: 'text-[#38BDF8]',
    },
    {
      label: 'Potential Energy (Ep)',
      value: `${telemetry.potentialEnergy.toFixed(3)}`,
      sub: 'J',
      accent: 'text-[#FBBF24]',
    },
    {
      label: 'Total Mechanical Energy',
      value: `${telemetry.totalEnergy.toFixed(3)}`,
      sub: 'J',
      accent: 'text-[#93C5FD]',
    },
    {
      label: 'Simulation Time (t)',
      value: `${telemetry.time.toFixed(2)}`,
      sub: 's',
    },
  ];

  return (
    <aside
      aria-label="Live Telemetry and Measurements"
      className="bg-[#162033] border border-[#24324B] rounded-xl p-5 space-y-5"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5578F5]">
            Live Telemetry
          </p>
          <h2 className="font-display text-lg font-semibold text-[#F5F4EF] mt-0.5">
            Measurements
          </h2>
        </div>
        <span className="font-mono text-xs tabular-nums text-[#94A3B8]">
          Cycles: {telemetry.completedCycles}
        </span>
      </div>

      {/* 8 Real-Time Telemetry Cells */}
      <div className="grid grid-cols-2 gap-2.5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg bg-[#101827] border border-[#24324B] p-3"
          >
            <p className="text-[11px] text-[#94A3B8] leading-tight">{m.label}</p>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span
                className={`font-mono text-base sm:text-lg font-semibold tabular-nums ${
                  m.accent ?? 'text-[#F5F4EF]'
                }`}
              >
                {m.value}
              </span>
              <span className="font-mono text-[11px] text-[#64748B]">{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Period Comparison Card */}
      <div className="rounded-lg bg-[#101827] border border-[#24324B] p-4 space-y-3">
        <p className="text-[11px] font-mono uppercase tracking-wider text-[#5578F5]">
          Period Comparison
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-[#94A3B8]">Theoretical T = 2π√(L/g)</p>
            <p className="font-mono text-lg font-semibold tabular-nums text-[#F5F4EF] mt-0.5">
              {telemetry.theoreticalPeriod.toFixed(4)} s
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8]">Measured Period</p>
            <p className="font-mono text-lg font-semibold tabular-nums text-[#38BDF8] mt-0.5">
              {telemetry.measuredPeriod !== null
                ? `${telemetry.measuredPeriod.toFixed(4)} s`
                : 'Awaiting 2nd pass'}
            </p>
          </div>
        </div>

        {telemetry.periodDeviationPercent !== null && (
          <p className="text-[11px] font-mono text-[#CBD5E1] pt-2 border-t border-[#24324B]">
            Small-angle deviation: +{Math.abs(telemetry.periodDeviationPercent).toFixed(2)}%
          </p>
        )}
      </div>

      {/* Record Observation Trigger */}
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
});

PendulumTelemetryPanel.displayName = 'PendulumTelemetryPanel';
