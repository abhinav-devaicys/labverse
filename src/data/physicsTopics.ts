export type PhysicsTopicSlug =
  | 'mechanics'
  | 'electricity'
  | 'magnetism'
  | 'waves-and-sound'
  | 'light-and-optics'
  | 'thermodynamics'
  | 'modern-physics'
  | 'astronomy-and-space-physics';

export type PhysicsVisualMotif =
  | 'pendulum'
  | 'field'
  | 'flux'
  | 'wave'
  | 'prism'
  | 'thermal'
  | 'quantum'
  | 'orbit';

export interface PhysicsCoreLaw {
  name: string;
  formula: string;
  meaning: string;
}

export interface PhysicsTopicDefinition {
  number: string;
  slug: PhysicsTopicSlug;
  route: string;
  title: string;
  domainLabel: string;
  description: string;
  overview: string;
  everydayAnchor: string;
  visualMotif: PhysicsVisualMotif;
  keyConcepts: string[];
  coreLaws: PhysicsCoreLaw[];
  interactiveLabPreview: {
    title: string;
    prompt: string;
    parameterLabel: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
  };
}

export const PHYSICS_TOPICS: PhysicsTopicDefinition[] = [
  {
    number: '01',
    slug: 'mechanics',
    route: '/subjects/physics/mechanics',
    title: 'Mechanics',
    domainLabel: 'Motion & Forces',
    description:
      'Study how forces set objects in motion, why momentum is conserved, and how energy shifts between potential and kinetic states.',
    overview:
      'Mechanics is the foundation of physical intuition. By tracking position, velocity, acceleration, and force vectors, you uncover why projectiles arc, bridges hold steady, and pendulums keep rhythmic time.',
    everydayAnchor:
      'Braking a bicycle, launching a satellite, and balancing on a seesaw all follow the exact same laws of force and torque.',
    visualMotif: 'pendulum',
    keyConcepts: [
      'Kinematics & Projectile Trajectories',
      'Newton’s Three Laws of Motion',
      'Work, Kinetic & Potential Energy',
      'Linear Momentum & Collisions',
      'Rotational Inertia & Harmonic Oscillators',
    ],
    coreLaws: [
      {
        name: 'Newton’s Second Law',
        formula: 'F = m · a',
        meaning: 'Net force equals mass multiplied by acceleration in the direction of the push.',
      },
      {
        name: 'Pendulum Period',
        formula: 'T = 2π √(L / g)',
        meaning: 'Swing duration depends on length and gravity, independent of bob mass.',
      },
    ],
    interactiveLabPreview: {
      title: 'Simple Pendulum Timing',
      prompt: 'Adjust pendulum cord length to observe how swing period changes under Earth gravity.',
      parameterLabel: 'Cord Length (L)',
      unit: 'm',
      min: 0.4,
      max: 3.0,
      step: 0.1,
      defaultValue: 1.2,
    },
  },
  {
    number: '02',
    slug: 'electricity',
    route: '/subjects/physics/electricity',
    title: 'Electricity',
    domainLabel: 'Charge & Circuits',
    description:
      'Trace how electric charge creates invisible force fields, drives current through circuits, and powers modern technology.',
    overview:
      'Electricity governs interactions between charged particles. From static sparks to precision microchips, electric potential differences guide electrons through predictable circuit pathways.',
    everydayAnchor:
      'Every lightning bolt, battery cell, and smartphone touchscreen relies on controlled electric fields and potential gradients.',
    visualMotif: 'field',
    keyConcepts: [
      'Electric Charge & Coulomb Attraction',
      'Electric Field Lines & Potential',
      'Current, Voltage & Resistance',
      'Series & Parallel Circuit Networks',
      'Electrical Power & Energy Storage',
    ],
    coreLaws: [
      {
        name: 'Ohm’s Law',
        formula: 'V = I · R',
        meaning: 'Voltage across a conductor is proportional to current and electrical resistance.',
      },
      {
        name: 'Electrical Power',
        formula: 'P = V · I',
        meaning: 'The rate of energy transfer equals potential difference multiplied by current.',
      },
    ],
    interactiveLabPreview: {
      title: 'Conductive Circuit Balance',
      prompt: 'Tune circuit voltage across a 12 Ω resistive load to inspect steady electron current.',
      parameterLabel: 'Source Voltage (V)',
      unit: 'V',
      min: 1.5,
      max: 24,
      step: 0.5,
      defaultValue: 9,
    },
  },
  {
    number: '03',
    slug: 'magnetism',
    route: '/subjects/physics/magnetism',
    title: 'Magnetism',
    domainLabel: 'Flux & Induction',
    description:
      'Explore invisible magnetic flux lines, moving charges in magnetic fields, and how motion induces electric current.',
    overview:
      'Electricity and magnetism are two faces of one unified electromagnetic force. Moving charges generate circulating magnetic fields, while changing magnetic flux induces electricity inside coils.',
    everydayAnchor:
      'Electric motors, wind turbine generators, maglev trains, and compass navigation operate on magnetic induction.',
    visualMotif: 'flux',
    keyConcepts: [
      'Magnetic Poles & Dipole Field Loops',
      'Lorentz Force on Moving Charges',
      'Electromagnets & Solenoids',
      'Faraday’s Law of Induction',
      'Transformers & AC Generation',
    ],
    coreLaws: [
      {
        name: 'Faraday’s Induction Law',
        formula: 'ε = -N · (ΔΦ / Δt)',
        meaning: 'A faster change in magnetic flux through a coil induces a larger voltage.',
      },
      {
        name: 'Magnetic Lorentz Force',
        formula: 'F = q · v · B · sin(θ)',
        meaning: 'A charge moving across magnetic field lines experiences a perpendicular deflecting force.',
      },
    ],
    interactiveLabPreview: {
      title: 'Electromagnetic Coil Flux',
      prompt: 'Vary coil turn count inside a changing 0.15 Wb/s magnetic field to examine induced voltage.',
      parameterLabel: 'Coil Turns (N)',
      unit: 'turns',
      min: 10,
      max: 200,
      step: 10,
      defaultValue: 60,
    },
  },
  {
    number: '04',
    slug: 'waves-and-sound',
    route: '/subjects/physics/waves-and-sound',
    title: 'Waves & Sound',
    domainLabel: 'Oscillation & Acoustics',
    description:
      'See how vibrations carry energy across space through resonance, interference patterns, and acoustic harmonics.',
    overview:
      'Waves transfer energy and information without transporting matter permanently. When waves meet, they superpose—canceling out or amplifying into standing musical harmonics.',
    everydayAnchor:
      'Guitar strings, noise-canceling headphones, ultrasound imaging, and ocean swells share universal wave mathematics.',
    visualMotif: 'wave',
    keyConcepts: [
      'Wavelength, Frequency & Wave Speed',
      'Transverse vs. Longitudinal Compression',
      'Constructive & Destructive Interference',
      'Standing Waves & Resonance',
      'Doppler Shift & Acoustic Pitch',
    ],
    coreLaws: [
      {
        name: 'Universal Wave Equation',
        formula: 'v = f · λ',
        meaning: 'Wave propagation speed equals oscillation frequency multiplied by wavelength.',
      },
      {
        name: 'Harmonic Frequencies',
        formula: 'f_n = n · f_1',
        meaning: 'Resonant modes on a bounded string occur at whole-number multiples of the fundamental pitch.',
      },
    ],
    interactiveLabPreview: {
      title: 'Acoustic Wavelength Explorer',
      prompt: 'Adjust sound frequency in air (343 m/s) to calculate the physical wavelength of each tone.',
      parameterLabel: 'Frequency (f)',
      unit: 'Hz',
      min: 110,
      max: 880,
      step: 10,
      defaultValue: 440,
    },
  },
  {
    number: '05',
    slug: 'light-and-optics',
    route: '/subjects/physics/light-and-optics',
    title: 'Light & Optics',
    domainLabel: 'Refraction & Spectra',
    description:
      'Discover why light bends through glass, splits into rainbows inside prisms, and forms sharp images through lenses.',
    overview:
      'Light travels at the cosmic speed limit in vacuum, yet slows inside transparent materials. That change in speed curves wavefronts, enabling eyeglasses, microscopes, telescopes, and fiber-optic networks.',
    everydayAnchor:
      'Camera lenses, rainbows after rain, shimmering mirages, and high-speed fiber internet depend on refraction and reflection.',
    visualMotif: 'prism',
    keyConcepts: [
      'Reflection & Plane/Curved Mirrors',
      'Snell’s Law of Refraction',
      'Total Internal Reflection',
      'Prisms & Chromatic Dispersion',
      'Diffraction & Double-Slit Interference',
    ],
    coreLaws: [
      {
        name: 'Snell’s Law',
        formula: 'n₁ · sin(θ₁) = n₂ · sin(θ₂)',
        meaning: 'Light bends toward the normal when entering a medium with a higher refractive index.',
      },
      {
        name: 'Photon Energy',
        formula: 'E = h · f',
        meaning: 'Higher-frequency light such as violet carries more energy per photon than red light.',
      },
    ],
    interactiveLabPreview: {
      title: 'Air-to-Glass Refraction Angle',
      prompt: 'Change the incoming ray angle hitting crown glass (n = 1.52) to observe how the beam bends.',
      parameterLabel: 'Incidence Angle (θ₁)',
      unit: 'deg',
      min: 5,
      max: 80,
      step: 1,
      defaultValue: 38,
    },
  },
  {
    number: '06',
    slug: 'thermodynamics',
    route: '/subjects/physics/thermodynamics',
    title: 'Thermodynamics',
    domainLabel: 'Heat & Energy Flow',
    description:
      'Understand temperature as microscopic motion, how heat flows toward equilibrium, and why entropy sets time’s arrow.',
    overview:
      'Thermodynamics bridges unseen atomic collisions with macroscopic engines and climates. It defines the conservation of energy and reveals fundamental limits on converting heat into useful work.',
    everydayAnchor:
      'Refrigerators, atmospheric weather systems, steam turbines, and cooling coffee obey thermodynamic equilibrium.',
    visualMotif: 'thermal',
    keyConcepts: [
      'Thermal Energy & Kinetic Temperature',
      'Conduction, Convection & Radiation',
      'Ideal Gas Behavior (Pressure & Volume)',
      'Conservation of Energy (First Law)',
      'Entropy & Heat Engine Efficiency',
    ],
    coreLaws: [
      {
        name: 'Ideal Gas Law',
        formula: 'P · V = n · R · T',
        meaning: 'Gas pressure, volume, and absolute temperature remain tightly coupled in equilibrium.',
      },
      {
        name: 'Carnot Efficiency Limit',
        formula: 'η_max = 1 - (T_cold / T_hot)',
        meaning: 'No heat engine can convert 100% of thermal energy into mechanical work.',
      },
    ],
    interactiveLabPreview: {
      title: 'Carnot Thermal Efficiency',
      prompt: 'Adjust the hot reservoir temperature (with cold sink at 300 K) to inspect theoretical engine efficiency.',
      parameterLabel: 'Hot Reservoir (T_hot)',
      unit: 'K',
      min: 350,
      max: 1200,
      step: 25,
      defaultValue: 600,
    },
  },
  {
    number: '07',
    slug: 'modern-physics',
    route: '/subjects/physics/modern-physics',
    title: 'Modern Physics',
    domainLabel: 'Quantum & Relativity',
    description:
      'Step beyond everyday intuition into quantized energy levels, wave-particle duality, and relativistic spacetime.',
    overview:
      'At atomic scales and near-light speeds, classical rules give way to quantum probability and spacetime curvature—explaining laser light, semiconductors, nuclear energy, and GPS time dilation.',
    everydayAnchor:
      'LED displays, solar panels, MRI scanners, and satellite GPS clocks all rely directly on quantum and relativistic physics.',
    visualMotif: 'quantum',
    keyConcepts: [
      'Photoelectric Effect & Photons',
      'Discrete Atomic Energy Shells',
      'De Broglie Matter Waves',
      'Special Relativity & Time Dilation',
      'Mass-Energy Equivalence (E = mc²)',
    ],
    coreLaws: [
      {
        name: 'Mass–Energy Equivalence',
        formula: 'E = m · c²',
        meaning: 'Mass is a concentrated form of energy scaled by the speed of light squared.',
      },
      {
        name: 'De Broglie Wavelength',
        formula: 'λ = h / p',
        meaning: 'Every moving particle exhibits wave-like interference inversely proportional to its momentum.',
      },
    ],
    interactiveLabPreview: {
      title: 'Relativistic Time Factor',
      prompt: 'Increase spacecraft speed as a fraction of light speed (c) to observe how moving clocks slow.',
      parameterLabel: 'Velocity Fraction (v / c)',
      unit: 'c',
      min: 0.05,
      max: 0.95,
      step: 0.05,
      defaultValue: 0.6,
    },
  },
  {
    number: '08',
    slug: 'astronomy-and-space-physics',
    route: '/subjects/physics/astronomy-and-space-physics',
    title: 'Astronomy & Space Physics',
    domainLabel: 'Gravity & Orbits',
    description:
      'Connect universal gravitation to elliptical planetary orbits, escape velocity, stellar fusion, and cosmic motion.',
    overview:
      'Space physics applies mechanics, optics, and thermodynamics on the grandest scale. The same inverse-square gravitational law that guides an apple downward keeps moons, planets, and galaxies in motion.',
    everydayAnchor:
      'Ocean tides, weather satellites, solar eclipses, and interplanetary trajectories are governed by orbital dynamics.',
    visualMotif: 'orbit',
    keyConcepts: [
      'Inverse-Square Universal Gravitation',
      'Kepler’s Three Laws of Planetary Motion',
      'Orbital Velocity & Free-Fall Equilibrium',
      'Escape Velocity & Gravity Wells',
      'Stellar Spectra & Cosmic Light',
    ],
    coreLaws: [
      {
        name: 'Newton’s Universal Gravitation',
        formula: 'F = G · (m₁ · m₂) / r²',
        meaning: 'Gravitational pull scales with mass and weakens rapidly with the square of distance.',
      },
      {
        name: 'Kepler’s Third Law',
        formula: 'T² ∝ a³',
        meaning: 'Planets farther from a star take dramatically longer to complete a full orbit.',
      },
    ],
    interactiveLabPreview: {
      title: 'Planetary Orbital Period',
      prompt: 'Set orbital radius in Astronomical Units (AU) around a Sun-like star to compute year length.',
      parameterLabel: 'Orbital Distance (a)',
      unit: 'AU',
      min: 0.4,
      max: 5.2,
      step: 0.1,
      defaultValue: 1.0,
    },
  },
];

