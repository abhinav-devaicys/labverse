import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import {
  computePendulumTelemetry,
  createInitialPendulumState,
  DEFAULT_PENDULUM_PARAMS,
  degToRad,
  PHYSICS_FIXED_DT,
  stepPendulumRK4,
  toSamplePoint,
  type PendulumObservation,
  type PendulumParams,
  type PendulumSamplePoint,
  type PendulumState,
  type PendulumTelemetry,
} from '../../../simulation/pendulumEngine';
import { useLearningStore } from '../../../stores/useLearningStore';
import { PendulumAnalysisPanel } from './PendulumAnalysisPanel';
import { PendulumCanvasStage } from './PendulumCanvasStage';
import {
  PendulumControlsPanel,
  type PendulumVisualOptions,
} from './PendulumControlsPanel';
import { PendulumGraphsPanel } from './PendulumGraphsPanel';
import { PendulumLearningPanel } from './PendulumLearningPanel';
import { PendulumTelemetryPanel } from './PendulumTelemetryPanel';
import {
  SimulationControlBar,
  type PlaybackSpeed,
} from './SimulationControlBar';

const MAX_GRAPH_SAMPLES = 300;
const SAMPLE_INTERVAL_SEC = 0.03;
const TELEMETRY_UI_INTERVAL_MS = 65; // ~15 Hz numeric readout updates while canvas + graphs run at native 60-120fps

