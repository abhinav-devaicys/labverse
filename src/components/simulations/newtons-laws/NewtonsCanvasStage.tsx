import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import {
  computeNewtonsTelemetry,
  type NewtonsParams,
  type NewtonsState,
} from '../../../simulation/newtonsLawsEngine';
import type { NewtonsVisualOptions } from './NewtonsControlsPanel';

interface NewtonsCanvasStageProps {
  stateRef: React.MutableRefObject<NewtonsState>;
  paramsRef: React.MutableRefObject<NewtonsParams>;
  visualOptionsRef: React.MutableRefObject<NewtonsVisualOptions>;
  params: NewtonsParams;
  visualOptions: NewtonsVisualOptions;
  isRunning: boolean;
  hasStarted: boolean;
  registerDraw: (fn: () => void) => void;
  onDragBlockA: (newX: number) => void;
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  label?: string,
  labelOffsetY = -8
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 3) return;

  const angle = Math.atan2(dy, dx);
  const headLen = Math.min(10, Math.max(6, len * 0.28));

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLen * Math.cos(angle - Math.PI / 6),
    y2 - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    x2 - headLen * Math.cos(angle + Math.PI / 6),
    y2 - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  if (label) {
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, (x1 + x2) / 2, Math.min(y1, y2) + labelOffsetY);
  }
  ctx.restore();
}

