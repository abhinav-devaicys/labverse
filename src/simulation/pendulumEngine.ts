export interface PendulumParams {
  /** Pendulum length in meters (0.2 - 3.0 m) */
  length: number;
  /** Initial release angle in degrees (5 - 60 deg) */
  initialAngleDeg: number;
  /** Gravitational acceleration in m/s^2 (1 - 25 m/s^2) */
  gravity: number;
  /** Bob mass in kilograms (0.1 - 5.0 kg) */
  mass: number;
}

export interface PendulumState {
  /** Angular displacement in radians */
  theta: number;
  /** Angular velocity in rad/s */
  omega: number;
  /** Simulation elapsed time in seconds */
  time: number;
  /** Last upward zero-crossing timestamp (s), null if none yet */
  lastZeroCrossingTime: number | null;
  /** Most recent measured full oscillation period (s), null before 2 crossings */
  measuredPeriod: number | null;
  /** Completed full oscillation cycles */
  completedCycles: number;
}

export interface PendulumTelemetry {
  time: number;
  angleRad: number;
  angleDeg: number;
  angularVelocity: number;
  angularAcceleration: number;
  linearVelocity: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  theoreticalPeriod: number;
  measuredPeriod: number | null;
  periodDeviationPercent: number | null;
  completedCycles: number;
}

export interface PendulumSamplePoint {
  t: number;
  angleDeg: number;
  angularVelocity: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
}

export interface PendulumObservation {
  id: string;
  trialNumber: number;
  length: number;
  initialAngleDeg: number;
  gravity: number;
  mass: number;
  theoreticalPeriod: number;
  measuredPeriod: number | null;
  deviationPercent: number | null;
  totalEnergy: number;
  simTime: number;
  note: string;
}

export const DEFAULT_PENDULUM_PARAMS: PendulumParams = {
  length: 1.2,
  initialAngleDeg: 25,
  gravity: 9.81,
  mass: 1.0,
};

/** Fixed internal RK4 physics step in seconds (240 Hz), independent of display refresh rate */
export const PHYSICS_FIXED_DT = 1 / 240;

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function createInitialPendulumState(params: PendulumParams): PendulumState {
  return {
    theta: degToRad(params.initialAngleDeg),
    omega: 0,
    time: 0,
    lastZeroCrossingTime: null,
    measuredPeriod: null,
    completedCycles: 0,
  };
}

/**
 * Computes angular acceleration: theta'' = -(g / L) * sin(theta)
 */
export function computeAngularAcceleration(
  theta: number,
  gravity: number,
  length: number
): number {
  return -(gravity / length) * Math.sin(theta);
}

/**
 * Advances pendulum state by one fixed step dt using 4th-order Runge-Kutta (RK4),
 * and detects positive-going zero crossings (theta crosses 0 with omega > 0)
 * using linear interpolation to measure the true nonlinear period.
 */
export function stepPendulumRK4(
  state: PendulumState,
  params: PendulumParams,
  dt: number = PHYSICS_FIXED_DT
): PendulumState {
  const { gravity, length } = params;
  const { theta, omega, time } = state;

  const accel = (th: number) => computeAngularAcceleration(th, gravity, length);

  // RK4 stage 1
  const k1Theta = omega;
  const k1Omega = accel(theta);

  // RK4 stage 2
  const k2Theta = omega + 0.5 * dt * k1Omega;
  const k2Omega = accel(theta + 0.5 * dt * k1Theta);

  // RK4 stage 3
  const k3Theta = omega + 0.5 * dt * k2Omega;
  const k3Omega = accel(theta + 0.5 * dt * k2Theta);

  // RK4 stage 4
  const k4Theta = omega + dt * k3Omega;
  const k4Omega = accel(theta + dt * k3Theta);

  const nextTheta =
    theta + (dt / 6) * (k1Theta + 2 * k2Theta + 2 * k3Theta + k4Theta);
  const nextOmega =
    omega + (dt / 6) * (k1Omega + 2 * k2Omega + 2 * k3Omega + k4Omega);
  const nextTime = time + dt;

  let lastZeroCrossingTime = state.lastZeroCrossingTime;
  let measuredPeriod = state.measuredPeriod;
  let completedCycles = state.completedCycles;

  // Detect positive-slope zero crossing (theta <= 0 -> nextTheta > 0) for full-period timing
  if (theta <= 0 && nextTheta > 0 && nextOmega > 0) {
    const denom = nextTheta - theta;
    const frac = denom !== 0 ? -theta / denom : 0;
    const exactCrossingTime = time + Math.min(1, Math.max(0, frac)) * dt;

    if (lastZeroCrossingTime !== null) {
      const candidatePeriod = exactCrossingTime - lastZeroCrossingTime;
      if (candidatePeriod > 0.05) {
        measuredPeriod = candidatePeriod;
        completedCycles += 1;
      }
    }
    lastZeroCrossingTime = exactCrossingTime;
  }

  return {
    theta: nextTheta,
    omega: nextOmega,
    time: nextTime,
    lastZeroCrossingTime,
    measuredPeriod,
    completedCycles,
  };
}