export function getPhysicsTopicBySlug(slug: string): PhysicsTopicDefinition | undefined {
  return PHYSICS_TOPICS.find((topic) => topic.slug === slug);
}

export interface PhysicsCuriosityQuestion {
  id: string;
  question: string;
  shortAnswer: string;
  principle: string;
  topicSlug: PhysicsTopicSlug;
  topicTitle: string;
}

export const PHYSICS_CURIOSITY_QUESTIONS: PhysicsCuriosityQuestion[] = [
  {
    id: 'why-objects-fall',
    question: 'Why do objects fall?',
    shortAnswer:
      'Mass creates a gravitational attraction toward Earth’s center. Without air drag slowing lighter shapes down, a feather and a heavy sphere accelerate downward at the exact same rate (9.81 m/s²).',
    principle: 'Gravitational acceleration acts equally on all inertial mass.',
    topicSlug: 'mechanics',
    topicTitle: 'Mechanics',
  },
  {
    id: 'how-electricity-flows',
    question: 'How does electricity flow?',
    shortAnswer:
      'A voltage source establishes an electric field across a closed conductive loop. Almost instantaneously, that field pushes free electrons into a coordinated drift that delivers energy to lights and motors.',
    principle: 'Potential difference drives steady charge drift across closed paths.',
    topicSlug: 'electricity',
    topicTitle: 'Electricity',
  },
  {
    id: 'why-light-bends',
    question: 'Why does light bend?',
    shortAnswer:
      'Light travels slightly slower in water or glass than in air. When a beam hits a boundary at an angle, one side of its wavefront slows down first—pivoting the entire beam into a new direction.',
    principle: 'Wave speed changes across optical media cause refractive bending.',
    topicSlug: 'light-and-optics',
    topicTitle: 'Light & Optics',
  },
  {
    id: 'how-planets-orbit',
    question: 'How do planets stay in orbit?',
    shortAnswer:
      'Planets are perpetually falling toward their star under gravity—but they move sideways fast enough that the curved surface of their orbit falls away underneath them at the same pace.',
    principle: 'Orbital motion balances inward gravitational pull with tangential speed.',
    topicSlug: 'astronomy-and-space-physics',
    topicTitle: 'Astronomy & Space Physics',
  },
];

