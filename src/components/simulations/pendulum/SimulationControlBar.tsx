import React from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';

export type PlaybackSpeed = 0.25 | 0.5 | 1 | 2;

interface SimulationControlBarProps {
  isRunning: boolean;
  hasStarted: boolean;
  speed: PlaybackSpeed;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onChangeSpeed: (speed: PlaybackSpeed) => void;
}

const SPEED_OPTIONS: PlaybackSpeed[] = [0.25, 0.5, 1, 2];

export const SimulationControlBar: React.FC<SimulationControlBarProps> = React.memo(({
  isRunning,
  hasStarted,
  speed,
  onStart,
  onPause,
  onResume,
  onReset,
  onStepForward,
  onChangeSpeed,
}) => {
  return (
    <div className="bg-[#162033] border border-[#24324B] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {!isRunning && !hasStarted && (
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5578F5] text-white text-xs sm:text-sm font-medium hover:bg-[#4467E4] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Play className="w-4 h-4" aria-hidden="true" />
            <span>Start</span>
          </button>
        )}

        {isRunning && (
          <button
            type="button"
            onClick={onPause}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F59E0B] text-[#101827] text-xs sm:text-sm font-semibold hover:bg-[#D97706] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Pause className="w-4 h-4" aria-hidden="true" />
            <span>Pause</span>
          </button>
        )}

        {!isRunning && hasStarted && (
          <button
            type="button"
            onClick={onResume}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5578F5] text-white text-xs sm:text-sm font-medium hover:bg-[#4467E4] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Play className="w-4 h-4" aria-hidden="true" />
            <span>Resume</span>
          </button>
        )}

        <button
          type="button"
          onClick={onStepForward}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#101827] border border-[#24324B] text-[#E2E8F0] text-xs sm:text-sm font-medium hover:border-[#5578F5] transition-colors cursor-pointer whitespace-nowrap"
        >
          <StepForward className="w-4 h-4" aria-hidden="true" />
          <span>Step Forward</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#101827] border border-[#24324B] text-[#CBD5E1] text-xs sm:text-sm font-medium hover:border-[#94A3B8] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {/* Playback Speed Selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
          Speed
        </span>
        <div
          role="group"
          aria-label="Simulation speed"
          className="inline-flex items-center rounded-lg bg-[#101827] border border-[#24324B] p-0.5"
        >
          {SPEED_OPTIONS.map((opt) => {
            const active = speed === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChangeSpeed(opt)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono tabular-nums transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#5578F5] text-white font-medium'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {opt}x
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

SimulationControlBar.displayName = 'SimulationControlBar';