export const SimplePendulumWorkspace: React.FC = () => {
  const navigate = useLearningStore((s) => s.navigate);

  const [params, setParams] = useState<PendulumParams>(DEFAULT_PENDULUM_PARAMS);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [trailVersion, setTrailVersion] = useState(0);

  const [visualOptions, setVisualOptions] = useState<PendulumVisualOptions>({
    showEquilibrium: true,
    showAngleArc: true,
    showLengthMeasure: true,
    showTrail: true,
    showEnergyViz: true,
    showGrid: true,
  });

  // Mutable simulation refs for zero-React-overhead 60-120fps canvas & graph rendering
  const paramsRef = useRef<PendulumParams>(DEFAULT_PENDULUM_PARAMS);
  const visualOptionsRef = useRef<PendulumVisualOptions>(visualOptions);
  const stateRef = useRef<PendulumState>(createInitialPendulumState(DEFAULT_PENDULUM_PARAMS));
  const speedRef = useRef<PlaybackSpeed>(1);
  const accumulatorRef = useRef(0);
  const lastSampleTimeRef = useRef(0);
  const samplesRef = useRef<PendulumSamplePoint[]>([
    toSamplePoint(
      computePendulumTelemetry(stateRef.current, DEFAULT_PENDULUM_PARAMS)
    ),
  ]);

  const drawCanvasRef = useRef<(() => void) | null>(null);
  const drawGraphsRef = useRef<(() => void) | null>(null);

  const [telemetry, setTelemetry] = useState<PendulumTelemetry>(() =>
    computePendulumTelemetry(stateRef.current, DEFAULT_PENDULUM_PARAMS)
  );
  const [observations, setObservations] = useState<PendulumObservation[]>([]);

  paramsRef.current = params;
  visualOptionsRef.current = visualOptions;
  speedRef.current = speed;

  const registerCanvasDraw = useCallback((fn: () => void) => {
    drawCanvasRef.current = fn;
  }, []);

  const registerGraphDraw = useCallback((fn: () => void) => {
    drawGraphsRef.current = fn;
  }, []);

  // Deterministic fixed-timestep RK4 loop decoupled from React re-renders
  useEffect(() => {
    if (!isRunning) return;

    let rafId = 0;
    let lastTimestamp = performance.now();
    let lastTelemetryUiTime = lastTimestamp;

    const tick = (now: number) => {
      const elapsedWallSec = Math.min(0.05, Math.max(0, (now - lastTimestamp) / 1000));
      lastTimestamp = now;

      accumulatorRef.current += elapsedWallSec * speedRef.current;

      let currentState = stateRef.current;
      const currentParams = paramsRef.current;
      let sampleAdded = false;

      while (accumulatorRef.current >= PHYSICS_FIXED_DT) {
        currentState = stepPendulumRK4(currentState, currentParams, PHYSICS_FIXED_DT);
        accumulatorRef.current -= PHYSICS_FIXED_DT;

        if (currentState.time - lastSampleTimeRef.current >= SAMPLE_INTERVAL_SEC) {
          const tel = computePendulumTelemetry(currentState, currentParams);
          const buf = samplesRef.current;
          buf.push(toSamplePoint(tel));
          if (buf.length > MAX_GRAPH_SAMPLES) {
            buf.shift();
          }
          lastSampleTimeRef.current = currentState.time;
          sampleAdded = true;
        }
      }

      stateRef.current = currentState;

      // Render pendulum stage & scientific plots imperatively at native 60-120fps
      drawCanvasRef.current?.();
      if (sampleAdded) {
        drawGraphsRef.current?.();
      }

      // Throttle numeric React telemetry UI updates to ~15 Hz
      if (now - lastTelemetryUiTime >= TELEMETRY_UI_INTERVAL_MS) {
        lastTelemetryUiTime = now;
        setTelemetry(computePendulumTelemetry(currentState, currentParams));
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      // Sync final paused telemetry immediately on stop
      setTelemetry(computePendulumTelemetry(stateRef.current, paramsRef.current));
    };
  }, [isRunning]);

  const handleChangeParam = useCallback(
    <K extends keyof PendulumParams>(key: K, value: PendulumParams[K]) => {
      setParams((prev) => {
        const updated = { ...prev, [key]: value };
        paramsRef.current = updated;

        if (key === 'initialAngleDeg') {
          if (!isRunning && stateRef.current.time === 0) {
            const nextState = createInitialPendulumState(updated);
            stateRef.current = nextState;
            const tel = computePendulumTelemetry(nextState, updated);
            samplesRef.current = [toSamplePoint(tel)];
            setTelemetry(tel);
            setTrailVersion((v) => v + 1);
            drawCanvasRef.current?.();
            drawGraphsRef.current?.();
          }
        } else if (key === 'length' || key === 'gravity') {
          const cleaned: PendulumState = {
            ...stateRef.current,
            lastZeroCrossingTime: null,
            measuredPeriod: null,
          };
          stateRef.current = cleaned;
          setTelemetry(computePendulumTelemetry(cleaned, updated));
          setTrailVersion((v) => v + 1);
          drawCanvasRef.current?.();
        } else if (key === 'mass') {
          setTelemetry(computePendulumTelemetry(stateRef.current, updated));
          drawCanvasRef.current?.();
        }

        return updated;
      });
    },
    [isRunning]
  );

  const handleDragAngle = useCallback((angleDeg: number) => {
    setParams((prev) => {
      const updated = { ...prev, initialAngleDeg: angleDeg };
      paramsRef.current = updated;
      const nextState: PendulumState = {
        ...stateRef.current,
        theta: degToRad(angleDeg),
        omega: 0,
        time: 0,
        lastZeroCrossingTime: null,
        measuredPeriod: null,
        completedCycles: 0,
      };
      stateRef.current = nextState;
      lastSampleTimeRef.current = 0;
      const tel = computePendulumTelemetry(nextState, updated);
      samplesRef.current = [toSamplePoint(tel)];
      setHasStarted(false);
      setTelemetry(tel);
      setTrailVersion((v) => v + 1);
      drawCanvasRef.current?.();
      drawGraphsRef.current?.();
      return updated;
    });
  }, []);

  const handleToggleVisual = useCallback((key: keyof PendulumVisualOptions) => {
    setVisualOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      visualOptionsRef.current = next;
      drawCanvasRef.current?.();
      return next;
    });
  }, []);

  const handleStart = useCallback(() => {
    setHasStarted(true);
    setIsRunning(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleResume = useCallback(() => {
    setHasStarted(true);
    setIsRunning(true);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setHasStarted(false);
    accumulatorRef.current = 0;
    lastSampleTimeRef.current = 0;
    const resetState = createInitialPendulumState(paramsRef.current);
    stateRef.current = resetState;
    const tel = computePendulumTelemetry(resetState, paramsRef.current);
    samplesRef.current = [toSamplePoint(tel)];
    setTelemetry(tel);
    setTrailVersion((v) => v + 1);
    drawCanvasRef.current?.();
    drawGraphsRef.current?.();
  }, []);

  const handleStepForward = useCallback(() => {
    setIsRunning(false);
    setHasStarted(true);
    let current = stateRef.current;
    const subSteps = 10; // ~0.0417 s controlled step
    for (let i = 0; i < subSteps; i++) {
      current = stepPendulumRK4(current, paramsRef.current, PHYSICS_FIXED_DT);
    }
    stateRef.current = current;

    const tel = computePendulumTelemetry(current, paramsRef.current);
    const buf = samplesRef.current;
    buf.push(toSamplePoint(tel));
    if (buf.length > MAX_GRAPH_SAMPLES) {
      buf.shift();
    }
    lastSampleTimeRef.current = current.time;
    setTelemetry(tel);
    drawCanvasRef.current?.();
    drawGraphsRef.current?.();
  }, []);

  const handleResetGraphs = useCallback(() => {
    const tel = computePendulumTelemetry(stateRef.current, paramsRef.current);
    samplesRef.current = [toSamplePoint(tel)];
    lastSampleTimeRef.current = stateRef.current.time;
    drawGraphsRef.current?.();
  }, []);

  const handleToggleRun = useCallback(() => {
    setIsRunning((prev) => {
      if (!prev) setHasStarted(true);
      return !prev;
    });
  }, []);

  const handleAddObservation = useCallback((note: string) => {
    const tel = computePendulumTelemetry(stateRef.current, paramsRef.current);
    const p = paramsRef.current;
    setObservations((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length + 1}`,
        trialNumber: prev.length + 1,
        length: p.length,
        initialAngleDeg: p.initialAngleDeg,
        gravity: p.gravity,
        mass: p.mass,
        theoreticalPeriod: tel.theoreticalPeriod,
        measuredPeriod: tel.measuredPeriod,
        deviationPercent: tel.periodDeviationPercent,
        totalEnergy: tel.totalEnergy,
        simTime: tel.time,
        note,
      },
    ]);
  }, []);

  const handleRecordFromTelemetry = useCallback(() => {
    handleAddObservation('');
  }, [handleAddObservation]);

  const handleDeleteObservation = useCallback((id: string) => {
    setObservations((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearObservations = useCallback(() => {
    setObservations([]);
  }, []);

  const statusText = isRunning
    ? '● Running (RK4 240 Hz)'
    : hasStarted
      ? '❚❚ Paused'
      : '○ Ready';

  return (
    <div className="bg-[#101827] text-[#F5F4EF] min-h-[calc(100vh-4rem)]">
      {/* Top Laboratory Header & Semantic Breadcrumb */}
      <div className="border-b border-[#24324B] bg-[#0D1422]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-xs text-[#94A3B8]"
            >
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate({ type: 'home' });
                }}
                className="hover:text-white transition-colors"
              >
                Home
              </a>
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
              <a
                href="/subjects/physics"
                onClick={(e) => {
                  e.preventDefault();
                  navigate({ type: 'subject', slug: 'physics' });
                }}
                className="hover:text-white transition-colors"
              >
                Physics
              </a>
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
              <a
                href="/subjects/physics/mechanics"
                onClick={(e) => {
                  e.preventDefault();
                  navigate({
                    type: 'subject-topic',
                    subjectSlug: 'physics',
                    topicSlug: 'mechanics',
                  });
                }}
                className="hover:text-white transition-colors"
              >
                Mechanics
              </a>
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
              <span className="text-[#F5F4EF] font-medium" aria-current="page">
                Simple Pendulum
              </span>
            </nav>

            <div className="flex flex-wrap items-center gap-4">
              <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#F5F4EF]">
                Simple Pendulum Motion Simulation
              </h1>
              <span className="font-mono text-xs text-[#38BDF8]">{statusText}</span>
            </div>
          </div>

          <a
            href="/subjects/physics/mechanics"
            onClick={(e) => {
              e.preventDefault();
              navigate({
                type: 'subject-topic',
                subjectSlug: 'physics',
                topicSlug: 'mechanics',
              });
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#162033] border border-[#24324B] text-xs font-medium text-[#CBD5E1] hover:text-white hover:border-[#5578F5] transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Mechanics</span>
          </a>
        </div>
      </div>

      {/* Main Laboratory Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* 3-Column Interactive Simulation Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Variable Control Panel */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <PendulumControlsPanel
              params={params}
              visualOptions={visualOptions}
              isRunning={isRunning}
              onChangeParam={handleChangeParam}
              onToggleVisual={handleToggleVisual}
            />
          </div>

          {/* Center: Interactive Simulation Canvas + Bottom Simulation Controls */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <PendulumCanvasStage
              stateRef={stateRef}
              paramsRef={paramsRef}
              visualOptionsRef={visualOptionsRef}
              params={params}
              visualOptions={visualOptions}
              isRunning={isRunning}
              hasStarted={hasStarted}
              trailVersion={trailVersion}
              registerDraw={registerCanvasDraw}
              onDragAngle={handleDragAngle}
            />

            <SimulationControlBar
              isRunning={isRunning}
              hasStarted={hasStarted}
              speed={speed}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              onStepForward={handleStepForward}
              onChangeSpeed={setSpeed}
            />
          </div>

          {/* Right: Live Telemetry & Results */}
          <div className="lg:col-span-3 order-3">
            <PendulumTelemetryPanel
              telemetry={telemetry}
              onRecordObservation={handleRecordFromTelemetry}
            />
          </div>
        </div>

        {/* Live Scientific Graphs */}
        <PendulumGraphsPanel
          samplesRef={samplesRef}
          registerGraphDraw={registerGraphDraw}
          isRunning={isRunning}
          onToggleRun={handleToggleRun}
          onResetGraphs={handleResetGraphs}
        />

        {/* Collapsible Educational Learning Panel */}
        <PendulumLearningPanel
          length={params.length}
          gravity={params.gravity}
          initialAngleDeg={params.initialAngleDeg}
          theoreticalPeriod={telemetry.theoreticalPeriod}
          measuredPeriod={telemetry.measuredPeriod}
          periodDeviationPercent={telemetry.periodDeviationPercent}
          defaultOpen={false}
        />

        {/* Experiment Analysis & CSV Export */}
        <PendulumAnalysisPanel
          params={params}
          theoreticalPeriod={telemetry.theoreticalPeriod}
          measuredPeriod={telemetry.measuredPeriod}
          observations={observations}
          onAddObservation={handleAddObservation}
          onDeleteObservation={handleDeleteObservation}
          onClearObservations={handleClearObservations}
        />
      </div>
    </div>
  );
};
