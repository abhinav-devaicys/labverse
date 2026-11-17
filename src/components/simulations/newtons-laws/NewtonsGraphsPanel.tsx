import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import type {
  NewtonsLawMode,
  NewtonsSamplePoint,
} from '../../../simulation/newtonsLawsEngine';

type NewtonsGraphTab = 'all' | 'force' | 'velocity' | 'acceleration' | 'displacement';

interface NewtonsGraphsPanelProps {
  mode: NewtonsLawMode;
  samplesRef: React.MutableRefObject<NewtonsSamplePoint[]>;
  registerGraphDraw: (fn: () => void) => void;
  isRunning: boolean;
  onToggleRun: () => void;
  onResetGraphs: () => void;
}

interface SeriesConfig {
  key: keyof NewtonsSamplePoint;
  label: string;
  color: string;
  dashed?: boolean;
}

interface PlotCanvasProps {
  plotId: string;
  title: string;
  unitLabel: string;
  series: SeriesConfig[];
  samplesRef: React.MutableRefObject<NewtonsSamplePoint[]>;
  height: number;
  registerRedraw: (id: string, fn: () => void) => void;
  unregisterRedraw: (id: string) => void;
}

const PlotCanvas: React.FC<PlotCanvasProps> = ({
  plotId,
  title,
  unitLabel,
  series,
  samplesRef,
  height,
  registerRedraw,
  unregisterRedraw,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverXRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = sizeRef.current.width;
    if (width <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.floor(width * dpr);
    const targetH = Math.floor(height * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#0D1422';
    ctx.fillRect(0, 0, width, height);

    const padLeft = 48;
    const padRight = 14;
    const padTop = 14;
    const padBottom = 26;
    const plotW = Math.max(40, width - padLeft - padRight);
    const plotH = Math.max(40, height - padTop - padBottom);

    const samples = samplesRef.current;
    if (samples.length === 0) {
      ctx.restore();
      return;
    }

    const tMin = samples[0].t;
    const tMax = Math.max(tMin + 1, samples[samples.length - 1].t);
    const tSpan = tMax - tMin;

    let yMin = Number.POSITIVE_INFINITY;
    let yMax = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < samples.length; i++) {
      const pt = samples[i];
      for (let s = 0; s < series.length; s++) {
        const val = pt[series[s].key];
        if (val < yMin) yMin = val;
        if (val > yMax) yMax = val;
      }
    }

    const padVal = Math.max(1, (yMax - yMin) * 0.14);
    if (yMin === yMax) {
      yMin -= 2;
      yMax += 2;
    } else {
      yMin -= padVal * 0.5;
      yMax += padVal * 0.5;
    }
    const ySpan = Math.max(0.001, yMax - yMin);

    const toX = (t: number) => padLeft + ((t - tMin) / tSpan) * plotW;
    const toY = (v: number) => padTop + ((yMax - v) / ySpan) * plotH;

    // Grid & Y ticks
    ctx.strokeStyle = 'rgba(36, 50, 75, 0.85)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const frac = i / 4;
      const val = yMax - frac * ySpan;
      const py = padTop + frac * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, py);
      ctx.lineTo(padLeft + plotW, py);
      ctx.stroke();

      const formatted = Math.abs(val) >= 10 ? val.toFixed(1) : val.toFixed(2);
      ctx.fillText(formatted, padLeft - 6, py + 3);
    }

    if (yMin < 0 && yMax > 0) {
      const y0 = toY(0);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.beginPath();
      ctx.moveTo(padLeft, y0);
      ctx.lineTo(padLeft + plotW, y0);
      ctx.stroke();
    }

    // X ticks
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const frac = i / 4;
      const px = padLeft + frac * plotW;
      const tVal = tMin + frac * tSpan;
      ctx.strokeStyle = 'rgba(36, 50, 75, 0.55)';
      ctx.beginPath();
      ctx.moveTo(px, padTop);
      ctx.lineTo(px, padTop + plotH);
      ctx.stroke();
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(`${tVal.toFixed(1)}s`, px, padTop + plotH + 15);
    }
    ctx.textAlign = 'left';

    // Clip curves inside plot bounds
    ctx.save();
    ctx.beginPath();
    ctx.rect(padLeft, padTop, plotW, plotH);
    ctx.clip();

    for (let s = 0; s < series.length; s++) {
      const ser = series[s];
      ctx.beginPath();
      ctx.strokeStyle = ser.color;
      ctx.lineWidth = ser.dashed ? 1.5 : 2;
      ctx.setLineDash(ser.dashed ? [4, 3] : []);
      for (let i = 0; i < samples.length; i++) {
        const px = toX(samples[i].t);
        const py = toY(samples[i][ser.key]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();

    // Hover crosshair & readout
    const hoverX = hoverXRef.current;
    if (hoverX !== null && hoverX >= padLeft && hoverX <= padLeft + plotW && samples.length > 0) {
      const targetTime = tMin + ((hoverX - padLeft) / plotW) * tSpan;
      let nearestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < samples.length; i++) {
        const d = Math.abs(samples[i].t - targetTime);
        if (d < bestDist) {
          bestDist = d;
          nearestIdx = i;
        }
      }

      const pt = samples[nearestIdx];
      const snapX = toX(pt.t);

      ctx.strokeStyle = 'rgba(226, 232, 240, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(snapX, padTop);
      ctx.lineTo(snapX, padTop + plotH);
      ctx.stroke();

      for (let s = 0; s < series.length; s++) {
        const ser = series[s];
        const snapY = toY(pt[ser.key]);
        ctx.beginPath();
        ctx.arc(snapX, snapY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = ser.color;
        ctx.fill();
      }

      const lines = [
        `t = ${pt.t.toFixed(2)} s`,
        ...series.map((ser) => `${ser.label}: ${pt[ser.key].toFixed(2)}`),
      ];
      const boxW = 148;
      const boxH = 14 + lines.length * 14;
      const boxX = snapX + boxW + 14 < width ? snapX + 10 : snapX - boxW - 10;
      const boxY = padTop + 6;

      ctx.fillStyle = 'rgba(16, 24, 39, 0.94)';
      ctx.strokeStyle = '#3B517A';
      ctx.lineWidth = 1;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.font = '10px "JetBrains Mono", monospace';
      lines.forEach((line, idx) => {
        ctx.fillStyle = idx === 0 ? '#94A3B8' : series[idx - 1].color;
        ctx.fillText(line, boxX + 8, boxY + 14 + idx * 14);
      });
    }

    ctx.restore();
  }, [height, samplesRef, series]);

  useEffect(() => {
    registerRedraw(plotId, draw);
    return () => unregisterRedraw(plotId);
  }, [plotId, draw, registerRedraw, unregisterRedraw]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      sizeRef.current = { width: container.clientWidth, height };
      draw();
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [draw, height]);

  return (
    <div className="rounded-xl bg-[#101827] border border-[#24324B] p-4 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <h3 className="font-medium text-[#E2E8F0]">{title}</h3>
        <div className="flex items-center gap-3">
          {series.length > 1 && (
            <div className="flex items-center gap-2 text-[11px] font-mono">
              {series.map((s) => (
                <span
                  key={String(s.key)}
                  className="inline-flex items-center gap-1"
                  style={{ color: s.color }}
                >
                  <span>—</span>
                  <span>{s.label}</span>
                </span>
              ))}
            </div>
          )}
          <span className="font-mono text-[#94A3B8]">{unitLabel}</span>
        </div>
      </div>

      <div ref={containerRef} style={{ width: '100%', height }}>
        <canvas
          ref={canvasRef}
          aria-label={`${title} graph`}
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            hoverXRef.current = e.clientX - rect.left;
            draw();
          }}
          onPointerLeave={() => {
            hoverXRef.current = null;
            draw();
          }}
          className="w-full h-full block rounded-lg cursor-crosshair"
        />
      </div>
    </div>
  );
};

