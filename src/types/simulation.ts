export type SubjectId =
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'mathematics'
  | 'earth-space'
  | 'engineering';

export type SimulationDifficulty = 'Introductory' | 'Intermediate' | 'Advanced';

export type SimulationStatus = 'preview' | 'staged' | 'active';

export interface SimulationParameter {
  key: string;
  label: string;
  symbol: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  description: string;
}

export interface SimulationMetric {
  label: string;
  value: string;
  unit?: string;
  tone?: 'neutral' | 'blue' | 'amber' | 'emerald' | 'cyan';
}

export interface TelemetryPoint {
  t: number;
  primary: number;
  secondary: number;
  envelope: number;
  phaseVelocity: number;
  frequencyHz: number;
  amplitude: number;
}

export interface SimulationModule {
  id: string;
  code: string;
  slug: string;
  title: string;
  subjectId: SubjectId;
  subdiscipline: string;
  description: string;
  status: SimulationStatus;
  difficulty: SimulationDifficulty;
  featured: boolean;
  equation: string;
  engineLabel: string;
  metrics: SimulationMetric[];
  parameters: SimulationParameter[];
  learningObjectives: string[];
  realWorldApplications: string[];
  estimatedMinutes: number;
}

export interface SubjectCategory {
  id: SubjectId;
  name: string;
  simulationCount: number;
  description: string;
  formula: string;
  topics: string[];
  accentColor: string;
}

export interface SimulationState<TParams extends Record<string, number> = Record<string, number>> {
  readonly id: string;
  readonly seed: number;
  params: TParams;
  elapsedSeconds: number;
  isPaused: boolean;
}
