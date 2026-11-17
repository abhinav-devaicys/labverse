import React from 'react';
import type { PendulumParams } from '../../../simulation/pendulumEngine';

export interface PendulumVisualOptions {
  showEquilibrium: boolean;
  showAngleArc: boolean;
  showLengthMeasure: boolean;
  showTrail: boolean;
  showEnergyViz: boolean;
  showGrid: boolean;
}

interface PendulumControlsPanelProps {
  params: PendulumParams;
  visualOptions: PendulumVisualOptions;
  isRunning: boolean;
  onChangeParam: <K extends keyof PendulumParams>(key: K, value: PendulumParams[K]) => void;
  onToggleVisual: (key: keyof PendulumVisualOptions) => void;
}

const GRAVITY_PRESETS = [
  { label: 'Moon', value: 1.62 },
  { label: 'Earth', value: 9.81 },
  { label: 'Jupiter', value: 24.79 },
];

export const PendulumControlsPanel: React.FC<PendulumControlsPanelProps> = React.memo(({
  params,
  visualOptions,
  onChangeParam,
  onToggleVisual,
}) => {
  return (
    <aside
      aria-label="Experiment Variables and Visual Guides"
      className="bg-[#162033] border border-[#24324B] rounded-xl p-5 space-y-6"
    >
      <div>
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5578F5]">
          Variables
        </p>
        <h2 className="font-display text-lg font-semibold text-[#F5F4EF] mt-0.5">
          Physical Parameters
        </h2>
      </div>

      <div className="space-y-5">
        {/* Length */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="pendulum-length" className="font-medium text-[#E2E8F0]">
              Pendulum Length (L)
            </label>
            <span className="font-mono tabular-nums text-[#38BDF8] font-medium">
              {params.length.toFixed(2)} m
            </span>
          </div>
          <input
            id="pendulum-length"
            type="range"
            min={0.2}
            max={3.0}
            step={0.05}
            value={params.length}
            onChange={(e) => onChangeParam('length', Number(e.target.value))}
            className="w-full accent-[#5578F5] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-[#94A3B8]">
            <span>0.2 m</span>
            <span>3.0 m</span>
          </div>
        </div>

        {/* Initial Angle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="pendulum-angle" className="font-medium text-[#E2E8F0]">
              Initial Angle (θ₀)
            </label>
            <span className="font-mono tabular-nums text-[#38BDF8] font-medium">
              {params.initialAngleDeg.toFixed(0)}°
            </span>
          </div>
          <input
            id="pendulum-angle"
            type="range"
            min={5}
            max={60}
            step={1}
            value={params.initialAngleDeg}
            onChange={(e) => onChangeParam('initialAngleDeg', Number(e.target.value))}
            className="w-full accent-[#5578F5] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-[#94A3B8]">
            <span>5°</span>
            <span>60°</span>
          </div>
        </div>

        {/* Gravity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="pendulum-gravity" className="font-medium text-[#E2E8F0]">
              Gravity (g)
            </label>
            <span className="font-mono tabular-nums text-[#38BDF8] font-medium">
              {params.gravity.toFixed(2)} m/s²
            </span>
          </div>
          <input
            id="pendulum-gravity"
            type="range"
            min={1}
            max={25}
            step={0.1}
            value={params.gravity}
            onChange={(e) => onChangeParam('gravity', Number(e.target.value))}
            className="w-full accent-[#5578F5] cursor-pointer"
          />
          <div className="flex items-center gap-1.5 pt-0.5">
            {GRAVITY_PRESETS.map((preset) => {
              const active = Math.abs(params.gravity - preset.value) < 0.05;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChangeParam('gravity', preset.value)}
                  className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-mono border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#5578F5]/20 border-[#5578F5] text-[#F5F4EF]'
                      : 'bg-[#101827] border-[#24324B] text-[#94A3B8] hover:text-[#F5F4EF] hover:border-[#3B517A]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bob Mass */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="pendulum-mass" className="font-medium text-[#E2E8F0]">
              Bob Mass (m)
            </label>
            <span className="font-mono tabular-nums text-[#38BDF8] font-medium">
              {params.mass.toFixed(1)} kg
            </span>
          </div>
          <input
            id="pendulum-mass"
            type="range"
            min={0.1}
            max={5.0}
            step={0.1}
            value={params.mass}
            onChange={(e) => onChangeParam('mass', Number(e.target.value))}
            className="w-full accent-[#5578F5] cursor-pointer"
          />
          <p className="text-[11px] text-[#94A3B8] leading-relaxed">
            Mass alters kinetic and potential energy, but does not change the ideal
            pendulum&apos;s period.
          </p>
        </div>
      </div>

      {/* Visual Learning Toggles */}
      <div className="pt-5 border-t border-[#24324B] space-y-3">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5578F5]">
          Visual Guides
        </p>

        <div className="space-y-2">
          {(
            [
              ['showEquilibrium', 'Equilibrium Position'],
              ['showAngleArc', 'Angle Arc (θ)'],
              ['showLengthMeasure', 'Length Measurement (L)'],
              ['showTrail', 'Motion Trail'],
              ['showEnergyViz', 'Energy Visualization'],
              ['showGrid', 'Grid & Reference Markers'],
            ] as [keyof PendulumVisualOptions, string][]
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between gap-3 py-1 text-xs text-[#CBD5E1] cursor-pointer select-none hover:text-white"
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={visualOptions[key]}
                onChange={() => onToggleVisual(key)}
                className="w-4 h-4 rounded accent-[#5578F5] cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
});

PendulumControlsPanel.displayName = 'PendulumControlsPanel';
