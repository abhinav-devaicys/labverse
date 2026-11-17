import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import {
  computeNewtonsTelemetry,
  createInitialNewtonsState,
  getDefaultParamsForMode,
  NEWTONS_FIXED_DT,
  stepNewtonsSimulation,
  THIRD_LAW_PULSE_DURATION,
  toNewtonsSample,
  type NewtonsLawMode,
  type NewtonsObservation,
  type NewtonsParams,
  type NewtonsSamplePoint,
  type NewtonsState,
  type NewtonsTelemetry,
} from '../../../simulation/newtonsLawsEngine';
import { useLearningStore } from '../../../stores/useLearningStore';
import {
  SimulationControlBar,
  type PlaybackSpeed,
} from '../pendulum/SimulationControlBar';
import { NewtonsAnalysisPanel } from './NewtonsAnalysisPanel';
import { NewtonsCanvasStage } from './NewtonsCanvasStage';
import {
  NewtonsControlsPanel,
  type NewtonsVisualOptions,
} from './NewtonsControlsPanel';
import { NewtonsGraphsPanel } from './NewtonsGraphsPanel';
import { NewtonsLearningPanel } from './NewtonsLearningPanel';
import { NewtonsTelemetryPanel } from './NewtonsTelemetryPanel';

const MAX_GRAPH_SAMPLES = 300;
const SAMPLE_INTERVAL_SEC = 0.03;
const TELEMETRY_UI_INTERVAL_MS = 65;

