import React, { useState } from 'react';
import { ArrowRight, Atom, Bookmark, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { getSubjectBySlug, SUBJECTS } from '../../data/subjects';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';
import { useLearningStore } from '../../stores/useLearningStore';
import type { SubjectSlug } from '../../types/subject';

interface SubjectDetailViewProps {
  slug: SubjectSlug;
  highlightModuleCode?: string;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  slug,
  highlightModuleCode,
}) => {
  const subject = getSubjectBySlug(slug);
  const navigate = useLearningStore((s) => s.navigate);
  const savedSubjects = useLearningStore((s) => s.savedSubjects);
  const toggleSavedSubject = useLearningStore((s) => s.toggleSavedSubject);
  const subjectNotes = useLearningStore((s) => s.subjectNotes);
  const setSubjectNote = useLearningStore((s) => s.setSubjectNote);
  const prefersReduced = useReducedMotionPref();
  const [imgError, setImgError] = useState(false);

  if (!subject) {
    return (
      <section className="py-24 px-4 text-center bg-[#F5F4EF]">
        <h1 className="font-display text-2xl font-semibold text-[#171C24]">
          Subject not found
        </h1>
        <button
          type="button"
          onClick={() => navigate({ type: 'home' }, 'subjects-section')}
          className="mt-4 px-5 py-2.5 rounded-lg bg-[#5578F5] text-white text-sm font-medium cursor-pointer"
        >
          Back to Subjects
        </button>
      </section>
    );
  }

  const isSaved = savedSubjects.includes(subject.slug);

  return (
    <motion.section
      key={subject.slug}
      initial={prefersReduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#F5F4EF] min-h-[calc(100vh-4rem)]"
    >
      {/* Semantic Breadcrumb Navigation Bar */}
      <div className="border-b border-[#171C24]/10 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[#4B5360]">
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
              {subject.shortTitle}
            </span>
          </nav>

          <button
            type="button"
            onClick={() => toggleSavedSubject(subject.slug)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
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

      {/* Subject Editorial Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#5578F5]">
              <span>Subject {subject.number}</span>
              <span>·</span>
              <span>Subject Journey</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[#171C24]">
              {subject.shortTitle}
            </h1>

            <p className="text-lg font-medium text-[#171C24]">
              {subject.description}
            </p>

            <p className="text-base text-[#4B5360] leading-relaxed">
              {subject.extendedIntro}
            </p>

            <div className="pt-2 space-y-2 border-t border-[#171C24]/10">
              <p className="text-xs font-medium uppercase tracking-widest text-[#646D7A]">
                Core Topics Covered
              </p>
              <p className="text-sm text-[#171C24]">
                {subject.topics.join(' · ')}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-[#171C24]/10 bg-[#E7E4DA]">
              {!imgError ? (
                <img
                  src={subject.artworkUrl}
                  alt={subject.artworkAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full aspect-[4/3] object-cover block"
                />
              ) : (
                <div className="w-full aspect-[4/3] bg-museum-grid flex flex-col items-center justify-center p-8">
                  <Atom className="w-10 h-10 text-[#5578F5] mb-2" />
                  <span className="font-display text-lg text-[#171C24]">
                    {subject.shortTitle}
                  </span>
                </div>
              )}
              <div className="px-5 py-3 bg-[#FAF9F5] border-t border-[#171C24]/10 text-xs text-[#555D6B]">
                Guiding Principle: {subject.guidingPrinciple}
              </div>
            </div>
          </div>
        </div>

        {/* Future Subject Journey Roadmap + Personal Learning Notes */}
        <div className="mt-16 pt-12 border-t border-[#171C24]/10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5] mb-2">
                Inside This Subject Journey
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#171C24]">
                Planned Interactive Explorations
              </h2>
              <p className="mt-2 text-sm text-[#4B5360]">
                Interactive simulations, visual animations, and quantitative analysis tools
                for {subject.shortTitle} will live directly inside these curriculum chapters.
              </p>
            </div>

            <div className="space-y-4">
              {subject.journeyModules.map((mod) => {
                const isHighlighted = highlightModuleCode === mod.code;
                return (
                  <div
                    key={mod.code}
                    id={`module-${mod.code}`}
                    className={`rounded-xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      isHighlighted
                        ? 'bg-white border-[#5578F5] ring-2 ring-[#5578F5]/20'
                        : 'bg-[#FAF9F5] border-[#171C24]/12'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#5578F5]">
                        <span>{mod.code}</span>
                        <span>·</span>
                        <span className="text-[#555D6B] font-sans">{mod.focus}</span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-[#171C24]">
                        {mod.title}
                      </h3>
                      <p className="text-sm text-[#4B5360] leading-relaxed">
                        {mod.stageSummary}
                      </p>
                    </div>

                    <span className="font-mono text-xs text-[#646D7A] whitespace-nowrap shrink-0">
                      {isHighlighted ? 'Selected Focus' : 'Upcoming Module'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personal Curiosity Notebook */}
          <div className="lg:col-span-4">
            <div className="rounded-xl bg-[#FAF9F5] border border-[#171C24]/12 p-6 space-y-4">
              <h3 className="font-display text-lg font-semibold text-[#171C24]">
                My {subject.shortTitle} Notes
              </h3>
              <p className="text-xs text-[#555D6B] leading-relaxed">
                Capture questions you want to investigate or key principles you&apos;re
                studying. Saved automatically to My Learning.
              </p>
              <textarea
                rows={6}
                aria-label={`Personal notes for ${subject.shortTitle}`}
                value={subjectNotes[subject.slug] ?? ''}
                onChange={(e) => setSubjectNote(subject.slug, e.target.value)}
                placeholder={`What are you curious to explore in ${subject.shortTitle}?`}
                className="w-full rounded-lg bg-white border border-[#171C24]/15 p-3 text-sm text-[#171C24] placeholder:text-[#848B96] focus:outline-none focus:border-[#5578F5]"
              />
            </div>
          </div>
        </div>

        {/* Lateral Subject Switcher */}
        <div className="mt-16 pt-10 border-t border-[#171C24]/10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#555D6B] mb-5">
            Continue Exploring Related Subjects
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUBJECTS.filter((s) => s.slug !== subject.slug).map((other) => (
              <a
                key={other.slug}
                href={other.route}
                onClick={(e) => {
                  e.preventDefault();
                  navigate({ type: 'subject', slug: other.slug });
                }}
                className="group rounded-xl bg-[#FAF9F5] border border-[#171C24]/12 hover:border-[#5578F5]/60 p-4 flex items-center justify-between gap-3 transition-colors"
              >
                <div>
                  <span className="font-mono text-[11px] text-[#5578F5]">
                    {other.number}
                  </span>
                  <p className="font-display text-base font-semibold text-[#171C24] group-hover:text-[#5578F5] transition-colors">
                    {other.shortTitle}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#555D6B] group-hover:text-[#5578F5] group-hover:translate-x-0.5 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