const FORCE_SERIES: SeriesConfig[] = [
  { key: 'appliedForce', label: 'F_app', color: '#5578F5' },
  { key: 'frictionForce', label: 'F_f', color: '#F59E0B' },
  { key: 'netForce', label: 'F_net', color: '#10B981', dashed: true },
];

export const NewtonsGraphsPanel: React.FC<NewtonsGraphsPanelProps> = React.memo(
  ({ mode, samplesRef, registerGraphDraw, isRunning, onToggleRun, onResetGraphs }) => {
    const [activeTab, setActiveTab] = useState<NewtonsGraphTab>('all');
    const plotDrawsRef = useRef<Map<string, () => void>>(new Map());

    const registerRedraw = useCallback((id: string, fn: () => void) => {
      plotDrawsRef.current.set(id, fn);
    }, []);

    const unregisterRedraw = useCallback((id: string) => {
      plotDrawsRef.current.delete(id);
    }, []);

    const drawAllGraphs = useCallback(() => {
      plotDrawsRef.current.forEach((fn) => fn());
    }, []);

    useEffect(() => {
      registerGraphDraw(drawAllGraphs);
    }, [registerGraphDraw, drawAllGraphs]);

    const velocitySeries = useMemo<SeriesConfig[]>(
      () =>
        mode === 'third-law'
          ? [
              { key: 'velocityA', label: 'v₁ (A)', color: '#5578F5' },
              { key: 'velocityB', label: 'v₂ (B)', color: '#38BDF8' },
            ]
          : [{ key: 'velocityA', label: 'v (m/s)', color: '#38BDF8' }],
      [mode]
    );

    const accelSeries = useMemo<SeriesConfig[]>(
      () =>
        mode === 'third-law'
          ? [
              { key: 'accelerationA', label: 'a₁ (A)', color: '#5578F5' },
              { key: 'accelerationB', label: 'a₂ (B)', color: '#10B981' },
            ]
          : [{ key: 'accelerationA', label: 'a (m/s²)', color: '#10B981' }],
      [mode]
    );

    const displacementSeries = useMemo<SeriesConfig[]>(
      () =>
        mode === 'third-law'
          ? [
              { key: 'displacementA', label: 'x₁ (A)', color: '#5578F5' },
              { key: 'displacementB', label: 'x₂ (B)', color: '#38BDF8' },
            ]
          : [{ key: 'displacementA', label: 'x (m)', color: '#93C5FD' }],
      [mode]
    );

    const gridCols = activeTab === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1';
    const chartHeight = activeTab === 'all' ? 210 : 300;

    return (
      <section
        aria-label="Live Force and Motion Graphs"
        className="bg-[#162033] border border-[#24324B] rounded-xl p-5 sm:p-6 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5578F5]">
              Time-Series Plots · Hover to Inspect Data
            </p>
            <h2 className="font-display text-xl font-semibold text-[#F5F4EF] mt-0.5">
              Live Scientific Graphs
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="tablist"
              aria-label="Graph view mode"
              className="inline-flex flex-wrap items-center rounded-lg bg-[#101827] border border-[#24324B] p-0.5"
            >
              {(
                [
                  ['all', 'All 4 Graphs'],
                  ['force', 'Force'],
                  ['velocity', 'Velocity'],
                  ['acceleration', 'Acceleration'],
                  ['displacement', 'Displacement'],
                ] as [NewtonsGraphTab, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === key
                      ? 'bg-[#5578F5] text-white'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onToggleRun}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101827] border border-[#24324B] text-xs font-medium text-[#E2E8F0] hover:border-[#5578F5] transition-colors cursor-pointer whitespace-nowrap"
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Resume</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onResetGraphs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101827] border border-[#24324B] text-xs font-medium text-[#CBD5E1] hover:border-[#94A3B8] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear Graphs</span>
            </button>
          </div>
        </div>

        <div className={`grid ${gridCols} gap-5`}>
          {(activeTab === 'all' || activeTab === 'force') && (
            <PlotCanvas
              plotId="force"
              title="Force vs. Time"
              unitLabel="F (N)"
              series={FORCE_SERIES}
              samplesRef={samplesRef}
              height={chartHeight}
              registerRedraw={registerRedraw}
              unregisterRedraw={unregisterRedraw}
            />
          )}

          {(activeTab === 'all' || activeTab === 'velocity') && (
            <PlotCanvas
              plotId="velocity"
              title="Velocity vs. Time"
              unitLabel="v (m/s)"
              series={velocitySeries}
              samplesRef={samplesRef}
              height={chartHeight}
              registerRedraw={registerRedraw}
              unregisterRedraw={unregisterRedraw}
            />
          )}

          {(activeTab === 'all' || activeTab === 'acceleration') && (
            <PlotCanvas
              plotId="acceleration"
              title="Acceleration vs. Time"
              unitLabel="a (m/s²)"
              series={accelSeries}
              samplesRef={samplesRef}
              height={chartHeight}
              registerRedraw={registerRedraw}
              unregisterRedraw={unregisterRedraw}
            />
          )}

          {(activeTab === 'all' || activeTab === 'displacement') && (
            <PlotCanvas
              plotId="displacement"
              title="Displacement vs. Time"
              unitLabel="x (m)"
              series={displacementSeries}
              samplesRef={samplesRef}
              height={chartHeight}
              registerRedraw={registerRedraw}
              unregisterRedraw={unregisterRedraw}
            />
          )}
        </div>
      </section>
    );
  }
);

NewtonsGraphsPanel.displayName = 'NewtonsGraphsPanel';
