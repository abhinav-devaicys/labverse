import React, { useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  exportObservationsToCsv,
  type PendulumObservation,
  type PendulumParams,
} from '../../../simulation/pendulumEngine';

interface PendulumAnalysisPanelProps {
  params: PendulumParams;
  theoreticalPeriod: number;
  measuredPeriod: number | null;
  observations: PendulumObservation[];
  onAddObservation: (note: string) => void;
  onDeleteObservation: (id: string) => void;
  onClearObservations: () => void;
}

export const PendulumAnalysisPanel: React.FC<PendulumAnalysisPanelProps> = React.memo(({
  params,
  theoreticalPeriod,
  measuredPeriod,
  observations,
  onAddObservation,
  onDeleteObservation,
  onClearObservations,
}) => {
  const [noteInput, setNoteInput] = useState('');

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    onAddObservation(noteInput.trim());
    setNoteInput('');
  };

  const handleDownloadCsv = () => {
    if (observations.length === 0) return;
    const csv = exportObservationsToCsv(observations);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'labverse-pendulum-observations.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Sort observations by length for Length vs Period comparison curve
  const comparisonData = [...observations]
    .sort((a, b) => a.length - b.length)
    .map((obs) => ({
      length: obs.length,
      theoreticalPeriod: Number(obs.theoreticalPeriod.toFixed(4)),
      measuredPeriod:
        obs.measuredPeriod !== null ? Number(obs.measuredPeriod.toFixed(4)) : null,
    }));

  return (
    <section
      aria-label="Experiment Analysis and Data Export"
      className="bg-[#162033] border border-[#24324B] rounded-xl p-5 sm:p-6 space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5578F5]">
            Experiment Analysis
          </p>
          <h2 className="font-display text-xl font-semibold text-[#F5F4EF] mt-0.5">
            Record Observations &amp; Compare Lengths
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {observations.length > 0 && (
            <button
              type="button"
              onClick={onClearObservations}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#101827] border border-[#24324B] text-xs font-medium text-[#CBD5E1] hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear Log</span>
            </button>
          )}

          <button
            type="button"
            disabled={observations.length === 0}
            onClick={handleDownloadCsv}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              observations.length === 0
                ? 'bg-[#101827] text-[#64748B] border border-[#24324B] cursor-not-allowed'
                : 'bg-[#5578F5] text-white hover:bg-[#4467E4] cursor-pointer'
            }`}
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export CSV ({observations.length})</span>
          </button>
        </div>
      </div>

      {/* Observation Capture Form */}
      <form
        onSubmit={handleRecord}
        className="rounded-xl bg-[#101827] border border-[#24324B] p-4 flex flex-col lg:flex-row lg:items-center gap-4"
      >
        <div className="flex-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-[#CBD5E1]">
          <span>L = {params.length.toFixed(2)} m</span>
          <span>θ₀ = {params.initialAngleDeg}°</span>
          <span>g = {params.gravity.toFixed(2)} m/s²</span>
          <span>m = {params.mass.toFixed(1)} kg</span>
          <span className="text-[#93C5FD]">
            T_theory = {theoreticalPeriod.toFixed(4)} s
          </span>
          <span className="text-[#38BDF8]">
            T_meas ={' '}
            {measuredPeriod !== null
              ? `${measuredPeriod.toFixed(4)} s`
              : '—'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 lg:w-[440px]">
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Optional observation note (e.g., doubling L)..."
            aria-label="Observation note"
            className="flex-1 rounded-lg bg-[#162033] border border-[#24324B] px-3 py-2 text-xs sm:text-sm text-[#F5F4EF] placeholder:text-[#64748B] focus:outline-none focus:border-[#5578F5]"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#5578F5] text-white text-xs sm:text-sm font-medium hover:bg-[#4467E4] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Log Trial</span>
          </button>
        </div>
      </form>

      {observations.length === 0 ? (
        <div className="rounded-xl bg-[#101827] border border-[#24324B] p-8 text-center space-y-2">
          <p className="font-display text-base font-medium text-[#F5F4EF]">
            No observations recorded yet
          </p>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto">
            Run the pendulum through at least one full swing to capture a measured
            period, then log trials across different lengths (e.g., 0.5 m, 1.0 m, 1.8 m,
            2.5 m) to compare theoretical vs. measured results and export CSV data.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Recorded Trials Data Table */}
          <div className="xl:col-span-7 overflow-x-auto rounded-xl border border-[#24324B] bg-[#101827]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#24324B] text-[#94A3B8] font-mono">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">L (m)</th>
                  <th className="py-3 px-3">θ₀ (°)</th>
                  <th className="py-3 px-3">g (m/s²)</th>
                  <th className="py-3 px-3">m (kg)</th>
                  <th className="py-3 px-3">T Theory</th>
                  <th className="py-3 px-3">T Meas.</th>
                  <th className="py-3 px-3">Note</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24324B] font-mono tabular-nums text-[#E2E8F0]">
                {observations.map((obs) => (
                  <tr key={obs.id} className="hover:bg-[#162033]/60">
                    <td className="py-2.5 px-3 text-[#94A3B8]">{obs.trialNumber}</td>
                    <td className="py-2.5 px-3">{obs.length.toFixed(2)}</td>
                    <td className="py-2.5 px-3">{obs.initialAngleDeg.toFixed(0)}°</td>
                    <td className="py-2.5 px-3">{obs.gravity.toFixed(2)}</td>
                    <td className="py-2.5 px-3">{obs.mass.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-[#93C5FD]">
                      {obs.theoreticalPeriod.toFixed(4)} s
                    </td>
                    <td className="py-2.5 px-3 text-[#38BDF8]">
                      {obs.measuredPeriod !== null
                        ? `${obs.measuredPeriod.toFixed(4)} s`
                        : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-[#CBD5E1] max-w-[160px] truncate">
                      {obs.note || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteObservation(obs.id)}
                        aria-label={`Delete trial ${obs.trialNumber}`}
                        className="p-1 rounded text-[#94A3B8] hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Theoretical vs Measured Length Comparison Chart */}
          <div className="xl:col-span-5 rounded-xl bg-[#101827] border border-[#24324B] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <h3 className="font-medium text-[#E2E8F0]">
                Period (T) vs. Length (L)
              </h3>
              <span className="font-mono text-[#94A3B8]">Theory vs. Measured</span>
            </div>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={comparisonData} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                  <CartesianGrid stroke="#24324B" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="length"
                    stroke="#64748B"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    tickFormatter={(v: number) => `${v}m`}
                  />
                  <YAxis
                    stroke="#64748B"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    tickFormatter={(v: number) => `${v}s`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101827',
                      borderColor: '#24324B',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: '"JetBrains Mono", monospace',
                      color: '#F5F4EF',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line
                    type="monotone"
                    dataKey="theoreticalPeriod"
                    name="Theoretical T"
                    stroke="#93C5FD"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="measuredPeriod"
                    name="Measured T"
                    stroke="#38BDF8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

PendulumAnalysisPanel.displayName = 'PendulumAnalysisPanel';
