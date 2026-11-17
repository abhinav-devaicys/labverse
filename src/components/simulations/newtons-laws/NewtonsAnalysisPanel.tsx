import React, { useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  exportNewtonsObservationsToCsv,
  type NewtonsObservation,
  type NewtonsParams,
} from '../../../simulation/newtonsLawsEngine';

interface NewtonsAnalysisPanelProps {
  params: NewtonsParams;
  netForceA: number;
  accelerationA: number;
  observations: NewtonsObservation[];
  onAddObservation: (note: string) => void;
  onDeleteObservation: (id: string) => void;
  onClearObservations: () => void;
}

export const NewtonsAnalysisPanel: React.FC<NewtonsAnalysisPanelProps> = React.memo(
  ({
    params,
    netForceA,
    accelerationA,
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
      const csv = exportNewtonsObservationsToCsv(observations);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'labverse-newtons-laws-observations.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    const chartData = observations.map((obs) => ({
      trial: `T${obs.trialNumber} (${obs.massA}kg)`,
      acceleration: Number(obs.accelerationA.toFixed(3)),
      netForceScaled: Number((obs.netForce / 10).toFixed(2)),
    }));

    return (
      <section
        aria-label="Experiment Analysis and CSV Export"
        className="bg-[#162033] border border-[#24324B] rounded-xl p-5 sm:p-6 space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5578F5]">
              Experiment Analysis
            </p>
            <h2 className="font-display text-xl font-semibold text-[#F5F4EF] mt-0.5">
              Observation Log &amp; Trial Comparison
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

        {/* Observation Capture Bar */}
        <form
          onSubmit={handleRecord}
          className="rounded-xl bg-[#101827] border border-[#24324B] p-4 flex flex-col lg:flex-row lg:items-center gap-4"
        >
          <div className="flex-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-[#CBD5E1]">
            <span>Mode: {params.mode}</span>
            <span>m₁ = {params.massA.toFixed(0)} kg</span>
            <span>μ = {params.frictionCoeff.toFixed(2)}</span>
            <span className="text-[#10B981]">F_net = {netForceA.toFixed(1)} N</span>
            <span className="text-[#38BDF8]">a₁ = {accelerationA.toFixed(2)} m/s²</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 lg:w-[440px]">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Observation note (e.g., 2x mass halves a)..."
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
              No trials recorded yet
            </p>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto">
              Run any mode and click Record Observation or Log Trial to compare force,
              friction, acceleration, momentum, and kinetic energy across runs—then export
              your full experiment log to CSV.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-7 overflow-x-auto rounded-xl border border-[#24324B] bg-[#101827]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#24324B] text-[#94A3B8] font-mono">
                    <th className="py-3 px-2.5">#</th>
                    <th className="py-3 px-2.5">Mode</th>
                    <th className="py-3 px-2.5">m₁ (kg)</th>
                    <th className="py-3 px-2.5">F_net (N)</th>
                    <th className="py-3 px-2.5">a₁ (m/s²)</th>
                    <th className="py-3 px-2.5">v₁ (m/s)</th>
                    <th className="py-3 px-2.5">x₁ (m)</th>
                    <th className="py-3 px-2.5">Ek (J)</th>
                    <th className="py-3 px-2.5">Note</th>
                    <th className="py-3 px-2.5 text-right">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#24324B] font-mono tabular-nums text-[#E2E8F0]">
                  {observations.map((obs) => (
                    <tr key={obs.id} className="hover:bg-[#162033]/60">
                      <td className="py-2.5 px-2.5 text-[#94A3B8]">{obs.trialNumber}</td>
                      <td className="py-2.5 px-2.5 font-sans text-[#CBD5E1] whitespace-nowrap">
                        {obs.mode}
                      </td>
                      <td className="py-2.5 px-2.5">{obs.massA.toFixed(0)}</td>
                      <td className="py-2.5 px-2.5 text-[#10B981]">
                        {obs.netForce.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-2.5 text-[#38BDF8]">
                        {obs.accelerationA.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2.5">{obs.velocityA.toFixed(2)}</td>
                      <td className="py-2.5 px-2.5">{obs.displacementA.toFixed(2)}</td>
                      <td className="py-2.5 px-2.5">{obs.kineticEnergyA.toFixed(1)}</td>
                      <td className="py-2.5 px-2.5 font-sans text-[#CBD5E1] max-w-[140px] truncate">
                        {obs.note || '—'}
                      </td>
                      <td className="py-2.5 px-2.5 text-right">
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

            <div className="xl:col-span-5 rounded-xl bg-[#101827] border border-[#24324B] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <h3 className="font-medium text-[#E2E8F0]">
                  Trial Comparison (a vs. F_net / 10)
                </h3>
                <span className="font-mono text-[#94A3B8]">F = ma</span>
              </div>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                    <CartesianGrid stroke="#24324B" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="trial"
                      stroke="#64748B"
                      tick={{ fill: '#94A3B8', fontSize: 10 }}
                    />
                    <YAxis
                      stroke="#64748B"
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
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
                    <Bar dataKey="acceleration" name="a (m/s²)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="netForceScaled" name="F_net / 10 (N)" fill="#5578F5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
);

NewtonsAnalysisPanel.displayName = 'NewtonsAnalysisPanel';
