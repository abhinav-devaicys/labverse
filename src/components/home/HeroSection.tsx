import React, { useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';
import { Hero3DSculpture } from './Hero3DSculpture';

export const HeroSection: React.FC = () => {
  const prefersReduced = useReducedMotionPref();
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const sculptureParallaxY = useTransform(scrollYProgress, [0, 1], [0, 28]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative bg-[#F5F4EF] border-b border-[#171C24]/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Editorial Column with Staggered Headline */}
          <div className="lg:col-span-6 space-y-7">
            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]"
            >
              Explore · Experiment · Understand
            </motion.p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-[#171C24] leading-[1.06] text-balance">
              <motion.span
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                A world of science.
              </motion.span>
              <motion.span
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                One place to explore.
              </motion.span>
            </h1>

            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#4B5360] leading-relaxed max-w-xl"
            >
              Discover the principles behind our universe. Explore scientific subjects,
              understand complex concepts and experience learning through interactive
              visual discovery.
            </motion.p>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href="#subjects-section"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('subjects-section');
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]/60"
              >
                <span>Explore Subjects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#philosophy-section"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('philosophy-section');
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[#171C24]/20 text-[#171C24] text-sm font-medium hover:border-[#171C24]/45 hover:bg-[#171C24]/[0.03] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171C24]/30"
              >
                <span>Discover LABVERSE</span>
              </a>
            </motion.div>

            <motion.p
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.36 }}
              className="pt-2 text-xs text-[#646D7A] italic font-display"
            >
              &ldquo;Science isn&apos;t just something you study. It&apos;s something you experience.&rdquo;
            </motion.p>
          </div>

          {/* Right Interactive 3D Scientific Sculpture Composition with subtle scroll parallax */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={prefersReduced ? undefined : { y: sculptureParallaxY }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-2xl overflow-hidden bg-[#ECEAE2] border border-[#171C24]/10 shadow-[0_20px_50px_-28px_rgba(23,28,36,0.22)]">
              <Hero3DSculpture />

              <div className="px-5 py-3 bg-[#FAF9F5]/95 border-t border-[#171C24]/10 flex items-center justify-between text-xs text-[#555D6B]">
                <span>Exhibit 01 · Equilibrium &amp; Orbital Geometry</span>
                <span className="font-mono text-[11px] text-[#5578F5]">
                  6 Scientific Journeys
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Minimal Scroll Invitation */}
        <div className="mt-12 lg:mt-16 flex justify-center">
          <a
            href="#subjects-section"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('subjects-section');
            }}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#555D6B] hover:text-[#171C24] transition-colors cursor-pointer"
          >
            <span>Scroll to explore subjects</span>
            <motion.span
              animate={prefersReduced ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-3.5 h-3.5 text-[#5578F5]" />
            </motion.span>
          </a>
        </div>
      </div>
    </section>
  );
};