export const NewtonsLawsWorkspace: React.FC = () => {
  const navigate = useLearningStore((s) => s.navigate);

  const [params, setParams] = useState<NewtonsParams>(() =>
    getDefaultParamsForMode('second-law')
  );
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const [visualOptions, setVisualOptions] = useState<NewtonsVisualOptions>({
    showForces: true,
    showVelocity: true,
    showDisplacement: true,
    showNormalWeight: false,
    showGrid: true,
  });

  const paramsRef = useRef<NewtonsParams>(params);
  const visualOptionsRef = useRef<NewtonsVisualOptions>(visualOptions);
  const stateRef = useRef<NewtonsState>(createInitialNewtonsState('second-law'));
  const speedRef = useRef<PlaybackSpeed>(1);
  const accumulatorRef = useRef(0);
  const lastSampleTimeRef = useRef(0);
  const samplesRef = useRef<NewtonsSamplePoint[]>([
    toNewtonsSample(computeNewtonsTelemetry(stateRef.current, paramsRef.current)),
  ]);

  const drawCanvasRef = useRef<(() => void) | null>(null);
  const drawGraphsRef = useRef<(() => void) | null>(null);

  const [telemetry, setTelemetry] = useState<NewtonsTelemetry>(() =>
    computeNewtonsTelemetry(stateRef.current, paramsRef.current)
  );
  const [observations, setObservations] = useState<NewtonsObservation[]>([]);

  paramsRef.current = params;
  visualOptionsRef.current = visualOptions;
  speedRef.current = speed;

  const registerCanvasDraw = useCallback((fn: () => void) => {
    drawCanvasRef.current = fn;
  }, []);

  const registerGraphDraw = useCallback((fn: () => void) => {
    drawGraphsRef.current = fn;
  }, []);

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

      while (accumulatorRef.current >= NEWTONS_FIXED_DT) {
        currentState = stepNewtonsSimulation(
          currentState,
          currentParams,
          NEWTONS_FIXED_DT
        );
        accumulatorRef.current -= NEWTONS_FIXED_DT;

        if (currentState.time - lastSampleTimeRef.current >= SAMPLE_INTERVAL_SEC) {
          const tel = computeNewtonsTelemetry(currentState, currentParams);
          const buf = samplesRef.current;
          buf.push(toNewtonsSample(tel));
          if (buf.length > MAX_GRAPH_SAMPLES) {
            buf.shift();
          }
          lastSampleTimeRef.current = currentState.time;
          sampleAdded = true;
        }
      }

      stateRef.current = currentState;

      drawCanvasRef.current?.();
      if (sampleAdded) {
        drawGraphsRef.current?.();
      }

      if (now - lastTelemetryUiTime >= TELEMETRY_UI_INTERVAL_MS) {
        lastTelemetryUiTime = now;
        setTelemetry(computeNewtonsTelemetry(currentState, currentParams));
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      setTelemetry(computeNewtonsTelemetry(stateRef.current, paramsRef.current));
    };
  }, [isRunning]);

  const handleChangeMode = useCallback((mode: NewtonsLawMode) => {
    setIsRunning(false);
    setHasStarted(false);
    accumulatorRef.current = 0;
    lastSampleTimeRef.current = 0;

    const nextParams = getDefaultParamsForMode(mode);
    const nextState = createInitialNewtonsState(mode);
    paramsRef.current = nextParams;
    stateRef.current = nextState;

    const tel = computeNewtonsTelemetry(nextState, nextParams);
    samplesRef.current = [toNewtonsSample(tel)];
    setParams(nextParams);
    setTelemetry(tel);
    drawCanvasRef.current?.();
    drawGraphsRef.current?.();
  }, []);

  const handleChangeParam = useCallback(
    <K extends keyof NewtonsParams>(key: K, value: NewtonsParams[K]) => {
      setParams((prev) => {
        const updated = { ...prev, [key]: value };
        paramsRef.current = updated;
        setTelemetry(computeNewtonsTelemetry(stateRef.current, updated));
        drawCanvasRef.current?.();
        return updated;
      });
    },
    []
  );

  const handleTriggerThirdLawPulse = useCallback(() => {
    stateRef.current = {
      ...stateRef.current,
      pulseActiveUntil: stateRef.current.time + THIRD_LAW_PULSE_DURATION,
    };
    setHasStarted(true);
    setIsRunning(true);
    setTelemetry(computeNewtonsTelemetry(stateRef.current, paramsRef.current));
    drawCanvasRef.current?.();
  }, []);

  const handleDragBlockA = useCallback((newX: number) => {
    stateRef.current = {
      ...stateRef.current,
      blockA: { ...stateRef.current.blockA, x: newX, v: 0 },
    };
    const tel = computeNewtonsTelemetry(stateRef.current, paramsRef.current);
    samplesRef.current = [toNewtonsSample(tel)];
    lastSampleTimeRef.current = stateRef.current.time;
    setTelemetry(tel);
    drawCanvasRef.current?.();
    drawGraphsRef.current?.();
  }, []);

  const handleToggleVisual = useCallback((key: keyof NewtonsVisualOptions) => {
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
    const resetState = createInitialNewtonsState(paramsRef.current.mode);
    stateRef.current = resetState;
    const tel = computeNewtonsTelemetry(resetState, paramsRef.current);
    samplesRef.current = [toNewtonsSample(tel)];
    setTelemetry(tel);
    drawCanvasRef.current?.();
    drawGraphsRef.current?.();
  }, []);

  const handleStepForward = useCallback(() => {
    setIsRunning(false);
    setHasStarted(true);
    let current = stateRef.current;
    for (let i = 0; i < 10; i++) {
      current = stepNewtonsSimulation(current, paramsRef.current, NEWTONS_FIXED_DT);
    }
    stateRef.current = current;

    const tel = computeNewtonsTelemetry(current, paramsRef.current);
    const buf = samplesRef.current;
    buf.push(toNewtonsSample(tel));
    if (buf.length > MAX_GRAPH_SAMPLES) {
      buf.shift();
    }
    lastSampleTimeRef.current = current.time;
    setTelemetry(tel);
    drawCanvasRef.current?.();
    drawGraphsRef.current?.();
  }, []);

  const handleResetGraphs = useCallback(() => {
    const tel = computeNewtonsTelemetry(stateRef.current, paramsRef.current);
    samplesRef.current = [toNewtonsSample(tel)];
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
    const tel = computeNewtonsTelemetry(stateRef.current, paramsRef.current);
    const p = paramsRef.current;
    setObservations((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length + 1}`,
        trialNumber: prev.length + 1,
        mode: p.mode,
        massA: p.massA,
        massB: p.mode === 'third-law' ? p.massB : null,
        appliedForce:
          p.mode === 'third-law' ? tel.activeInteractionForce : p.appliedForce,
        frictionCoeff: p.frictionCoeff,
        gravity: p.gravity,
        frictionForce: tel.bodyA.frictionForce,
        netForce: tel.bodyA.netForce,
        accelerationA: tel.bodyA.acceleration,
        accelerationB: p.mode === 'third-law' ? tel.bodyB.acceleration : null,
        velocityA: tel.bodyA.velocity,
        displacementA: tel.bodyA.displacement,
        momentumA: tel.bodyA.momentum,
        kineticEnergyA: tel.bodyA.kineticEnergy,
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
    ? '● Running (240 Hz)'
    : hasStarted
      ? '❚❚ Paused'
      : '○ Ready';

  return (
    <div className="bg-[#101827] text-[#F5F4EF] min-h-[calc(100vh-4rem)]">
      {/* Top Laboratory Header & Breadcrumb */}
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
                Newton&apos;s Laws of Motion
              </span>
            </nav>

            <div className="flex flex-wrap items-center gap-4">
              <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#F5F4EF]">
                Newton&apos;s Laws of Motion Simulation
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Mode & Parameter Controls */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <NewtonsControlsPanel
              params={params}
              visualOptions={visualOptions}
              onChangeMode={handleChangeMode}
              onChangeParam={handleChangeParam}
              onToggleVisual={handleToggleVisual}
              onTriggerThirdLawPulse={handleTriggerThirdLawPulse}
            />
          </div>

          {/* Center: Interactive Track Canvas + Simulation Controls */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <NewtonsCanvasStage
              stateRef={stateRef}
              paramsRef={paramsRef}
              visualOptionsRef={visualOptionsRef}
              params={params}
              visualOptions={visualOptions}
              isRunning={isRunning}
              hasStarted={hasStarted}
              registerDraw={registerCanvasDraw}
              onDragBlockA={handleDragBlockA}
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

          {/* Right: Live Telemetry */}
          <div className="lg:col-span-3 order-3">
            <NewtonsTelemetryPanel
              params={params}
              telemetry={telemetry}
              onRecordObservation={handleRecordFromTelemetry}
            />
          </div>
        </div>

        {/* Real-Time Graphs */}
        <NewtonsGraphsPanel
          mode={params.mode}
          samplesRef={samplesRef}
          registerGraphDraw={registerGraphDraw}
          isRunning={isRunning}
          onToggleRun={handleToggleRun}
          onResetGraphs={handleResetGraphs}
        />

        {/* Collapsible Educational Panel */}
        <NewtonsLearningPanel defaultOpen={false} />

        {/* Experiment Analysis & CSV Export */}
        <NewtonsAnalysisPanel
          params={params}
          netForceA={telemetry.bodyA.netForce}
          accelerationA={telemetry.bodyA.acceleration}
          observations={observations}
          onAddObservation={handleAddObservation}
          onDeleteObservation={handleDeleteObservation}
          onClearObservations={handleClearObservations}
        />
      </div>
    </div>
  );
};
