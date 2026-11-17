import { SIMULATION_REGISTRY } from '../registry/simulationRegistry';
import type { SimulationDifficulty, SimulationModule, SubjectId, TelemetryPoint } from '../types/simulation';

export interface ExperimentFilterOptions {
  query?: string;
  subjectId?: SubjectId | 'all';
  difficulty?: SimulationDifficulty | 'all';
}

export function filterSimulations(options: ExperimentFilterOptions): SimulationModule[] {
  const { query = '', subjectId = 'all', difficulty = 'all' } = options;
  const normalizedQuery = query.trim().toLowerCase();

  return SIMULATION_REGISTRY.filter((sim) => {
    const matchesSubject = subjectId === 'all' || sim.subjectId === subjectId;
    const matchesDifficulty = difficulty === 'all' || sim.difficulty === difficulty;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      sim.title.toLowerCase().includes(normalizedQuery) ||
      sim.description.toLowerCase().includes(normalizedQuery) ||
      sim.subdiscipline.toLowerCase().includes(normalizedQuery) ||
      sim.code.toLowerCase().includes(normalizedQuery);

    return matchesSubject && matchesDifficulty && matchesQuery;
  });
}

export function generateTelemetryPreviewData(
  damping = 0.08,
  omega = 2.4,
  points = 64
): TelemetryPoint[] {
  const data: TelemetryPoint[] = [];
  for (let i = 0; i < points; i++) {
    const t = Number(((i / (points - 1)) * 10).toFixed(2));
    const envelope = Math.exp(-damping * t);
    const primary = Number((envelope * Math.cos(omega * t)).toFixed(4));
    const secondary = Number((envelope * Math.sin(omega * t + Math.PI / 6) * 0.72).toFixed(4));
    const phaseVelocity = Number((-envelope * omega * Math.sin(omega * t)).toFixed(4));
    const frequencyHz = Number((0.2 + i * 0.08).toFixed(2));
    const resonanceDiff = frequencyHz - 2.4;
    const amplitude = Number(
      (1 / Math.sqrt(Math.pow(resonanceDiff * 1.4, 2) + Math.pow(damping * 3.5 + 0.12, 2))).toFixed(3)
    );

    data.push({
      t,
      primary,
      secondary,
      envelope: Number(envelope.toFixed(4)),
      phaseVelocity,
      frequencyHz,
      amplitude,
    });
  }
  return data;
}