export function computeTheoreticalPeriod(length: number, gravity: number): number {
  return 2 * Math.PI * Math.sqrt(length / gravity);
}

export function computePendulumTelemetry(
  state: PendulumState,
  params: PendulumParams
): PendulumTelemetry {
  const { length, gravity, mass } = params;
  const { theta, omega, time, measuredPeriod, completedCycles } = state;

  const angularAcceleration = computeAngularAcceleration(theta, gravity, length);
  const linearVelocity = length * omega;

  // Height above lowest equilibrium point: h = L * (1 - cos(theta))
  const height = length * (1 - Math.cos(theta));
  const potentialEnergy = mass * gravity * height;
  const kineticEnergy = 0.5 * mass * linearVelocity * linearVelocity;
  const totalEnergy = kineticEnergy + potentialEnergy;

  const theoreticalPeriod = computeTheoreticalPeriod(length, gravity);
  const periodDeviationPercent =
    measuredPeriod !== null && theoreticalPeriod > 0
      ? ((measuredPeriod - theoreticalPeriod) / theoreticalPeriod) * 100
      : null;

  return {
    time,
    angleRad: theta,
    angleDeg: radToDeg(theta),
    angularVelocity: omega,
    angularAcceleration,
    linearVelocity,
    kineticEnergy,
    potentialEnergy,
    totalEnergy,
    theoreticalPeriod,
    measuredPeriod,
    periodDeviationPercent,
    completedCycles,
  };
}

export function toSamplePoint(telemetry: PendulumTelemetry): PendulumSamplePoint {
  return {
    t: Number(telemetry.time.toFixed(3)),
    angleDeg: Number(telemetry.angleDeg.toFixed(3)),
    angularVelocity: Number(telemetry.angularVelocity.toFixed(4)),
    kineticEnergy: Number(telemetry.kineticEnergy.toFixed(4)),
    potentialEnergy: Number(telemetry.potentialEnergy.toFixed(4)),
    totalEnergy: Number(telemetry.totalEnergy.toFixed(4)),
  };
}

function escapeCsvCell(value: string | number | null): string {
  const str = value === null ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportObservationsToCsv(observations: PendulumObservation[]): string {
  const headers = [
    'Trial',
    'Length (m)',
    'Initial Angle (deg)',
    'Gravity (m/s^2)',
    'Bob Mass (kg)',
    'Theoretical Period (s)',
    'Measured Period (s)',
    'Period Deviation (%)',
    'Total Mechanical Energy (J)',
    'Elapsed Time (s)',
    'Observation Note',
  ];

  const rows = observations.map((obs) => [
    obs.trialNumber,
    obs.length.toFixed(2),
    obs.initialAngleDeg.toFixed(1),
    obs.gravity.toFixed(2),
    obs.mass.toFixed(2),
    obs.theoreticalPeriod.toFixed(4),
    obs.measuredPeriod !== null ? obs.measuredPeriod.toFixed(4) : '',
    obs.deviationPercent !== null ? obs.deviationPercent.toFixed(3) : '',
    obs.totalEnergy.toFixed(4),
    obs.simTime.toFixed(2),
    obs.note,
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\n');
}
