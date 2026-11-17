import React, { useCallback, useEffect, useRef } from 'react';
import {
  computePendulumTelemetry,
  radToDeg,
  type PendulumParams,
  type PendulumState,
} from '../../../simulation/pendulumEngine';
import type { PendulumVisualOptions } from './PendulumControlsPanel';

interface TrailPoint {
  x: number;
  y: number;
}

interface PendulumCanvasStageProps {
  stateRef: React.MutableRefObject<PendulumState>;
  paramsRef: React.MutableRefObject<PendulumParams>;
  visualOptionsRef: React.MutableRefObject<PendulumVisualOptions>;
  params: PendulumParams;
  visualOptions: PendulumVisualOptions;
  isRunning: boolean;
  hasStarted: boolean;
  trailVersion: number;
  registerDraw: (fn: () => void) => void;
  onDragAngle: (angleDeg: number) => void;
}

export const PendulumCanvasStage: React.FC<PendulumCanvasStageProps> = React.memo(
  ({
    stateRef,
    paramsRef,
    visualOptionsRef,
    params,
    visualOptions,
    isRunning,
    hasStarted,
    trailVersion,
    registerDraw,
    onDragAngle,
  }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const bgKeyRef = useRef<string>('');
    const trailRef = useRef<TrailPoint[]>([]);
    const isDraggingRef = useRef(false);
    const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

    // Clear trail on explicit reset or major parameter change
    useEffect(() => {
      trailRef.current = [];
    }, [trailVersion]);

    const ensureBackgroundLayer = useCallback(
      (width: number, height: number, dpr: number, length: number, vis: PendulumVisualOptions) => {
        const key = `${width}x${height}x${dpr}|${length.toFixed(2)}|${vis.showGrid}|${vis.showEquilibrium}`;
        if (bgKeyRef.current === key && bgCanvasRef.current) {
          return bgCanvasRef.current;
        }

        if (!bgCanvasRef.current) {
          bgCanvasRef.current = document.createElement('canvas');
        }
        const bg = bgCanvasRef.current;
        bg.width = Math.floor(width * dpr);
        bg.height = Math.floor(height * dpr);

        const bctx = bg.getContext('2d');
        if (!bctx) return bg;

        bctx.save();
        bctx.scale(dpr, dpr);

        // Deep navy lab background
        bctx.fillStyle = '#0B111E';
        bctx.fillRect(0, 0, width, height);

        const pivotX = width / 2;
        const pivotY = Math.max(46, height * 0.14);
        const maxArmPx = Math.min(width * 0.42, height * 0.7);
        const pxPerMeter = maxArmPx / 3.0;
        const armPx = length * pxPerMeter;

        // 1. Grid & reference markers
        if (vis.showGrid) {
          const gridStep = Math.max(24, pxPerMeter * 0.5);
          bctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
          bctx.lineWidth = 1;

          bctx.beginPath();
          for (let x = pivotX % gridStep; x < width; x += gridStep) {
            bctx.moveTo(x, 0);
            bctx.lineTo(x, height);
          }
          for (let y = pivotY % gridStep; y < height; y += gridStep) {
            bctx.moveTo(0, y);
            bctx.lineTo(width, y);
          }
          bctx.stroke();

          // Radial sweep arc
          bctx.save();
          bctx.setLineDash([4, 5]);
          bctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
          bctx.beginPath();
          bctx.arc(
            pivotX,
            pivotY,
            armPx,
            Math.PI / 2 - (65 * Math.PI) / 180,
            Math.PI / 2 + (65 * Math.PI) / 180
          );
          bctx.stroke();
          bctx.restore();

          // 1.0 m scale bar
          const scaleY = height - 22;
          bctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
          bctx.lineWidth = 1.25;
          bctx.beginPath();
          bctx.moveTo(20, scaleY);
          bctx.lineTo(20 + pxPerMeter, scaleY);
          bctx.moveTo(20, scaleY - 4);
          bctx.lineTo(20, scaleY + 4);
          bctx.moveTo(20 + pxPerMeter, scaleY - 4);
          bctx.lineTo(20 + pxPerMeter, scaleY + 4);
          bctx.stroke();
          bctx.fillStyle = '#94A3B8';
          bctx.font = '11px "JetBrains Mono", monospace';
          bctx.fillText('1.0 m scale', 20, scaleY - 8);
        }

        // Pivot mount beam
        bctx.strokeStyle = '#334155';
        bctx.lineWidth = 3;
        bctx.beginPath();
        bctx.moveTo(pivotX - 48, pivotY);
        bctx.lineTo(pivotX + 48, pivotY);
        bctx.stroke();

        // 2. Equilibrium indicator
        if (vis.showEquilibrium) {
          bctx.save();
          bctx.setLineDash([5, 5]);
          bctx.strokeStyle = 'rgba(56, 189, 248, 0.38)';
          bctx.lineWidth = 1.25;
          bctx.beginPath();
          bctx.moveTo(pivotX, pivotY);
          bctx.lineTo(pivotX, pivotY + armPx + 22);
          bctx.stroke();
          bctx.restore();

          bctx.beginPath();
          bctx.arc(pivotX, pivotY + armPx, 4, 0, Math.PI * 2);
          bctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
          bctx.fill();

          bctx.fillStyle = '#38BDF8';
          bctx.font = '10px "JetBrains Mono", monospace';
          bctx.textAlign = 'center';
          bctx.fillText('θ = 0° (Equilibrium)', pivotX, pivotY + armPx + 36);
          bctx.textAlign = 'left';
        }

        bctx.restore();
        bgKeyRef.current = key;
        return bg;
      },
      []
    );

    const drawFrame = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { width, height, dpr } = sizeRef.current;
      if (width === 0 || height === 0) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const simState = stateRef.current;
      const p = paramsRef.current;
      const vis = visualOptionsRef.current;

      // Blit cached static background layer
      const bg = ensureBackgroundLayer(width, height, dpr, p.length, vis);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(bg, 0, 0);
      ctx.scale(dpr, dpr);

      const pivotX = width / 2;
      const pivotY = Math.max(46, height * 0.14);
      const maxArmPx = Math.min(width * 0.42, height * 0.7);
      const pxPerMeter = maxArmPx / 3.0;
      const armPx = p.length * pxPerMeter;

      const sinT = Math.sin(simState.theta);
      const cosT = Math.cos(simState.theta);
      const bobX = pivotX + armPx * sinT;
      const bobY = pivotY + armPx * cosT;

      // Update and render motion trail directly inside drawFrame
      if (vis.showTrail) {
        const trail = trailRef.current;
        const last = trail[trail.length - 1];
        if (!last || Math.hypot(bobX - last.x, bobY - last.y) > 2.5) {
          trail.push({ x: bobX, y: bobY });
          if (trail.length > 75) {
            trail.shift();
          }
        }
        if (trail.length > 1) {
          ctx.lineWidth = 2;
          for (let i = 1; i < trail.length; i++) {
            const alpha = (i / trail.length) * 0.65;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(2)})`;
            ctx.beginPath();
            ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
            ctx.lineTo(trail[i].x, trail[i].y);
            ctx.stroke();
          }
        }
      }

      // Angle measurement arc
      if (vis.showAngleArc && Math.abs(simState.theta) > 0.005) {
        const arcRadius = Math.min(68, Math.max(34, armPx * 0.34));
        const verticalAngle = Math.PI / 2;
        const rodCanvasAngle = Math.PI / 2 - simState.theta;

        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.arc(
          pivotX,
          pivotY,
          arcRadius,
          Math.min(verticalAngle, rodCanvasAngle),
          Math.max(verticalAngle, rodCanvasAngle)
        );
        ctx.closePath();
        ctx.fillStyle = 'rgba(85, 120, 245, 0.18)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
          pivotX,
          pivotY,
          arcRadius,
          Math.min(verticalAngle, rodCanvasAngle),
          Math.max(verticalAngle, rodCanvasAngle)
        );
        ctx.strokeStyle = '#5578F5';
        ctx.lineWidth = 1.75;
        ctx.stroke();

        const midAngle = (verticalAngle + rodCanvasAngle) / 2;
        const labelR = arcRadius + 16;
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${radToDeg(simState.theta).toFixed(1)}°`,
          pivotX + labelR * Math.cos(midAngle),
          pivotY + labelR * Math.sin(midAngle) + 4
        );
        ctx.textAlign = 'left';
      }

      // Pendulum rod
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Pendulum length measurement bracket
      if (vis.showLengthMeasure) {
        const perpX = cosT * 18;
        const perpY = -sinT * 18;
        const x1 = pivotX + perpX;
        const y1 = pivotY + perpY;
        const x2 = bobX + perpX;
        const y2 = bobY + perpY;

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.72)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const midX = (x1 + x2) / 2 + perpX * 0.45;
        const midY = (y1 + y2) / 2 + perpY * 0.45;
        ctx.fillStyle = '#FBBF24';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`L = ${p.length.toFixed(2)} m`, midX, midY);
        ctx.textAlign = 'left';
      }

      // Tangent velocity arrow
      if (Math.abs(simState.omega) > 0.02) {
        const vScale = Math.min(54, Math.max(-54, simState.omega * p.length * 14));
        const vx = vScale * cosT;
        const vy = -vScale * sinT;
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(bobX + vx, bobY + vy);
        ctx.stroke();
      }

      // Pivot joint
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#F5F4EF';
      ctx.fill();
      ctx.strokeStyle = '#5578F5';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pendulum bob
      const bobRadius = 11 + Math.min(13, (p.mass / 5.0) * 13);
      const bobGrad = ctx.createRadialGradient(
        bobX - bobRadius * 0.3,
        bobY - bobRadius * 0.3,
        2,
        bobX,
        bobY,
        bobRadius
      );
      bobGrad.addColorStop(0, '#93C5FD');
      bobGrad.addColorStop(0.55, '#5578F5');
      bobGrad.addColorStop(1, '#1E3A8A');

      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
      ctx.fillStyle = bobGrad;
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Energy Visualization overlay
      if (vis.showEnergyViz) {
        const tel = computePendulumTelemetry(simState, p);
        const totalMax = Math.max(0.001, tel.totalEnergy);
        const barH = 92;
        const barW = 12;
        const bx = width - 118;
        const by = 22;

        ctx.fillStyle = 'rgba(16, 24, 39, 0.85)';
        ctx.strokeStyle = 'rgba(36, 50, 75, 0.9)';
        ctx.lineWidth = 1;
        ctx.fillRect(bx - 12, by - 10, 114, barH + 46);
        ctx.strokeRect(bx - 12, by - 10, 114, barH + 46);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText('ENERGY (J)', bx, by + 2);

        const bars = [
          { label: 'Ek', val: tel.kineticEnergy, color: '#38BDF8', x: bx + 6 },
          { label: 'Ep', val: tel.potentialEnergy, color: '#F59E0B', x: bx + 38 },
          { label: 'Et', val: tel.totalEnergy, color: '#5578F5', x: bx + 70 },
        ];

        for (let i = 0; i < bars.length; i++) {
          const b = bars[i];
          const fillRatio = Math.min(1, Math.max(0, b.val / totalMax));
          const h = fillRatio * (barH - 20);
          const topY = by + 12 + (barH - 20 - h);

          ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
          ctx.fillRect(b.x, by + 12, barW, barH - 20);

          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, topY, barW, h);

          ctx.fillStyle = '#CBD5E1';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(b.label, b.x - 1, by + barH + 6);
        }
      }

      ctx.restore();
    }, [ensureBackgroundLayer, paramsRef, stateRef, visualOptionsRef]);

    // Register imperative draw callback for the parent rAF loop
    useEffect(() => {
      registerDraw(drawFrame);
    }, [registerDraw, drawFrame]);

    // Sync canvas backing dimensions and redraw on resize or visual/param prop changes
    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const updateSizeAndDraw = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        sizeRef.current = { width, height, dpr };
        if (width > 0 && height > 0) {
          const targetW = Math.floor(width * dpr);
          const targetH = Math.floor(height * dpr);
          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }
          drawFrame();
        }
      };

      updateSizeAndDraw();
      const observer = new ResizeObserver(updateSizeAndDraw);
      observer.observe(container);
      return () => observer.disconnect();
    }, [drawFrame, params, visualOptions]);

    const updateAngleFromPointer = (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const pivotX = rect.width / 2;
      const pivotY = Math.max(46, rect.height * 0.14);
      const dx = clientX - rect.left - pivotX;
      const dy = Math.max(10, clientY - rect.top - pivotY);
      const angleDeg = Math.round(radToDeg(Math.atan2(dx, dy)));
      const clamped = Math.min(60, Math.max(5, Math.abs(angleDeg)));
      onDragAngle(clamped);
    };

    return (
      <div
        ref={containerRef}
        className="relative w-full h-[380px] sm:h-[440px] lg:h-[490px] rounded-xl overflow-hidden border border-[#24324B] bg-[#0B111E]"
      >
        <canvas
          ref={canvasRef}
          aria-label="Interactive simple pendulum simulation canvas"
          onPointerDown={(e) => {
            if (isRunning) return;
            isDraggingRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            updateAngleFromPointer(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!isDraggingRef.current || isRunning) return;
            updateAngleFromPointer(e.clientX, e.clientY);
          }}
          onPointerUp={() => {
            isDraggingRef.current = false;
          }}
          className={`w-full h-full block ${isRunning ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
        />

        {!isRunning && !hasStarted && (
          <div className="pointer-events-none absolute bottom-3 right-3 px-3 py-1.5 rounded-md bg-[#101827]/85 border border-[#24324B] text-[11px] font-mono text-[#94A3B8]">
            Drag bob or adjust θ₀ slider to set release angle
          </div>
        )}
      </div>
    );
  }
);

PendulumCanvasStage.displayName = 'PendulumCanvasStage';
