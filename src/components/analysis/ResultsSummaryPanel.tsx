import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Download } from 'lucide-react';
import { generateTelemetryPreviewData } from '../../services/experimentService';
import type { SimulationModule } from '../../types/simulation';
import { downloadCsvFile } from '../../utils/formatters';

interface ResultsSummaryPanelProps {
  simulation: SimulationModule;
  params: Record<string, number>;
}

export const ResultsSummaryPanel: React.FC<ResultsSummaryPanelProps> = ({
  simulation,
  params,
}) => {
  const damping = params.damping ?? params.frictionCoeff ?? 0.06;
  const data = useMemo(() => generateTelemetryPreviewData(damping, 2.2, 48), [damping]);

  const handleExport = () => {
    downloadCsvFile(
      `${simulation.slug}-preview-data.csv`,
      data.map((d) => ({
        time_s: d.t,
        response_primary: d.primary,
        envelope: d.envelope,
      }))
    );
  };

  return (
    <div className="rounded-xl bg-[#0D1422] border border-slate-800 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
            Analytical Response Preview
          </h3>
          <p className="text-[11px] text-slate-500">
            Sample model curve synced to staged parameters
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#131B29] border border-slate-700 hover:border-slate-500 text-[11px] font-mono text-slate-200 transition-colors cursor-pointer"
        >
          <Download className="w-3 h-3 text-[#22D3EE]" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
            <XAxis
              dataKey="t"
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
              dataKey="primary"
              name="Model Output"
              stroke="#5578F5"
              fill="#5578F5"
              fillOpacity={0.2}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
