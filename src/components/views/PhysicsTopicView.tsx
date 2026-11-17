import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  getPhysicsTopicBySlug,
  PHYSICS_TOPICS,
  type PhysicsTopicSlug,
} from '../../data/physicsTopics';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';
import { useLearningStore } from '../../stores/useLearningStore';
import { PhysicsTopicVisual } from '../physics/PhysicsTopicVisual';

interface PhysicsTopicViewProps {
  topicSlug: PhysicsTopicSlug;
}

function computeLabReadout(
  slug: PhysicsTopicSlug,
  value: number
): { primaryLabel: string; primaryValue: string; secondaryLabel: string; secondaryValue: string } {
  switch (slug) {
    case 'mechanics': {
      const period = 2 * Math.PI * Math.sqrt(value / 9.81);
      return {
        primaryLabel: 'Oscillation Period (T)',
        primaryValue: `${period.toFixed(2)} s`,
        secondaryLabel: 'Frequency (f)',
        secondaryValue: `${(1 / period).toFixed(2)} Hz`,
      };
    }
    case 'electricity': {
      const current = value / 12;
      const power = value * current;
      return {
        primaryLabel: 'Circuit Current (I)',
        primaryValue: `${current.toFixed(2)} A`,
        secondaryLabel: 'Dissipated Power (P)',
        secondaryValue: `${power.toFixed(1)} W`,
      };
    }
    case 'magnetism': {
      const inducedEmf = value * 0.15;
      return {
        primaryLabel: 'Induced Voltage (ε)',
        primaryValue: `${inducedEmf.toFixed(1)} V`,
        secondaryLabel: 'Flux Change Rate',
        secondaryValue: '0.15 Wb/s',
      };
    }
    case 'waves-and-sound': {
      const wavelength = 343 / value;
      return {
        primaryLabel: 'Wavelength in Air (λ)',
        primaryValue: `${wavelength.toFixed(2)} m`,
        secondaryLabel: 'Period (1 / f)',
        secondaryValue: `${((1 / value) * 1000).toFixed(2)} ms`,
      };
    }
    case 'light-and-optics': {
      const rad1 = (value * Math.PI) / 180;
      const sin2 = Math.sin(rad1) / 1.52;
      const deg2 = (Math.asin(Math.min(1, Math.max(-1, sin2))) * 180) / Math.PI;
      return {
        primaryLabel: 'Refracted Angle (θ₂)',
        primaryValue: `${deg2.toFixed(1)}°`,
        secondaryLabel: 'Speed in Glass',
        secondaryValue: '1.97 × 10⁸ m/s',
      };
    }
    case 'thermodynamics': {
      const eff = (1 - 300 / value) * 100;
      return {
        primaryLabel: 'Max Carnot Efficiency',
        primaryValue: `${eff.toFixed(1)}%`,
        secondaryLabel: 'Cold Sink Temp',
        secondaryValue: '300 K',
      };
    }
    case 'modern-physics': {
      const gamma = 1 / Math.sqrt(1 - value * value);
      return {
        primaryLabel: 'Lorentz Factor (γ)',
        primaryValue: `${gamma.toFixed(2)}×`,
        secondaryLabel: 'Clock Rate',
        secondaryValue: `${((1 / gamma) * 100).toFixed(0)}% of rest`,
      };
    }
    case 'astronomy-and-space-physics': {
      const years = Math.sqrt(Math.pow(value, 3));
      const speedKms = 29.78 / Math.sqrt(value);
      return {
        primaryLabel: 'Orbital Period (T)',
        primaryValue: `${years.toFixed(2)} yr`,
        secondaryLabel: 'Mean Orbital Speed',
        secondaryValue: `${speedKms.toFixed(1)} km/s`,
      };
    }
  }
}

