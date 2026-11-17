import React from 'react';
import { ArrowRight, Bookmark, Trash2 } from 'lucide-react';
import { getSubjectBySlug } from '../../data/subjects';
import { useLearningStore } from '../../stores/useLearningStore';
import type { SubjectDefinition } from '../../types/subject';

export const MyLearningView: React.FC = () => {
  const savedSlugs = useLearningStore((s) => s.savedSubjects);
  const subjectNotes = useLearningStore((s) => s.subjectNotes);
  const toggleSaved = useLearningStore((s) => s.toggleSavedSubject);
  const navigate = useLearningStore((s) => s.navigate);

  const savedList = savedSlugs
    .map((slug) => getSubjectBySlug(slug))
    .filter((item): item is SubjectDefinition => Boolean(item));

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#F5F4EF] py-14 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#171C24]/10">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]">
              Personal Space
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#171C24]">
              My Learning
            </h1>
            <p className="text-sm sm:text-base text-[#4B5360]">
              Subjects you&apos;ve bookmarked and the curiosity notes saved across your
              exploration.
            </p>
          </div>

          <a
            href="/#subjects-section"
            onClick={(e) => {
              e.preventDefault();
              navigate({ type: 'home' }, 'subjects-section');
            }}
            className="px-4 py-2.5 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors self-start sm:self-auto inline-block"
          >
            Explore All Subjects
          </a>
        </div>

        {savedList.length === 0 ? (
          <div className="rounded-2xl bg-[#FAF9F5] border border-[#171C24]/12 p-12 text-center space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#ECEAE2] flex items-center justify-center mx-auto text-[#5578F5]">
              <Bookmark className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-display text-xl font-semibold text-[#171C24]">
                No subjects saved yet
              </h2>
              <p className="text-sm text-[#4B5360] max-w-md mx-auto">
                Open any of the six scientific subjects and save it here to keep track of
                your learning journey and personal notes.
              </p>
            </div>
            <a
              href="/#subjects-section"
              onClick={(e) => {
                e.preventDefault();
                navigate({ type: 'home' }, 'subjects-section');
              }}
              className="inline-block px-5 py-2.5 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors"
            >
              Choose a Subject
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedList.map((subject) => (
              <div
                key={subject.slug}
                className="rounded-xl bg-[#FAF9F5] border border-[#171C24]/12 p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-[#5578F5]">
                      {subject.number} · {subject.shortTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSaved(subject.slug)}
                      aria-label={`Remove ${subject.shortTitle} from My Learning`}
                      className="p-1.5 rounded-md text-[#646D7A] hover:text-rose-600 hover:bg-[#171C24]/5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-[#3D4450]">{subject.description}</p>

                  <div className="rounded-lg bg-[#F5F4EF] border border-[#171C24]/10 p-3.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[#646D7A] mb-1">
                      Saved Notes
                    </p>
                    <p className="text-xs sm:text-sm text-[#171C24] leading-relaxed">
                      {subjectNotes[subject.slug]?.trim()
                        ? subjectNotes[subject.slug]
                        : 'No personal notes recorded yet.'}
                    </p>
                  </div>
                </div>

                <a
                  href={subject.route}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ type: 'subject', slug: subject.slug });
                  }}
                  className="pt-3 border-t border-[#171C24]/10 flex items-center justify-between text-sm font-medium text-[#171C24] hover:text-[#5578F5] transition-colors"
                >
                  <span>Open {subject.shortTitle} Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
