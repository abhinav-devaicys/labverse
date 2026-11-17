import type { SubjectCategory, SubjectId } from '../types/simulation';

export const SUBJECT_REGISTRY: Record<SubjectId, SubjectCategory> = {
  physics: {
    id: 'physics',
    name: 'Physics',
    simulationCount: 18,
    description:
      'Classical mechanics, gravitation, electromagnetism, optics, special relativity, and quantum states.',
    formula: '∇ · B = 0, J = σ(E + v × B)',
    topics: ['Mechanics', 'Optics', 'Electromagnetism', 'Quantum'],
    accentColor: '#5578F5',
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    simulationCount: 14,
    description:
      'Reaction stoichiometry, molecular orbitals, acid-base titration curves, and ideal gas thermodynamic states.',
    formula: 'ΔG° = -RT ln K_eq',
    topics: ['Atomic Structure', 'Thermodynamics', 'Kinetics', 'Equilibrium'],
    accentColor: '#10B981',
  },
  biology: {
    id: 'biology',
    name: 'Biology',
    simulationCount: 11,
    description:
      'Mitochondrial respiration, neural action potentials (Hodgkin-Huxley), enzyme kinetics, and gene expression.',
    formula: 'v = (V_max [S]) / (K_m + [S])',
    topics: ['Cellular Energetics', 'Neurobiology', 'Enzymology', 'Genetics'],
    accentColor: '#22D3EE',
  },
  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    simulationCount: 16,
    description:
      'Vector fields, complex analysis, Fourier transformations, Lorenz attractor chaos, and multivariable calculus.',
    formula: 'F(ω) = ∫ f(t) e^(-iωt) dt',
    topics: ['Differential Equations', 'Fourier Analysis', 'Vector Calculus', 'Chaos Theory'],
    accentColor: '#F59E0B',
  },
  'earth-space': {
    id: 'earth-space',
    name: 'Earth & Space',
    simulationCount: 9,
    description:
      'Keplerian orbital mechanics, atmospheric convection cells, plate tectonic stresses, and stellar evolution.',
    formula: 'T² = (4π² / GM) a³',
    topics: ['Orbital Dynamics', 'Astrophysics', 'Climate Physics', 'Geodynamics'],
    accentColor: '#818CF8',
  },
  engineering: {
    id: 'engineering',
    name: 'Engineering',
    simulationCount: 12,
    description:
      'Structural stress-strain tensors, digital logic gates, fluid dynamic laminar flow, and control feedback loops.',
    formula: 'ρ(∂u/∂t + u · ∇u) = -∇p + μ∇²u',
    topics: ['Fluid Mechanics', 'Circuits', 'Control Systems', 'Statics'],
    accentColor: '#38BDF8',
  },
};

export const SUBJECT_LIST: SubjectCategory[] = Object.values(SUBJECT_REGISTRY);
