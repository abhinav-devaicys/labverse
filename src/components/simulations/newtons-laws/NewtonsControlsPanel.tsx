import React from 'react';
import {
  THIRD_LAW_PULSE_DURATION,
  type NewtonsLawMode,
  type NewtonsParams,
  type ThirdLawPushType,
} from '../../../simulation/newtonsLawsEngine';

export interface NewtonsVisualOptions {
  showForces: boolean;
  showVelocity: boolean;
  showDisplacement: boolean;
  showNormalWeight: boolean;
  showGrid: boolean;
}

interface NewtonsControlsPanelProps {
  params: NewtonsParams;
  visualOptions: NewtonsVisualOptions;
  onChangeMode: (mode: NewtonsLawMode) => void;
  onChangeParam: <K extends keyof NewtonsParams>(key: K, value: NewtonsParams[K]) => void;
  onToggleVisual: (key: keyof NewtonsVisualOptions) => void;
  onTriggerThirdLawPulse: () => void;
}

const MODE_OPTIONS: { id: NewtonsLawMode; short: string; title: string }[] = [
  { id: 'first-law', short: '1st Law', title: 'Law of Inertia' },
  { id: 'second-law', short: '2nd Law', title: 'F = ma' },
  { id: 'third-law', short: '3rd Law', title: 'Action–Reaction' },
];

const GRAVITY_PRESETS = [
  { label: 'Moon', value: 1.62 },
  { label: 'Earth', value: 9.81 },
  { label: 'Jupiter', value: 24.79 },
];