export const NewtonsCanvasStage: React.FC<NewtonsCanvasStageProps> = React.memo(
  ({
    stateRef,
    paramsRef,
    visualOptionsRef,
    params,
    visualOptions,
    isRunning,
    hasStarted,
    registerDraw,
    onDragBlockA,
  }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
    const zoomRef = useRef(1.0);
    const followCameraRef = useRef(true);
    const isDraggingRef = useRef(false);

    const [zoomUi, setZoomUi] = useState(1.0);
    const [followCameraUi, setFollowCameraUi] = useState(true);

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
      const tel = computeNewtonsTelemetry(simState, p);

      ctx.save();
      ctx.scale(dpr, dpr);

      // Background navy viewport
      ctx.fillStyle = '#0B111E';
      ctx.fillRect(0, 0, width, height);

      const pxPerMeter = 36 * zoomRef.current;
      const groundY = Math.round(height * 0.68);

      // Camera world center (follows block midpoint in Mode C, or blockA in Modes A/B)
      const camCenterX = followCameraRef.current
        ? p.mode === 'third-law'
          ? (simState.blockA.x + simState.blockB.x) / 2
          : simState.blockA.x
        : 0;

      const worldToScreenX = (wx: number) => width / 2 + (wx - camCenterX) * pxPerMeter;

      // 1. Track Grid & Calibrated Meter Ruler
      if (vis.showGrid) {
        const meterStep = zoomRef.current < 0.7 ? 5 : zoomRef.current > 1.3 ? 1 : 2;
        const leftMeter = Math.floor(camCenterX - width / (2 * pxPerMeter)) - 1;
        const rightMeter = Math.ceil(camCenterX + width / (2 * pxPerMeter)) + 1;

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let m = Math.floor(leftMeter / meterStep) * meterStep; m <= rightMeter; m += meterStep) {
          const sx = worldToScreenX(m);
          ctx.moveTo(sx, 0);
          ctx.lineTo(sx, groundY);
        }
        for (let y = groundY - pxPerMeter; y > 0; y -= pxPerMeter) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Ruler ticks along track
        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        for (let m = Math.floor(leftMeter / meterStep) * meterStep; m <= rightMeter; m += meterStep) {
          const sx = worldToScreenX(m);
          ctx.strokeStyle = m === 0 ? 'rgba(56, 189, 248, 0.65)' : 'rgba(148, 163, 184, 0.35)';
          ctx.beginPath();
          ctx.moveTo(sx, groundY);
          ctx.lineTo(sx, groundY + (m === 0 ? 12 : 7));
          ctx.stroke();
          ctx.fillStyle = m === 0 ? '#38BDF8' : '#94A3B8';
          ctx.fillText(`${m} m`, sx, groundY + 24);
        }
        ctx.textAlign = 'left';
      }

      // Horizontal Surface & Friction Texture
      ctx.fillStyle = p.frictionCoeff === 0 ? '#0F1C2E' : '#131D2F';
      ctx.fillRect(0, groundY, width, height - groundY);

      ctx.strokeStyle = p.frictionCoeff === 0 ? '#38BDF8' : '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      if (p.frictionCoeff > 0) {
        const hatchSpacing = Math.max(8, 22 - p.frictionCoeff * 16);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const offsetPx = ((camCenterX * pxPerMeter) % hatchSpacing + hatchSpacing) % hatchSpacing;
        for (let hx = -offsetPx; hx < width + 16; hx += hatchSpacing) {
          ctx.moveTo(hx, groundY);
          ctx.lineTo(hx - 8, groundY + 10);
        }
        ctx.stroke();
      }

      // Origin vertical hairline
      const originX = worldToScreenX(0);
      if (originX > -20 && originX < width + 20) {
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.beginPath();
        ctx.moveTo(originX, 26);
        ctx.lineTo(originX, groundY);
        ctx.stroke();
        ctx.restore();
      }

      const drawBlockWithVectors = (
        xMeters: number,
        mass: number,
        bodyTel: typeof tel.bodyA,
        labelPrefix: string,
        accentColor: string,
        showDisplacementBracket: boolean
      ) => {
        const blockW = Math.max(46, Math.min(92, 42 + mass * 0.45));
        const blockH = Math.max(38, Math.min(72, 34 + mass * 0.34));
        const cx = worldToScreenX(xMeters);
        const topY = groundY - blockH;
        const centerY = topY + blockH / 2;

        // Displacement indicator from 0 m to current x
        if (vis.showDisplacement && showDisplacementBracket && Math.abs(xMeters) > 0.05) {
          const bracketY = groundY + 42;
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(originX, bracketY - 5);
          ctx.lineTo(originX, bracketY + 5);
          ctx.moveTo(originX, bracketY);
          ctx.lineTo(cx, bracketY);
          ctx.moveTo(cx, bracketY - 5);
          ctx.lineTo(cx, bracketY + 5);
          ctx.stroke();

          ctx.fillStyle = '#38BDF8';
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`Δx = ${xMeters >= 0 ? '+' : ''}${xMeters.toFixed(2)} m`, (originX + cx) / 2, bracketY + 16);
          ctx.textAlign = 'left';
        }

        // Block shadow & body
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.fillRect(cx - blockW / 2, topY, blockW, blockH);
        ctx.strokeRect(cx - blockW / 2, topY, blockW, blockH);

        ctx.fillStyle = '#F5F4EF';
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${mass.toFixed(0)} kg`, cx, centerY + 4);
        if (labelPrefix) {
          ctx.fillStyle = '#94A3B8';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(labelPrefix, cx, topY - 8);
        }
        ctx.textAlign = 'left';

        const forceScalePxPerN = 0.55;

        // Applied / Interaction force arrow
        if (vis.showForces && Math.abs(bodyTel.appliedForce) > 0.2) {
          const lenPx = Math.sign(bodyTel.appliedForce) * Math.max(22, Math.abs(bodyTel.appliedForce) * forceScalePxPerN);
          drawArrow(
            ctx,
            cx,
            centerY,
            cx + lenPx,
            centerY,
            '#5578F5',
            `F = ${bodyTel.appliedForce > 0 ? '+' : ''}${bodyTel.appliedForce.toFixed(0)} N`,
            -10
          );
        }

        // Friction force arrow at ground contact
        if (vis.showForces && Math.abs(bodyTel.frictionForce) > 0.2) {
          const lenPx = Math.sign(bodyTel.frictionForce) * Math.max(18, Math.abs(bodyTel.frictionForce) * forceScalePxPerN);
          drawArrow(
            ctx,
            cx,
            groundY - 6,
            cx + lenPx,
            groundY - 6,
            '#F59E0B',
            `F_f = ${bodyTel.frictionForce.toFixed(1)} N`,
            14
          );
        }

        // Net force arrow above block
        if (vis.showForces && Math.abs(bodyTel.netForce) > 0.2) {
          const lenPx = Math.sign(bodyTel.netForce) * Math.max(20, Math.abs(bodyTel.netForce) * forceScalePxPerN);
          drawArrow(
            ctx,
            cx,
            topY - 26,
            cx + lenPx,
            topY - 26,
            '#10B981',
            `F_net = ${bodyTel.netForce > 0 ? '+' : ''}${bodyTel.netForce.toFixed(1)} N`,
            -8
          );
        }

        // Normal & Weight vertical vectors
        if (vis.showNormalWeight) {
          const vLen = Math.min(72, Math.max(28, bodyTel.normalForce * 0.08));
          drawArrow(ctx, cx, topY, cx, topY - vLen, '#93C5FD', `N = ${bodyTel.normalForce.toFixed(0)} N`, -8);
          drawArrow(ctx, cx, groundY, cx, groundY + vLen, '#94A3B8', `mg = ${bodyTel.normalForce.toFixed(0)} N`, 14);
        }

        // Velocity vector above net force
        if (vis.showVelocity && Math.abs(bodyTel.velocity) > 0.05) {
          const velLen = Math.sign(bodyTel.velocity) * Math.min(110, Math.max(20, Math.abs(bodyTel.velocity) * 10));
          drawArrow(
            ctx,
            cx,
            topY - 56,
            cx + velLen,
            topY - 56,
            '#38BDF8',
            `v = ${bodyTel.velocity > 0 ? '+' : ''}${bodyTel.velocity.toFixed(2)} m/s`,
            -8
          );
        }
      };

      if (p.mode === 'third-law') {
        // Spring/actuator link when interaction force is active near center
        if (tel.activeInteractionForce > 0) {
          const ax = worldToScreenX(simState.blockA.x);
          const bx = worldToScreenX(simState.blockB.x);
          const midY = groundY - 24;
          ctx.strokeStyle = '#5578F5';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ax, midY);
          ctx.lineTo(bx, midY);
          ctx.stroke();
        }

        drawBlockWithVectors(simState.blockA.x, p.massA, tel.bodyA, 'Block A', '#5578F5', true);
        drawBlockWithVectors(simState.blockB.x, p.massB, tel.bodyB, 'Block B', '#38BDF8', false);
      } else {
        drawBlockWithVectors(simState.blockA.x, p.massA, tel.bodyA, '', '#5578F5', true);
      }

      // Surface label pill-free text indicator
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(
        p.frictionCoeff === 0
          ? 'Surface: Frictionless (μ = 0.00)'
          : `Surface Friction: μ = ${p.frictionCoeff.toFixed(2)}`,
        16,
        24
      );

      ctx.restore();
    }, [paramsRef, stateRef, visualOptionsRef]);

    useEffect(() => {
      registerDraw(drawFrame);
    }, [registerDraw, drawFrame]);

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

    const handleZoomChange = (delta: number) => {
      const next = Math.min(2.0, Math.max(0.5, Number((zoomRef.current + delta).toFixed(2))));
      zoomRef.current = next;
      setZoomUi(next);
      drawFrame();
    };

    const toggleFollowCamera = () => {
      const next = !followCameraRef.current;
      followCameraRef.current = next;
      setFollowCameraUi(next);
      drawFrame();
    };

    const updateXFromPointer = (clientX: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const pxPerMeter = 36 * zoomRef.current;
      const p = paramsRef.current;
      const simState = stateRef.current;
      const camCenterX = followCameraRef.current
        ? p.mode === 'third-law'
          ? (simState.blockA.x + simState.blockB.x) / 2
          : simState.blockA.x
        : 0;
      const newX = camCenterX + (clientX - rect.left - rect.width / 2) / pxPerMeter;
      const clamped = Math.min(12, Math.max(-12, Number(newX.toFixed(2))));
      onDragBlockA(clamped);
    };

    return (
      <div
        ref={containerRef}
        className="relative w-full h-[380px] sm:h-[440px] lg:h-[490px] rounded-xl overflow-hidden border border-[#24324B] bg-[#0B111E]"
      >
        <canvas
          ref={canvasRef}
          aria-label="Newton's Laws interactive horizontal track simulation"
          onPointerDown={(e) => {
            if (isRunning || params.mode === 'third-law') return;
            isDraggingRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            updateXFromPointer(e.clientX);
          }}
          onPointerMove={(e) => {
            if (!isDraggingRef.current || isRunning) return;
            updateXFromPointer(e.clientX);
          }}
          onPointerUp={() => {
            isDraggingRef.current = false;
          }}
          className={`w-full h-full block ${
            isRunning || params.mode === 'third-law'
              ? 'cursor-crosshair'
              : 'cursor-grab active:cursor-grabbing'
          }`}
        />

        {/* Camera & Zoom Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#101827]/90 border border-[#24324B] rounded-lg p-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => handleZoomChange(-0.25)}
            aria-label="Zoom out"
            className="p-1.5 rounded text-[#CBD5E1] hover:text-white hover:bg-[#162033] cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 text-[11px] text-[#94A3B8] tabular-nums">
            {zoomUi.toFixed(2)}×
          </span>
          <button
            type="button"
            onClick={() => handleZoomChange(0.25)}
            aria-label="Zoom in"
            className="p-1.5 rounded text-[#CBD5E1] hover:text-white hover:bg-[#162033] cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleFollowCamera}
            className={`px-2 py-1 rounded text-[11px] inline-flex items-center gap-1 cursor-pointer ${
              followCameraUi
                ? 'bg-[#5578F5]/25 text-[#93C5FD]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Maximize2 className="w-3 h-3" aria-hidden="true" />
            <span>{followCameraUi ? 'Follow' : 'Origin'}</span>
          </button>
        </div>

        {!isRunning && !hasStarted && params.mode !== 'third-law' && (
          <div className="pointer-events-none absolute bottom-3 right-3 px-3 py-1.5 rounded-md bg-[#101827]/85 border border-[#24324B] text-[11px] font-mono text-[#94A3B8]">
            Drag block horizontally to reposition start x₀
          </div>
        )}
      </div>
    );
  }
);

NewtonsCanvasStage.displayName = 'NewtonsCanvasStage';
