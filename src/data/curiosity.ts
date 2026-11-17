import type { SubjectSlug } from '../types/subject';

export interface CuriosityQuestion {
  id: string;
  question: string;
  teaser: string;
  conceptLabel: string;
  subjectSlug: SubjectSlug;
  targetModuleCode: string;
}

export const CURIOSITY_QUESTIONS: CuriosityQuestion[] = [
  {
    id: 'moon-orbit',
    question: 'Why does the Moon orbit Earth?',
    teaser:
      'Gravity pulls the Moon inward while its sideways velocity keeps it continuously falling around Earth in balanced orbital curvature.',
    conceptLabel: 'Orbital Mechanics & Gravity',
    subjectSlug: 'earth-space',
    targetModuleCode: 'EAS-01',
  },
  {
    id: 'inside-atom',
    question: 'What happens inside an atom?',
    teaser:
      'Protons and neutrons bind tightly inside a dense nucleus while quantized electron orbitals define how every element bonds and reacts.',
    conceptLabel: 'Atomic Structure & Bonding',
    subjectSlug: 'chemistry',
    targetModuleCode: 'CHM-01',
  },
  {
    id: 'electricity-travel',
    question: 'How does electricity travel?',
    teaser:
      'Electric fields propagate through conductors nearly at light speed, nudging free electrons into steady drift across potential differences.',
    conceptLabel: 'Electric Fields & Circuits',
    subjectSlug: 'physics',
    targetModuleCode: 'PHY-03',
  },
  {
    id: 'objects-fall',
    question: 'Why do objects fall?',
    teaser:
      'Mass curves gravitational potential so every unsupported object accelerates downward at the same rate when air resistance is removed.',
    conceptLabel: 'Universal Gravitation & Motion',
    subjectSlug: 'physics',
    targetModuleCode: 'PHY-01',
  },
];

export interface ScienceDomainContext {
  id: string;
  category: string;
  headline: string;
  summary: string;
  examples: string[];
  linkedSubject: SubjectSlug;
  linkedSubjectLabel: string;
}

export const SCIENCE_EVERYWHERE_ITEMS: ScienceDomainContext[] = [
  {
    id: 'everyday-life',
    category: 'Everyday Life',
    headline: 'Heat, light, and resonance shape every ordinary moment.',
    summary:
      'From morning coffee cooling by thermal conduction to eyeglasses bending light rays onto your retina, physical laws quietly govern daily comfort.',
    examples: ['Acoustic harmony in strings', 'Refractive optics in lenses', 'Thermal equilibrium in cooking'],
    linkedSubject: 'physics',
    linkedSubjectLabel: 'Physics',
  },
  {
    id: 'technology',
    category: 'Technology',
    headline: 'Every modern device is applied chemistry, math, and control.',
    summary:
      'Semiconductors channel quantum bandgaps, lithium ions shuttle charge inside batteries, and feedback algorithms keep robots and aircraft stable.',
    examples: ['Silicon logic gates', 'Electrochemical energy storage', 'Closed-loop sensor feedback'],
    linkedSubject: 'engineering',
    linkedSubjectLabel: 'Engineering & Technology',
  },
  {
    id: 'nature',
    category: 'Nature',
    headline: 'Living ecosystems transform sunlight into intricate order.',
    summary:
      'Leaves capture photons to assemble sugar molecules, fluid gradients lift water up towering trees, and genetic code preserves biological adaptation.',
    examples: ['Cellular photosynthesis', 'Vascular capillary transport', 'DNA sequence inheritance'],
    linkedSubject: 'biology',
    linkedSubjectLabel: 'Biology',
  },
  {
    id: 'universe',
    category: 'The Universe',
    headline: 'The same equations govern ripples in a pond and distant galaxies.',
    summary:
      'Keplerian orbits trace planetary seasons, tectonic convection reshapes continents, and mathematical symmetry describes spacetime itself.',
    examples: ['Planetary orbital resonance', 'Atmospheric energy balance', 'Geometric invariance'],
    linkedSubject: 'earth-space',
    linkedSubjectLabel: 'Earth & Space',
  },
];

export interface DailyDiscoveryConcept {
  id: string;
  title: string;
  phenomenon: string;
  explanation: string;
  keyTakeaway: string;
  primarySubject: SubjectSlug;
  relatedSubjects: SubjectSlug[];
}

export const DAILY_DISCOVERIES: DailyDiscoveryConcept[] = [
  {
    id: 'refraction-snell',
    title: 'Why a straw looks bent in a glass of water',
    phenomenon: 'Optical Refraction & Phase Velocity',
    explanation:
      'Light slows down when passing from air into denser water. Because one edge of a wavefront enters water before the other, the beam bends cleanly at the boundary.',
    keyTakeaway: 'Wave speed changes across media create predictable geometric bending.',
    primarySubject: 'physics',
    relatedSubjects: ['mathematics', 'engineering'],
  },
  {
    id: 'resonance-bridges',
    title: 'How tiny rhythmic pushes amplify a swing',
    phenomenon: 'Harmonic Resonance',
    explanation:
      'When periodic energy input matches a system’s natural oscillation frequency, amplitude builds constructively cycle after cycle.',
    keyTakeaway: 'Timing energy transfer to natural frequency maximizes oscillation.',
    primarySubject: 'physics',
    relatedSubjects: ['engineering', 'mathematics'],
  },
  {
    id: 'ice-floats',
    title: 'Why solid ice floats on liquid water',
    phenomenon: 'Hydrogen-Bonded Crystal Lattice',
    explanation:
      'As water freezes, hydrogen bonds lock H₂O molecules into an open hexagonal lattice that occupies more space—making solid ice less dense than liquid water.',
    keyTakeaway: 'Molecular geometry directly governs macroscopic buoyancy and aquatic life.',
    primarySubject: 'chemistry',
    relatedSubjects: ['biology', 'earth-space'],
  },
];

export function getTodaysDiscovery(): DailyDiscoveryConcept {
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return DAILY_DISCOVERIES[dayOfYear % DAILY_DISCOVERIES.length];
}
