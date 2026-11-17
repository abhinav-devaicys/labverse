import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import { Download } from 'lucide-react';
import { generateTelemetryPreviewData } from '../../services/experimentService';
import { downloadCsvFile } from '../../utils/formatters';

type ChartMode = 'time-series' | 'phase-portrait' | 'fft-spectrum';

export const TelemetryDeck: React.FC = () => {
  const [mode, setMode] = useState<ChartMode>('time-series');
  const [damping, setDamping] = useState<number>(0.08);

  const data = useMemo(() => generateTelemetryPreviewData(damping, 2.4, 60), [damping]);

  const handleExportCsv = () => {
    downloadCsvFile(
      'labverse_telemetry_preview.csv',
      data.map((pt) => ({
        time_s: pt.t,
        primary_amplitude: pt.primary,
        secondary_phase: pt.secondary,
        phase_velocity: pt.phaseVelocity,
        frequency_hz: pt.frequencyHz,
        spectral_gain: pt.amplitude,
      }))
    );
  };

  return (
    <div className="rounded-xl bg-[#101827] border border-slate-800/90 overflow-hidden flex flex-col">
      {/* Deck Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-[#0D1422] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-slate-300">
            Telemetry Inspection Deck
          </span>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#090E18] border border-slate-800">
          {(
            [
              { id: 'time-series', label: 'Time Series' },
              { id: 'phase-portrait', label: 'Phase Portrait' },
              { id: 'fft-spectrum', label: 'FFT Spectrum' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                mode === tab.id
                  ? 'bg-[#5578F5] text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4 bg-[#0A0F1A] bg-lab-grid-fine">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
          <span>
            {mode === 'time-series' && 'Y: AMPLITUDE [m] · X: TIME [0.0s → 10.0s]'}
            {mode === 'phase-portrait' && 'Y: VELOCITY [m/s] · X: DISPLACEMENT [m]'}
            {mode === 'fft-spectrum' && 'Y: GAIN |H(ω)| · X: FREQUENCY [Hz]'}
          </span>
          <span className="text-[#10B981]">Damping γ = {damping.toFixed(2)} s⁻¹</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {mode === 'time-series' ? (
              <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
                <XAxis
                  dataKey="t"
                  stroke="#64748B"
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  domain={[-1.1, 1.1]}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101827',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="primary"
                  name="Oscillator A"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="secondary"
                  name="Oscillator B"
                  stroke="#F59E0B"
                  strokeWidth={1.75}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            ) : mode === 'phase-portrait' ? (
              <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
                <XAxis
                  dataKey="primary"
                  stroke="#64748B"
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101827',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="phaseVelocity"
                  name="Phase Velocity"
                  stroke="#5578F5"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            ) : (
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
                <XAxis
                  dataKey="frequencyHz"
                  stroke="#64748B"
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101827',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amplitude"
                  name="Spectral Gain"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.18}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Interactive Damping Calibration Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <label htmlFor="telemetry-damping" className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
              Damping (γ):
            </label>
            <input
              id="telemetry-damping"
              type="range"
              min={0.01}
              max={0.25}
              step={0.01}
              value={damping}
              onChange={(e) => setDamping(parseFloat(e.target.value))}
              className="w-full lab-slider"
            />
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#131B29] border border-slate-700 hover:border-slate-500 text-[11px] font-mono text-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3 text-[#22D3EE]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bottom Metric Readouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-800/90 border-t border-slate-800">
        <div className="bg-[#0D1422] px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Peak Energy
          </p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-white tabular-nums">
            42.8 J
          </p>
        </div>
        <div className="bg-[#0D1422] px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Q-Factor
          </p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-white tabular-nums">
            {Math.round(12 / Math.max(0.02, damping))}
          </p>
        </div>
        <div className="bg-[#0D1422] px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Dissipation
          </p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-[#F59E0B] tabular-nums">
            {(damping * 0.42).toFixed(3)} W
          </p>
        </div>
        <div className="bg-[#0D1422] px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Integrator
          </p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-slate-200">
            Runge-Kutta 4
          </p>
        </div>
      </div>
    </div>
  );
};
