import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';

type SpectrumPreset = 'amber' | 'cyan';

export const BohrAtomCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotionPref();
  const [frequencyGhz, setFrequencyGhz] = useState<number>(4.52);
  const [spinInverted, setSpinInverted] = useState<boolean>(false);
  const [spectrum, setSpectrum] = useState<SpectrumPreset>('amber');

  const accentHex = spectrum === 'amber' ? '#F59E0B' : '#22D3EE';
  const wavelengthLabel = spectrum === 'amber' ? '589.0 nm' : '486.1 nm';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let angle = 0.4;
    let lastTime = performance.now();

    const drawFrame = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
          canvas.width = Math.round(rect.width * dpr);
          canvas.height = Math.round(rect.height * dpr);
        }
      }

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      if (w === 0 || h === 0) {
        animationFrameId = requestAnimationFrame(drawFrame);
        return;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const baseRadius = Math.min(w, h) * 0.4;

      if (!prefersReducedMotion) {
        const direction = spinInverted ? -1 : 1;
        angle += dt * (frequencyGhz * 0.24) * direction;
      }

      // Outer quantum shell rings
      const shells = [
        { r: baseRadius * 0.34, label: 'n=1', color: 'rgba(148, 163, 184, 0.28)', dash: [] as number[] },
        { r: baseRadius * 0.65, label: 'n=2', color: 'rgba(85, 120, 245, 0.42)', dash: [4, 4] },
        { r: baseRadius * 0.96, label: 'n=3', color: 'rgba(34, 211, 238, 0.26)', dash: [] as number[] },
      ];

      shells.forEach((shell) => {
        ctx.beginPath();
        ctx.setLineDash(shell.dash);
        ctx.strokeStyle = shell.color;
        ctx.lineWidth = 1.25;
        ctx.arc(cx, cy, shell.r, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Tilted elliptical probability orbits
      const tilts = [Math.PI / 6, -Math.PI / 4];
      tilts.forEach((tilt, idx) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tilt);
        ctx.beginPath();
        ctx.strokeStyle = idx === 0 ? 'rgba(85, 120, 245, 0.24)' : 'rgba(245, 158, 11, 0.20)';
        ctx.lineWidth = 1;
        ctx.ellipse(0, 0, baseRadius * 0.92, baseRadius * 0.36, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Photon transition arc from n=3 to n=2
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = accentHex;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.moveTo(cx + baseRadius * 0.65 * Math.cos(-0.6), cy + baseRadius * 0.65 * Math.sin(-0.6));
      ctx.lineTo(cx + baseRadius * 0.96 * Math.cos(-0.85), cy + baseRadius * 0.96 * Math.sin(-0.85));
      ctx.stroke();
      ctx.restore();

      // Nucleus core glow & nucleons
      const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 28);
      glow.addColorStop(0, spectrum === 'amber' ? 'rgba(245, 158, 11, 0.45)' : 'rgba(34, 211, 238, 0.45)');
      glow.addColorStop(1, 'rgba(16, 24, 39, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fill();

      const nucleons = [
        { dx: -4, dy: -3, c: '#5578F5' },
        { dx: 4, dy: -2, c: '#F59E0B' },
        { dx: -2, dy: 4, c: '#22D3EE' },
        { dx: 3, dy: 4, c: '#5578F5' },
        { dx: 0, dy: 0, c: '#F59E0B' },
      ];
      nucleons.forEach((n) => {
        ctx.beginPath();
        ctx.fillStyle = n.c;
        ctx.arc(cx + n.dx, cy + n.dy, 4.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Orbiting electrons
      const electrons = [
        { r: baseRadius * 0.34, speed: 1.9, offset: 0, color: '#60A5FA', size: 4.5 },
        { r: baseRadius * 0.34, speed: 1.9, offset: Math.PI, color: '#60A5FA', size: 4.5 },
        { r: baseRadius * 0.65, speed: 1.15, offset: 0.9, color: accentHex, size: 5.2 },
        { r: baseRadius * 0.65, speed: 1.15, offset: 0.9 + Math.PI * 0.66, color: '#22D3EE', size: 4.8 },
        { r: baseRadius * 0.65, speed: 1.15, offset: 0.9 + Math.PI * 1.33, color: '#22D3EE', size: 4.8 },
        { r: baseRadius * 0.96, speed: 0.7, offset: 2.2, color: accentHex, size: 5.5 },
      ];

      electrons.forEach((el) => {
        const theta = angle * el.speed + el.offset;
        const ex = cx + el.r * Math.cos(theta);
        const ey = cy + el.r * Math.sin(theta);

        ctx.beginPath();
        ctx.fillStyle = el.color;
        ctx.shadowColor = el.color;
        ctx.shadowBlur = 10;
        ctx.arc(ex, ey, el.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(drawFrame);
      }
    };

    animationFrameId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [frequencyGhz, spinInverted, spectrum, accentHex, prefersReducedMotion]);

  const electronVelocity = (2.18 * (frequencyGhz / 4.52)).toFixed(2);

  return (
    <div className="rounded-xl bg-[#101827] border border-slate-800 overflow-hidden flex flex-col h-full">
      {/* Instrument Header */}
      <div className="px-4 py-3 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2 bg-[#0D1422]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
            Bohr-Schrödinger Atomic Deck
          </span>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#090E18] border border-slate-800">
          <button
            type="button"
            onClick={() => setSpectrum('amber')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              spectrum === 'amber'
                ? 'bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Solar Amber 589nm
          </button>
          <button
            type="button"
            onClick={() => setSpectrum('cyan')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              spectrum === 'cyan'
                ? 'bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Balmer Cyan 486nm
          </button>
        </div>
      </div>

      {/* Orbital Canvas Viewport */}
      <div className="relative flex-1 min-h-[290px] sm:min-h-[330px] bg-lab-grid p-4 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full max-h-[320px] block"
          aria-label="Interactive Bohr-Schrödinger atomic orbital model"
        />

        {/* Scientific Telemetry Annotations */}
        <div className="pointer-events-none absolute top-3.5 left-4 space-y-1">
          <p className="font-mono text-[11px] text-slate-400">
            ψ(r,θ,φ) = R_nl(r) · Y_lm(θ,φ)
          </p>
          <p
            className="font-mono text-[11px]"
            style={{ color: accentHex }}
          >
            ΔE_emit = {wavelengthLabel}
          </p>
        </div>

        <div className="pointer-events-none absolute top-3.5 right-4 text-right">
          <p className="font-mono text-[11px] text-slate-400">
            v(e⁻): <span className="text-slate-200 tabular-nums">{electronVelocity} × 10⁶ m/s</span>
          </p>
        </div>

        <div className="pointer-events-none absolute bottom-3.5 left-4">
          <span className="font-mono text-[11px] text-slate-400">
            n=3 → n=2 transition
          </span>
        </div>

        <div className="pointer-events-none absolute bottom-3.5 right-4">
          <span className="font-mono text-[11px] text-[#5578F5]">
            E_n = -13.6 eV / n²
          </span>
        </div>
      </div>

      {/* Instrument Controls */}
      <div className="px-4 py-3.5 border-t border-slate-800/90 bg-[#0D1422] space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="hero-resonance-slider"
            className="text-xs text-slate-400 font-medium"
          >
            Field Resonance Frequency (ν)
          </label>
          <span className="font-mono text-xs tabular-nums text-[#22D3EE]">
            {frequencyGhz.toFixed(2)} GHz
          </span>
        </div>

        <input
          id="hero-resonance-slider"
          type="range"
          min={1.0}
          max={9.0}
          step={0.04}
          value={frequencyGhz}
          onChange={(e) => setFrequencyGhz(parseFloat(e.target.value))}
          className="w-full lab-slider"
        />

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={() => setSpinInverted((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#131B29] border border-slate-700/80 hover:border-slate-500 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Invert Spin Vector</span>
          </button>

          <span className="font-mono text-[11px] text-slate-400">
            Spin: {spinInverted ? 'Counter-CW (-½)' : 'Clockwise (+½)'}
          </span>
        </div>
      </div>
    </div>
  );
};
