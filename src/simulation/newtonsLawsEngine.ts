export type NewtonsLawMode = 'first-law' | 'second-law' | 'third-law';
export type ThirdLawPushType = 'continuous' | 'pulse';

export interface NewtonsParams {
  mode: NewtonsLawMode;
  massA: number; // 1 - 100 kg
  massB: number; // 1 - 100 kg (Mode C)
  appliedForce: number; // -200 to +200 N (Modes A & B)
  interactionForce: number; // 0 to 200 N (Mode C magnitude)
  thirdLawPushType: ThirdLawPushType;
  frictionCoeff: number; // 0.00 - 0.80
  gravity: number; // 1.0 - 25.0 m/s^2
}

export interface BlockState {
  x: number; // displacement (m)
  v: number; // velocity (m/s)
}

export interface NewtonsState {
  time: number;
  blockA: BlockState;
  blockB: BlockState;
  pulseActiveUntil: number | null;
}

export interface BodyTelemetry {
  appliedForce: number;
  normalForce: number;
  maxStaticFriction: number;
  frictionForce: number;
  netForce: number;
  acceleration: number;
  velocity: number;
  displacement: number;
  momentum: number;
  kineticEnergy: number;
  isStaticHeld: boolean;
}

export interface NewtonsTelemetry {
  time: number;
  mode: NewtonsLawMode;
  bodyA: BodyTelemetry;
  bodyB: BodyTelemetry;
  totalMomentum: number;
  activeInteractionForce: number;
}

export interface NewtonsSamplePoint {
  t: number;
  appliedForce: number;
  frictionForce: number;
  netForce: number;
  velocityA: number;
  velocityB: number;
  accelerationA: number;
  accelerationB: number;
  displacementA: number;
  displacementB: number;
}

export interface NewtonsObservation {
  id: string;
  trialNumber: number;
  mode: NewtonsLawMode;
  massA: number;
  massB: number | null;
  appliedForce: number;
  frictionCoeff: number;
  gravity: number;
  frictionForce: number;
  netForce: number;
  accelerationA: number;
  accelerationB: number | null;
  velocityA: number;
  displacementA: number;
  momentumA: number;
  kineticEnergyA: number;
  simTime: number;
  note: string;
}

export const NEWTONS_FIXED_DT = 1 / 240;
export const THIRD_LAW_PULSE_DURATION = 0.5;

export function getDefaultParamsForMode(mode: NewtonsLawMode): NewtonsParams {
  switch (mode) {
    case 'first-law':
      return {
        mode: 'first-law',
        massA: 10,
        massB: 20,
        appliedForce: 40,
        interactionForce: 80,
        thirdLawPushType: 'pulse',
        frictionCoeff: 0.0,
        gravity: 9.81,
      };
    case 'second-law':
      return {
        mode: 'second-law',
        massA: 15,
        massB: 25,
        appliedForce: 90,
        interactionForce: 80,
        thirdLawPushType: 'pulse',
        frictionCoeff: 0.1,
        gravity: 9.81,
      };
    case 'third-law':
      return {
        mode: 'third-law',
        massA: 10,
        massB: 30,
        appliedForce: 0,
        interactionForce: 120,
        thirdLawPushType: 'pulse',
        frictionCoeff: 0.0,
        gravity: 9.81,
      };
  }
}

export function createInitialNewtonsState(mode: NewtonsLawMode): NewtonsState {
  if (mode === 'third-law') {
    return {
      time: 0,
      blockA: { x: -0.6, v: 0 },
      blockB: { x: 0.6, v: 0 },
      pulseActiveUntil: THIRD_LAW_PULSE_DURATION,
    };
  }
  return {
    time: 0,
    blockA: { x: 0, v: 0 },
    blockB: { x: 0, v: 0 },
    pulseActiveUntil: null,
  };
}

interface ForceResolution {
  normalForce: number;
  maxStaticFriction: number;
  frictionForce: number;
  netForce: number;
  acceleration: number;
  isStaticHeld: boolean;
}

