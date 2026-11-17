import type { SubjectDefinition, SubjectSlug } from '../types/subject';

export const HERO_ARTWORK_URL = '/src/assets/images/hero_science_sculpture_1794937014199.jpg';

export const SUBJECTS: SubjectDefinition[] = [
  {
    number: '01',
    slug: 'physics',
    route: '/subjects/physics',
    name: 'PHYSICS',
    shortTitle: 'Physics',
    description: 'Understand how the universe moves.',
    extendedIntro:
      'From falling bodies and planetary orbits to electromagnetic fields and wave optics, Physics reveals the conservation laws and symmetries governing matter and energy.',
    topics: ['Motion', 'Mechanics', 'Gravity', 'Electricity', 'Magnetism', 'Optics', 'Waves'],
    artworkUrl: '/src/assets/images/subject_physics_artwork_1794937013949.jpg',
    artworkAlt: 'Crystal optical prism refracting light beside a suspended steel pendulum and concentric ripples',
    accentHex: '#5578F5',
    cardSurfaceClass: 'bg-[#FAF9F5]',
    layoutSpan: 'wide',
    guidingPrinciple: 'Conservation of energy, momentum, and field symmetry across all scales.',
    journeyModules: [
      {
        code: 'PHY-01',
        title: 'Kinematics & Force Equilibrium',
        focus: 'Motion, vectors, and Newtonian dynamics',
        stageSummary: 'Explore how forces reshape velocity and acceleration trajectories in real time.',
      },
      {
        code: 'PHY-02',
        title: 'Oscillations, Waves & Light',
        focus: 'Harmonic motion, interference, and refraction',
        stageSummary: 'Visualize wave superposition, standing modes, and optical dispersion through lenses and prisms.',
      },
      {
        code: 'PHY-03',
        title: 'Fields, Charge & Electromagnetism',
        focus: 'Electric potential, circuits, and magnetic flux',
        stageSummary: 'Trace field lines and energy transfer through dynamic electrical networks.',
      },
    ],
  },
  {
    number: '02',
    slug: 'chemistry',
    route: '/subjects/chemistry',
    name: 'CHEMISTRY',
    shortTitle: 'Chemistry',
    description: 'Discover what everything is made of.',
    extendedIntro:
      'Explore how subatomic structure shapes molecular geometry, how chemical bonds form and break, and how thermodynamic balance drives every transformation of matter.',
    topics: ['Atoms', 'Molecules', 'Chemical Reactions', 'Bonding', 'Matter'],
    artworkUrl: '/src/assets/images/subject_chemistry_artwork_1794937014693.jpg',
    artworkAlt: 'Three-dimensional molecular crystal lattice with frosted glass and charcoal spheres connected by blue bonds',
    accentHex: '#2563EB',
    cardSurfaceClass: 'bg-[#F0EFE9]',
    layoutSpan: 'standard',
    guidingPrinciple: 'Electrostatic interactions and orbital structure determine macroscopic properties.',
    journeyModules: [
      {
        code: 'CHM-01',
        title: 'Atomic Structure & Periodicity',
        focus: 'Protons, electron shells, and valence trends',
        stageSummary: 'Inspect how nuclear composition and shell occupancy define elemental behavior.',
      },
      {
        code: 'CHM-02',
        title: 'Molecular Geometry & Bonding',
        focus: 'Covalent, ionic, and intermolecular forces',
        stageSummary: 'Examine 3D spatial arrangements and polarity across molecular assemblies.',
      },
      {
        code: 'CHM-03',
        title: 'Reaction Kinetics & Equilibrium',
        focus: 'Stoichiometry, activation energy, and pH balance',
        stageSummary: 'Observe reversible pathways and dynamic equilibrium shifts under changing conditions.',
      },
    ],
  },
  {
    number: '03',
    slug: 'biology',
    route: '/subjects/biology',
    name: 'BIOLOGY',
    shortTitle: 'Biology',
    description: 'Explore the science of living things.',
    extendedIntro:
      'Journey inside cellular architecture, genetic information flow, physiological systems, and ecological networks to understand how living organisms sustain and adapt life.',
    topics: ['Cells', 'Genetics', 'Human Biology', 'Anatomy', 'Ecosystems'],
    artworkUrl: '/src/assets/images/subject_biology_artwork_1794937016233.jpg',
    artworkAlt: 'Translucent alabaster cellular structure alongside a glass DNA double helix sculpture',
    accentHex: '#0F766E',
    cardSurfaceClass: 'bg-[#EFECE4]',
    layoutSpan: 'standard',
    guidingPrinciple: 'Living systems maintain organized complexity through energy flow and genetic information.',
    journeyModules: [
      {
        code: 'BIO-01',
        title: 'Cellular Organization & Membranes',
        focus: 'Organelles, transport, and metabolic energy',
        stageSummary: 'Visualize how selective membranes and organelles coordinate cellular respiration.',
      },
      {
        code: 'BIO-02',
        title: 'Genetics & Molecular Inheritance',
        focus: 'DNA replication, transcription, and variation',
        stageSummary: 'Follow sequence encoding from nucleotide pairs to functional protein traits.',
      },
      {
        code: 'BIO-03',
        title: 'Physiology & Ecosystem Dynamics',
        focus: 'Homeostasis, neural signaling, and trophic webs',
        stageSummary: 'Analyze feedback loops keeping organisms and ecological communities in balance.',
      },
    ],
  },
  {
    number: '04',
    slug: 'mathematics',
    route: '/subjects/mathematics',
    name: 'MATHEMATICS',
    shortTitle: 'Mathematics',
    description: 'Discover the patterns behind everything.',
    extendedIntro:
      'See algebra, geometry, calculus, and probability not as static symbols, but as living visual structures that describe growth, curvature, symmetry, and uncertainty.',
    topics: ['Algebra', 'Geometry', 'Calculus', 'Probability', 'Functions'],
    artworkUrl: '/src/assets/images/subject_mathematics_artwork_1794937016030.jpg',
    artworkAlt: 'Sculptural Mobius torus, translucent polyhedra, and brass hyperbolic surface on a museum plinth',
    accentHex: '#4338CA',
    cardSurfaceClass: 'bg-[#FAF9F5]',
    layoutSpan: 'wide',
    guidingPrinciple: 'Abstract invariants and continuous transformations unify pattern and change.',
    journeyModules: [
      {
        code: 'MTH-01',
        title: 'Functions, Algebra & Transformations',
        focus: 'Linear maps, polynomials, and parameter spaces',
        stageSummary: 'Watch algebraic coefficients reshape geometric curves and coordinate grids.',
      },
      {
        code: 'MTH-02',
        title: 'Calculus: Rates & Accumulation',
        focus: 'Derivatives, integrals, and vector fields',
        stageSummary: 'Connect instantaneous slope and area under curves to physical motion.',
      },
      {
        code: 'MTH-03',
        title: 'Probability & Stochastic Patterns',
        focus: 'Distributions, sampling, and convergence',
        stageSummary: 'Explore how random trials converge into predictable statistical laws.',
      },
    ],
  },
  {
    number: '05',
    slug: 'earth-space',
    route: '/subjects/earth-space',
    name: 'EARTH & SPACE',
    shortTitle: 'Earth & Space',
    description: 'Explore our planet and beyond.',
    extendedIntro:
      'Trace planetary motion across the solar system, examine tectonic forces shaping continents, and study atmospheric cycles that govern Earth’s climate over time.',
    topics: ['Astronomy', 'Solar System', 'Climate', 'Geology', 'Space Science'],
    artworkUrl: '/src/assets/images/subject_earth_space_artwork_1794937016787.jpg',
    artworkAlt: 'Architectural brass and ceramic tabletop planetary orrery showing Earth and lunar orbital rings',
    accentHex: '#1D4ED8',
    cardSurfaceClass: 'bg-[#F0EFE9]',
    layoutSpan: 'standard',
    guidingPrinciple: 'Planetary systems evolve through coupled gravitational, thermal, and geological cycles.',
    journeyModules: [
      {
        code: 'EAS-01',
        title: 'Orbital Mechanics & Solar Systems',
        focus: 'Keplerian orbits, eclipses, and gravity wells',
        stageSummary: 'Observe orbital eccentricity, axial tilt, and seasonal illumination patterns.',
      },
      {
        code: 'EAS-02',
        title: 'Earth Systems & Climate Dynamics',
        focus: 'Radiative balance, ocean currents, and atmosphere',
        stageSummary: 'Examine energy exchange between solar radiation, oceans, and atmospheric layers.',
      },
      {
        code: 'EAS-03',
        title: 'Plate Tectonics & Deep Time',
        focus: 'Lithospheric motion, volcanism, and rock cycles',
        stageSummary: 'Explore the slow convective forces sculpting mountain ranges and ocean basins.',
      },
    ],
  },
  {
    number: '06',
    slug: 'engineering',
    route: '/subjects/engineering',
    name: 'ENGINEERING & TECHNOLOGY',
    shortTitle: 'Engineering & Technology',
    description: 'Discover how ideas become real-world systems.',
    extendedIntro:
      'Bridge scientific theory with physical design by exploring mechanical linkages, electronic circuits, feedback control loops, and intelligent robotic systems.',
    topics: ['Electronics', 'Mechanics', 'Robotics', 'Circuits', 'Technology'],
    artworkUrl: '/src/assets/images/subject_engineering_artwork_1794937016731.jpg',
    artworkAlt: 'Precision anodized aluminum gear train integrated with copper circuit traces and optical glass sensors',
    accentHex: '#0284C7',
    cardSurfaceClass: 'bg-[#FAF9F5]',
    layoutSpan: 'standard',
    guidingPrinciple: 'Constraint-driven synthesis turns physical principles into reliable human systems.',
    journeyModules: [
      {
        code: 'ENG-01',
        title: 'Electronic Circuits & Logic',
        focus: 'Signal conditioning, semiconductors, and logic gates',
        stageSummary: 'Trace current flow, voltage regulation, and digital state transitions.',
      },
      {
        code: 'ENG-02',
        title: 'Mechanical Linkages & Structures',
        focus: 'Gear ratios, torque, and structural load paths',
        stageSummary: 'Test mechanical advantage, stress distribution, and kinetic efficiency.',
      },
      {
        code: 'ENG-03',
        title: 'Control Systems & Robotics',
        focus: 'Sensors, feedback loops, and autonomous motion',
        stageSummary: 'Discover how closed-loop feedback stabilizes real-world dynamic systems.',
      },
    ],
  },
];

export function getSubjectBySlug(slug: SubjectSlug): SubjectDefinition | undefined {
  return SUBJECTS.find((subject) => subject.slug === slug);
}