export const PhysicsTopicView: React.FC<PhysicsTopicViewProps> = ({ topicSlug }) => {
  const topic = getPhysicsTopicBySlug(topicSlug);
  const navigate = useLearningStore((s) => s.navigate);
  const savedSubjects = useLearningStore((s) => s.savedSubjects);
  const toggleSavedSubject = useLearningStore((s) => s.toggleSavedSubject);
  const subjectNotes = useLearningStore((s) => s.subjectNotes);
  const setSubjectNote = useLearningStore((s) => s.setSubjectNote);
  const prefersReduced = useReducedMotionPref();

  const [paramValue, setParamValue] = useState<number>(
    topic?.interactiveLabPreview.defaultValue ?? 1
  );

  useEffect(() => {
    if (topic) {
      setParamValue(topic.interactiveLabPreview.defaultValue);
    }
  }, [topic]);

  if (!topic) {
    return null;
  }

  const currentIdx = PHYSICS_TOPICS.findIndex((t) => t.slug === topic.slug);
  const prevTopic = currentIdx > 0 ? PHYSICS_TOPICS[currentIdx - 1] : null;
  const nextTopic =
    currentIdx < PHYSICS_TOPICS.length - 1 ? PHYSICS_TOPICS[currentIdx + 1] : null;

  const isSaved = savedSubjects.includes('physics');
  const readout = computeLabReadout(topic.slug, paramValue);

  return (
    <motion.div
      key={topic.slug}
      initial={prefersReduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#F5F4EF] min-h-[calc(100vh-4rem)] text-[#171C24]"
    >
      {/* Semantic Breadcrumb */}
      <div className="border-b border-[#171C24]/10 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-sm text-[#4B5360]"
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
            <a
              href="/subjects/physics"
              onClick={(e) => {
                e.preventDefault();
                navigate({ type: 'subject', slug: 'physics' });
              }}
              className="hover:text-[#171C24] transition-colors"
            >
              Physics
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-[#848B96]" aria-hidden="true" />
            <span className="font-medium text-[#171C24]" aria-current="page">
              {topic.title}
            </span>
          </nav>

          <button
            type="button"
            onClick={() => toggleSavedSubject('physics')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isSaved
                ? 'bg-[#5578F5] text-white border-[#5578F5]'
                : 'bg-white text-[#171C24] border-[#171C24]/15 hover:border-[#5578F5]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
            <span>{isSaved ? 'Physics Saved' : 'Save Physics'}</span>
          </button>
        </div>
      </div>

      {/* Topic Header & Visual */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <a
              href="/subjects/physics"
              onClick={(e) => {
                e.preventDefault();
                navigate({ type: 'subject', slug: 'physics' });
              }}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#5578F5] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>All Physics Topics</span>
            </a>

            <p className="font-mono text-xs uppercase tracking-widest text-[#5578F5]">
              Topic {topic.number} · {topic.domainLabel}
            </p>

            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[#171C24] text-balance">
              {topic.title}
            </h1>

            <p className="text-base sm:text-lg text-[#3D4450] leading-relaxed">
              {topic.overview}
            </p>

            <div className="pt-3 border-t border-[#171C24]/10">
              <p className="text-xs font-medium uppercase tracking-widest text-[#646D7A] mb-1">
                In Everyday Life
              </p>
              <p className="text-sm text-[#4B5360] leading-relaxed">
                {topic.everydayAnchor}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-[#FAF9F5] border border-[#171C24]/12 p-6 space-y-4">
              <PhysicsTopicVisual motif={topic.visualMotif} />
              <div className="pt-1 border-t border-[#171C24]/10 flex items-center justify-between text-xs text-[#555D6B]">
                <span>Key Focus Areas</span>
                <span className="font-mono text-[#5578F5]">
                  {topic.keyConcepts.length} Concepts
                </span>
              </div>
            </div>
          </div>
        </div>

        {topic.slug === 'mechanics' && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-[#101827] border border-[#24324B] p-6 sm:p-7 flex flex-col justify-between gap-6 text-[#F5F4EF]">
              <div className="space-y-2.5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#38BDF8]">
                  Interactive Physics Laboratory · Experiment 01
                </p>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-[#F5F4EF]">
                  Simple Pendulum Motion Simulation
                </h2>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  Explore real-time Runge-Kutta (RK4) pendulum dynamics. Vary cord length,
                  release angle, gravity, and mass while inspecting live energy graphs and
                  exporting experimental period measurements.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="/subjects/physics/mechanics/simple-pendulum"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({
                      type: 'experiment',
                      subjectSlug: 'physics',
                      topicSlug: 'mechanics',
                      experimentSlug: 'simple-pendulum',
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]"
                >
                  <span>Launch Simulation</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-[#101827] border border-[#24324B] p-6 sm:p-7 flex flex-col justify-between gap-6 text-[#F5F4EF]">
              <div className="space-y-2.5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#38BDF8]">
                  Interactive Physics Laboratory · Experiment 02
                </p>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-[#F5F4EF]">
                  Newton&apos;s Laws of Motion Simulation
                </h2>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  Investigate inertia, F = ma acceleration, static and kinetic friction,
                  and equal-and-opposite action-reaction forces across three interactive
                  modes with real-time force vectors and CSV export.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="/subjects/physics/mechanics/newtons-laws"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({
                      type: 'experiment',
                      subjectSlug: 'physics',
                      topicSlug: 'mechanics',
                      experimentSlug: 'newtons-laws',
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]"
                >
                  <span>Launch Simulation</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Concept Explorer + Core Laws */}
        <div className="mt-14 pt-12 border-t border-[#171C24]/10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            {/* Interactive Parameter Explorer inside the Topic Page */}
            <div className="rounded-2xl bg-[#FAF9F5] border border-[#171C24]/12 p-6 sm:p-8 space-y-6">
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]">
                  Interactive Exploration
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#171C24]">
                  {topic.interactiveLabPreview.title}
                </h2>
                <p className="text-sm text-[#4B5360]">
                  {topic.interactiveLabPreview.prompt}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <label
                    htmlFor="topic-param-slider"
                    className="font-medium text-[#171C24]"
                  >
                    {topic.interactiveLabPreview.parameterLabel}
                  </label>
                  <span className="font-mono tabular-nums text-[#5578F5] font-medium">
                    {paramValue} {topic.interactiveLabPreview.unit}
                  </span>
                </div>
                <input
                  id="topic-param-slider"
                  type="range"
                  min={topic.interactiveLabPreview.min}
                  max={topic.interactiveLabPreview.max}
                  step={topic.interactiveLabPreview.step}
                  value={paramValue}
                  onChange={(e) => setParamValue(Number(e.target.value))}
                  className="w-full accent-[#5578F5] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#171C24]/10">
                <div className="rounded-xl bg-[#F5F4EF] border border-[#171C24]/10 p-4">
                  <p className="text-xs text-[#555D6B]">{readout.primaryLabel}</p>
                  <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#171C24]">
                    {readout.primaryValue}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F5F4EF] border border-[#171C24]/10 p-4">
                  <p className="text-xs text-[#555D6B]">{readout.secondaryLabel}</p>
                  <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#5578F5]">
                    {readout.secondaryValue}
                  </p>
                </div>
              </div>
            </div>

            {/* Fundamental Laws */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#171C24]">
                Fundamental Principles &amp; Laws
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topic.coreLaws.map((law) => (
                  <div
                    key={law.name}
                    className="rounded-xl bg-[#FAF9F5] border border-[#171C24]/12 p-5 space-y-2.5"
                  >
                    <p className="text-xs font-medium uppercase tracking-wider text-[#5578F5]">
                      {law.name}
                    </p>
                    <p className="font-mono text-lg font-semibold text-[#171C24]">
                      {law.formula}
                    </p>
                    <p className="text-sm text-[#4B5360] leading-relaxed">
                      {law.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Concept Map & Personal Notes */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-[#FAF9F5] border border-[#171C24]/12 p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-[#171C24]">
                What You&apos;ll Study in {topic.title}
              </h2>
              <ul className="space-y-2.5 text-sm text-[#3D4450]">
                {topic.keyConcepts.map((concept, idx) => (
                  <li
                    key={concept}
                    className="flex items-start gap-3 py-1.5 border-b border-[#171C24]/8 last:border-b-0"
                  >
                    <span className="font-mono text-xs text-[#5578F5] pt-0.5">
                      0{idx + 1}
                    </span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-[#FAF9F5] border border-[#171C24]/12 p-6 space-y-3">
              <h2 className="font-display text-lg font-semibold text-[#171C24]">
                My Physics Notes
              </h2>
              <p className="text-xs text-[#555D6B] leading-relaxed">
                Jot down questions or observations from {topic.title}. Saved directly to
                My Learning.
              </p>
              <textarea
                rows={5}
                aria-label="Personal Physics study notes"
                value={subjectNotes.physics ?? ''}
                onChange={(e) => setSubjectNote('physics', e.target.value)}
                placeholder={`Record your questions or insights on ${topic.title}...`}
                className="w-full rounded-lg bg-white border border-[#171C24]/15 p-3 text-sm text-[#171C24] placeholder:text-[#848B96] focus:outline-none focus:border-[#5578F5]"
              />
            </div>
          </div>
        </div>

        {/* Previous / Next Topic Navigation */}
        <div className="mt-14 pt-8 border-t border-[#171C24]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {prevTopic ? (
            <a
              href={prevTopic.route}
              onClick={(e) => {
                e.preventDefault();
                navigate({
                  type: 'subject-topic',
                  subjectSlug: 'physics',
                  topicSlug: prevTopic.slug,
                });
              }}
              className="group rounded-xl bg-[#FAF9F5] border border-[#171C24]/12 hover:border-[#5578F5]/60 px-5 py-4 flex items-center gap-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#555D6B] group-hover:text-[#5578F5]" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#646D7A]">Previous Topic</p>
                <p className="font-display text-base font-semibold text-[#171C24] group-hover:text-[#5578F5]">
                  {prevTopic.title}
                </p>
              </div>
            </a>
          ) : (
            <div />
          )}

          {nextTopic ? (
            <a
              href={nextTopic.route}
              onClick={(e) => {
                e.preventDefault();
                navigate({
                  type: 'subject-topic',
                  subjectSlug: 'physics',
                  topicSlug: nextTopic.slug,
                });
              }}
              className="group rounded-xl bg-[#FAF9F5] border border-[#171C24]/12 hover:border-[#5578F5]/60 px-5 py-4 flex items-center justify-end gap-3 text-right transition-colors"
            >
              <div>
                <p className="text-xs text-[#646D7A]">Next Topic</p>
                <p className="font-display text-base font-semibold text-[#171C24] group-hover:text-[#5578F5]">
                  {nextTopic.title}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#555D6B] group-hover:text-[#5578F5]" aria-hidden="true" />
            </a>
          ) : (
            <a
              href="/subjects/physics"
              onClick={(e) => {
                e.preventDefault();
                navigate({ type: 'subject', slug: 'physics' });
              }}
              className="group rounded-xl bg-[#FAF9F5] border border-[#171C24]/12 hover:border-[#5578F5]/60 px-5 py-4 flex items-center justify-end gap-3 text-right transition-colors"
            >
              <div>
                <p className="text-xs text-[#646D7A]">Curriculum Overview</p>
                <p className="font-display text-base font-semibold text-[#171C24] group-hover:text-[#5578F5]">
                  Back to Physics
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#555D6B] group-hover:text-[#5578F5]" aria-hidden="true" />
            </a>
          )}
        </div>
      </section>
    </motion.div>
  );
};