/**
 * Resolves normal force (N = mg), static/kinetic friction (F_f <= mu*N),
 * net force, and acceleration for a horizontal block.
 */
export function resolveHorizontalForces(
  mass: number,
  velocity: number,
  appliedForce: number,
  frictionCoeff: number,
  gravity: number
): ForceResolution {
  const normalForce = mass * gravity;
  const maxStaticFriction = frictionCoeff * normalForce;
  const speedEps = 1e-4;

  if (Math.abs(velocity) <= speedEps) {
    if (Math.abs(appliedForce) <= maxStaticFriction) {
      // Static friction balances applied force up to mu * N
      return {
        normalForce,
        maxStaticFriction,
        frictionForce: -appliedForce,
        netForce: 0,
        acceleration: 0,
        isStaticHeld: true,
      };
    }
    // Applied force exceeds maximum static friction
    const dir = appliedForce > 0 ? 1 : -1;
    const frictionForce = -dir * maxStaticFriction;
    const netForce = appliedForce + frictionForce;
    return {
      normalForce,
      maxStaticFriction,
      frictionForce,
      netForce,
      acceleration: netForce / mass,
      isStaticHeld: false,
    };
  }

  // Kinetic friction opposes motion
  const motionDir = velocity > 0 ? 1 : -1;
  const frictionForce = -motionDir * maxStaticFriction;
  const netForce = appliedForce + frictionForce;
  return {
    normalForce,
    maxStaticFriction,
    frictionForce,
    netForce,
    acceleration: netForce / mass,
    isStaticHeld: false,
  };
}

function stepSingleBody(
  body: BlockState,
  mass: number,
  appliedForce: number,
  frictionCoeff: number,
  gravity: number,
  dt: number
): BlockState {
  const res = resolveHorizontalForces(
    mass,
    body.v,
    appliedForce,
    frictionCoeff,
    gravity
  );

  if (res.isStaticHeld) {
    return { x: body.x, v: 0 };
  }

  const nextV = body.v + res.acceleration * dt;

  // Prevent discrete timestep overshoot when kinetic friction brings block to rest
  if (
    body.v !== 0 &&
    ((body.v > 0 && nextV <= 0) || (body.v < 0 && nextV >= 0)) &&
    Math.abs(appliedForce) <= res.maxStaticFriction
  ) {
    const tStop = Math.abs(body.v / res.acceleration);
    const clampedT = Math.min(dt, tStop);
    const stopX = body.x + 0.5 * body.v * clampedT;
    return { x: stopX, v: 0 };
  }

  // Trapezoidal position update for second-order displacement accuracy
  const nextX = body.x + 0.5 * (body.v + nextV) * dt;
  return { x: nextX, v: nextV };
}

export function getActiveForces(
  state: NewtonsState,
  params: NewtonsParams
): { forceA: number; forceB: number; interactionMagnitude: number } {
  if (params.mode !== 'third-law') {
    return {
      forceA: params.appliedForce,
      forceB: 0,
      interactionMagnitude: 0,
    };
  }

  const isPulseActive =
    params.thirdLawPushType === 'continuous' ||
    (state.pulseActiveUntil !== null && state.time <= state.pulseActiveUntil);

  const mag = isPulseActive ? params.interactionForce : 0;
  // Equal and opposite action-reaction pair pushing A left (-mag) and B right (+mag)
  return {
    forceA: -mag,
    forceB: mag,
    interactionMagnitude: mag,
  };
}

export function stepNewtonsSimulation(
  state: NewtonsState,
  params: NewtonsParams,
  dt: number = NEWTONS_FIXED_DT
): NewtonsState {
  const { forceA, forceB } = getActiveForces(state, params);

  const nextA = stepSingleBody(
    state.blockA,
    params.massA,
    forceA,
    params.frictionCoeff,
    params.gravity,
    dt
  );

  const nextB =
    params.mode === 'third-law'
      ? stepSingleBody(
          state.blockB,
          params.massB,
          forceB,
          params.frictionCoeff,
          params.gravity,
          dt
        )
      : state.blockB;

  return {
    time: state.time + dt,
    blockA: nextA,
    blockB: nextB,
    pulseActiveUntil: state.pulseActiveUntil,
  };
}