export const NewtonsControlsPanel: React.FC<NewtonsControlsPanelProps> = React.memo(
  ({
    params,
    visualOptions,
    onChangeMode,
    onChangeParam,
    onToggleVisual,
    onTriggerThirdLawPulse,
  }) => {
    const maxStaticA = params.frictionCoeff * params.massA * params.gravity;

    return (
      <aside
        aria-label="Experiment Mode and Physical Parameters"
        className="bg-[#162033] border border-[#24324B] rounded-xl p-5 space-y-6"
      >
        {/* Mode Selector */}
        <div className="space-y-2.5">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5578F5]">
              Experiment Mode
            </p>
            <h2 className="font-display text-lg font-semibold text-[#F5F4EF] mt-0.5">
              Select Law
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-1.5 bg-[#101827] border border-[#24324B] p-1 rounded-lg">
            {MODE_OPTIONS.map((m) => {
              const active = params.mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangeMode(m.id)}
                  className={`py-2 px-1.5 rounded-md text-center transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#5578F5] text-white'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <span className="block text-[11px] font-mono font-semibold">
                    {m.short}
                  </span>
                  <span className="block text-[10px] opacity-85 truncate">
                    {m.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Physical Parameters */}
        <div className="space-y-5 pt-4 border-t border-[#24324B]">
          {/* Mass A */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="newton-mass-a" className="font-medium text-[#E2E8F0]">
                {params.mode === 'third-law' ? 'Block A Mass (m₁)' : 'Object Mass (m)'}
              </label>
              <span className="font-mono tabular-nums text-[#38BDF8] font-medium">
                {params.massA.toFixed(0)} kg
              </span>
            </div>
            <input
              id="newton-mass-a"
              type="range"
              min={1}
              max={100}
              step={1}
              value={params.massA}
              onChange={(e) => onChangeParam('massA', Number(e.target.value))}
              className="w-full accent-[#5578F5] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>1 kg</span>
              <span>100 kg</span>
            </div>
          </div>

          {/* Mass B (Mode C only) */}
          {params.mode === 'third-law' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="newton-mass-b" className="font-medium text-[#E2E8F0]">
                  Block B Mass (m₂)
                </label>
                <span className="font-mono tabular-nums text-[#38BDF8] font-medium">
                  {params.massB.toFixed(0)} kg
                </span>
              </div>
              <input
                id="newton-mass-b"
                type="range"
                min={1}
                max={100}
                step={1}
                value={params.massB}
                onChange={(e) => onChangeParam('massB', Number(e.target.value))}
                className="w-full accent-[#5578F5] cursor-pointer"
              />
            </div>
          )}

          {/* Applied Force (Mode A & Mode B) */}
          {params.mode !== 'third-law' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="newton-force" className="font-medium text-[#E2E8F0]">
                  Applied Force (F)
                </label>
                <span className="font-mono tabular-nums text-[#38BDF8] font-medium">
                  {params.appliedForce > 0 ? `+${params.appliedForce}` : params.appliedForce} N
                </span>
              </div>
              <input
                id="newton-force"
                type="range"
                min={-200}
                max={200}
                step={5}
                value={params.appliedForce}
                onChange={(e) => onChangeParam('appliedForce', Number(e.target.value))}
                className="w-full accent-[#5578F5] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#94A3B8]">
                <span>-200 N (Left)</span>
                <span>0 N</span>
                <span>+200 N (Right)</span>
              </div>

              {/* Mode A Inertia Quick Controls */}
              {params.mode === 'first-law' && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onChangeParam('appliedForce', 50)}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                      params.appliedForce === 50
                        ? 'bg-[#5578F5]/20 border-[#5578F5] text-white'
                        : 'bg-[#101827] border-[#24324B] text-[#CBD5E1] hover:border-[#5578F5]'
                    }`}
                  >
                    Apply +50 N Push
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeParam('appliedForce', 0)}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                      params.appliedForce === 0
                        ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-white'
                        : 'bg-[#101827] border-[#24324B] text-[#CBD5E1] hover:border-[#38BDF8]'
                    }`}
                  >
                    Remove Force (0 N)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Third Law Interaction Force */}
          {params.mode === 'third-law' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="newton-interaction" className="font-medium text-[#E2E8F0]">
                    Interaction Force (|F|)
                  </label>
                  <span className="font-mono tabular-nums text-[#38BDF8] font-medium">
                    {params.interactionForce} N
                  </span>
                </div>
                <input
                  id="newton-interaction"
                  type="range"
                  min={10}
                  max={200}
                  step={5}
                  value={params.interactionForce}
                  onChange={(e) =>
                    onChangeParam('interactionForce', Number(e.target.value))
                  }
                  className="w-full accent-[#5578F5] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {(
                  [
                    ['pulse', `${THIRD_LAW_PULSE_DURATION}s Pulse`],
                    ['continuous', 'Continuous'],
                  ] as [ThirdLawPushType, string][]
                ).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChangeParam('thirdLawPushType', type)}
                    className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-mono border transition-colors cursor-pointer ${
                      params.thirdLawPushType === type
                        ? 'bg-[#5578F5]/20 border-[#5578F5] text-white'
                        : 'bg-[#101827] border-[#24324B] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {params.thirdLawPushType === 'pulse' && (
                <button
                  type="button"
                  onClick={onTriggerThirdLawPulse}
                  className="w-full py-2 px-3 rounded-lg bg-[#101827] border border-[#5578F5]/70 text-xs font-medium text-[#93C5FD] hover:bg-[#5578F5]/15 transition-colors cursor-pointer"
                >
                  Trigger Equal &amp; Opposite Push
                </button>
              )}
            </div>
          )}

          {/* Friction Coefficient */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="newton-friction" className="font-medium text-[#E2E8F0]">
                Friction Coefficient (μ)
              </label>
              <span className="font-mono tabular-nums text-[#FBBF24] font-medium">
                {params.frictionCoeff.toFixed(2)}
              </span>
            </div>
            <input
              id="newton-friction"
              type="range"
              min={0}
              max={0.8}
              step={0.01}
              value={params.frictionCoeff}
              onChange={(e) => onChangeParam('frictionCoeff', Number(e.target.value))}
              className="w-full accent-[#F59E0B] cursor-pointer"
            />
            <p className="text-[11px] font-mono text-[#94A3B8]">
              Max static friction F_f,max = {maxStaticA.toFixed(1)} N
            </p>
          </div>

          {/* Gravity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="newton-gravity" className="font-medium text-[#E2E8F0]">
                Gravity (g)
              </label>
              <span className="font-mono tabular-nums text-[#38BDF8] font-medium">
                {params.gravity.toFixed(2)} m/s²
              </span>
            </div>
            <input
              id="newton-gravity"
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
                    className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-mono border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#5578F5]/20 border-[#5578F5] text-white'
                        : 'bg-[#101827] border-[#24324B] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Visual Overlay Toggles */}
        <div className="pt-4 border-t border-[#24324B] space-y-2.5">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5578F5]">
            Visual Indicators
          </p>
          {(
            [
              ['showForces', 'Force Arrows (F_app, F_f, F_net)'],
              ['showVelocity', 'Velocity Vector (v)'],
              ['showDisplacement', 'Displacement Scale (x)'],
              ['showNormalWeight', 'Normal & Weight (N, mg)'],
              ['showGrid', 'Track Grid & Ruler'],
            ] as [keyof NewtonsVisualOptions, string][]
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between gap-2 py-1 text-xs text-[#CBD5E1] cursor-pointer select-none hover:text-white"
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
      </aside>
    );
  }
);

NewtonsControlsPanel.displayName = 'NewtonsControlsPanel';
