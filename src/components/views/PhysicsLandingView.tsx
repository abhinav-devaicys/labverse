import React, { useRef } from 'react';
import { ArrowDown, ArrowRight, Bookmark, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { PHYSICS_TOPICS } from '../../data/physicsTopics';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';
import { useLearningStore } from '../../stores/useLearningStore';
import { PhysicsCuriositySection } from '../physics/PhysicsCuriositySection';
import { PhysicsHeroVisual } from '../physics/PhysicsHeroVisual';
import { PhysicsLearningJourney } from '../physics/PhysicsLearningJourney';
import { PhysicsTopicCard } from '../physics/PhysicsTopicCard';

export const PhysicsLandingView: React.FC = () => {
  const navigate = useLearningStore((s) => s.navigate);
  const savedSubjects = useLearningStore((s) => s.savedSubjects);
  const toggleSavedSubject = useLearningStore((s) => s.toggleSavedSubject);
  const prefersReduced = useReducedMotionPref();
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const visualParallaxY = useTransform(scrollYProgress, [0, 1], [0, 24]);

  const isSaved = savedSubjects.includes('physics');

  const scrollToTopics = () => {
    const el = document.getElementById('physics-topics');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F5F4EF] text-[#171C24]">
      {/* Breadcrumb & Save Strip */}
      <div className="border-b border-[#171C24]/10 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-[#4B5360]"
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate({ type: 'home' });
              }}
              className="hover:text-[#171C24] transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-[#848B96]" aria-hidden="true" />
            <a
              href="/#subjects-section"
              onClick={(e) => {
                e.preventDefault();
                navigate({ type: 'home' }, 'subjects-section');
              }}
              className="hover:text-[#171C24] transition-colors"
            >
              Subjects
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-[#848B96]" aria-hidden="true" />
            <span className="font-medium text-[#171C24]" aria-current="page">
              Physics
            </span>
          </nav>

          <button
            type="button"
            onClick={() => toggleSavedSubject('physics')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5] ${
              isSaved
                ? 'bg-[#5578F5] text-white border-[#5578F5]'
                : 'bg-white text-[#171C24] border-[#171C24]/15 hover:border-[#5578F5]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
            <span>{isSaved ? 'Saved in My Learning' : 'Save to My Learning'}</span>
          </button>
        </div>
      </div>

      {/* 1. Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-[#F5F4EF] border-b border-[#171C24]/10 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-6">
              <motion.p
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]"
              >
                Subject 01 · Physics
              </motion.p>

              <motion.h1
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-[#171C24] leading-[1.07] text-balance"
              >
                Understand the Universe, One Discovery at a Time.
              </motion.h1>

              <motion.p
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg text-[#4B5360] leading-relaxed max-w-xl"
              >
                Physics is the science of motion, energy, matter, and the fundamental laws
                governing everything from falling raindrops and beams of light to electric
                fields and planetary orbits.
              </motion.p>

              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="pt-2 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#physics-topics"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTopics();
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]/60"
                >
                  <span>Explore Physics</span>
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              style={prefersReduced ? undefined : { y: visualParallaxY }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <PhysicsHeroVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Introduction */}
      <section className="py-16 lg:py-24 bg-[#FAF9F5] border-b border-[#171C24]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]">
                Why Physics Matters
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#171C24] leading-[1.12] text-balance">
                The invisible rules behind everything you see and touch.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-[#4B5360] leading-relaxed max-w-2xl">
              <p>
                Every time you catch a thrown ball, hear music across a room, flip a
                light switch, or watch the Moon cross the night sky, you are witnessing
                physics in action. Rather than memorizing isolated formulas, learning
                physics teaches you to recognize the simple underlying patterns uniting
                all of nature.
              </p>
              <p>
                At LABVERSE, you approach each domain visually first—building clear mental
                models of forces, fields, waves, and energy before stepping into
                dedicated topic explorations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore Physics Topics */}
      <section
        id="physics-topics"
        className="py-20 lg:py-28 bg-[#F5F4EF] border-b border-[#171C24]/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]">
                Curriculum Areas
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#171C24] text-balance">
                Explore Physics Topics
              </h2>
              <p className="text-base text-[#4B5360] leading-relaxed">
                Choose a branch of physics to explore its core concepts, fundamental
                laws, and dedicated interactive studies.
              </p>
            </div>

            <p className="font-mono text-xs text-[#555D6B]">
              8 Fundamental Branches
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PHYSICS_TOPICS.map((topic, idx) => (
              <PhysicsTopicCard key={topic.slug} topic={topic} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Discover What Physics Explains */}
      <PhysicsCuriositySection />

      {/* 5. How You'll Learn */}
      <PhysicsLearningJourney />

      {/* 6. Final CTA */}
      <section className="py-24 lg:py-32 bg-[#FAF9F5] border-b border-[#171C24]/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]">
            Begin Physics
          </p>

          <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#171C24] leading-[1.1] text-balance">
            Ready to explore the laws of nature?
          </h2>

          <p className="text-base sm:text-lg text-[#4B5360] leading-relaxed max-w-xl mx-auto">
            Step into Mechanics, Electricity, Optics, or Space Physics and experience how
            physical principles shape the universe.
          </p>

          <div className="pt-3">
            <a
              href="#physics-topics"
              onClick={(e) => {
                e.preventDefault();
                scrollToTopics();
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]/60"
            >
              <span>Start Exploring Physics</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