function buildBodyTelemetry(
  body: BlockState,
  mass: number,
  appliedForce: number,
  frictionCoeff: number,
  gravity: number
): BodyTelemetry {
  const res = resolveHorizontalForces(
    mass,
    body.v,
    appliedForce,
    frictionCoeff,
    gravity
  );
  return {
    appliedForce,
    normalForce: res.normalForce,
    maxStaticFriction: res.maxStaticFriction,
    frictionForce: res.frictionForce,
    netForce: res.netForce,
    acceleration: res.acceleration,
    velocity: body.v,
    displacement: body.x,
    momentum: mass * body.v,
    kineticEnergy: 0.5 * mass * body.v * body.v,
    isStaticHeld: res.isStaticHeld,
  };
}

export function computeNewtonsTelemetry(
  state: NewtonsState,
  params: NewtonsParams
): NewtonsTelemetry {
  const { forceA, forceB, interactionMagnitude } = getActiveForces(state, params);
  const bodyA = buildBodyTelemetry(
    state.blockA,
    params.massA,
    forceA,
    params.frictionCoeff,
    params.gravity
  );
  const bodyB = buildBodyTelemetry(
    state.blockB,
    params.massB,
    forceB,
    params.frictionCoeff,
    params.gravity
  );

  return {
    time: state.time,
    mode: params.mode,
    bodyA,
    bodyB,
    totalMomentum: bodyA.momentum + (params.mode === 'third-law' ? bodyB.momentum : 0),
    activeInteractionForce: interactionMagnitude,
  };
}

export function toNewtonsSample(tel: NewtonsTelemetry): NewtonsSamplePoint {
  return {
    t: Number(tel.time.toFixed(3)),
    appliedForce: Number(tel.bodyA.appliedForce.toFixed(2)),
    frictionForce: Number(tel.bodyA.frictionForce.toFixed(2)),
    netForce: Number(tel.bodyA.netForce.toFixed(2)),
    velocityA: Number(tel.bodyA.velocity.toFixed(3)),
    velocityB: Number(tel.bodyB.velocity.toFixed(3)),
    accelerationA: Number(tel.bodyA.acceleration.toFixed(3)),
    accelerationB: Number(tel.bodyB.acceleration.toFixed(3)),
    displacementA: Number(tel.bodyA.displacement.toFixed(3)),
    displacementB: Number(tel.bodyB.displacement.toFixed(3)),
  };
}

function escapeCsvCell(value: string | number | null): string {
  const str = value === null ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportNewtonsObservationsToCsv(
  observations: NewtonsObservation[]
): string {
  const headers = [
    'Trial',
    'Mode',
    'Mass A (kg)',
    'Mass B (kg)',
    'Applied / Interaction Force (N)',
    'Friction Coeff (mu)',
    'Gravity (m/s^2)',
    'Friction Force A (N)',
    'Net Force A (N)',
    'Acceleration A (m/s^2)',
    'Acceleration B (m/s^2)',
    'Velocity A (m/s)',
    'Displacement A (m)',
    'Momentum A (kg*m/s)',
    'Kinetic Energy A (J)',
    'Elapsed Time (s)',
    'Note',
  ];

  const rows = observations.map((obs) => [
    obs.trialNumber,
    obs.mode,
    obs.massA.toFixed(1),
    obs.massB !== null ? obs.massB.toFixed(1) : '',
    obs.appliedForce.toFixed(1),
    obs.frictionCoeff.toFixed(2),
    obs.gravity.toFixed(2),
    obs.frictionForce.toFixed(2),
    obs.netForce.toFixed(2),
    obs.accelerationA.toFixed(3),
    obs.accelerationB !== null ? obs.accelerationB.toFixed(3) : '',
    obs.velocityA.toFixed(3),
    obs.displacementA.toFixed(3),
    obs.momentumA.toFixed(3),
    obs.kineticEnergyA.toFixed(3),
    obs.simTime.toFixed(2),
    obs.note,
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\n');
}