export interface LearningJourneyStep {
  number: string;
  stage: 'Discover' | 'Understand' | 'Experiment' | 'Analyze' | 'Master';
  headline: string;
  detail: string;
}

export const PHYSICS_LEARNING_STEPS: LearningJourneyStep[] = [
  {
    number: '01',
    stage: 'Discover',
    headline: 'Start from a natural phenomenon',
    detail:
      'Begin with an everyday observation—a swinging pendulum, a refracted beam, or a planetary arc—before introducing formal symbols.',
  },
  {
    number: '02',
    stage: 'Understand',
    headline: 'Build geometric & visual intuition',
    detail:
      'See how forces, fields, and waves behave visually so mathematical laws feel like concise descriptions of what you already picture.',
  },
  {
    number: '03',
    stage: 'Experiment',
    headline: 'Test variables inside each topic',
    detail:
      'Enter dedicated topic pages to vary mass, voltage, angle, or frequency and immediately watch physical systems respond.',
  },
  {
    number: '04',
    stage: 'Analyze',
    headline: 'Connect measurements to principles',
    detail:
      'Compare how changing one parameter alters curves, ratios, and conservation quantities across controlled trials.',
  },
  {
    number: '05',
    stage: 'Master',
    headline: 'Apply laws across new contexts',
    detail:
      'Carry unified physical reasoning from classroom questions to real engineering systems and cosmic scales.',
  },
];
