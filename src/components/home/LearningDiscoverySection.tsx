import React from 'react';
import { ArrowRight, Compass, History } from 'lucide-react';
import { getTodaysDiscovery } from '../../data/curiosity';
import { getSubjectBySlug, SUBJECTS } from '../../data/subjects';
import { useLearningStore } from '../../stores/useLearningStore';

export const LearningDiscoverySection: React.FC = () => {
  const navigate = useLearningStore((s) => s.navigate);
  const recentSubjects = useLearningStore((s) => s.recentSubjects);
  const savedSubjects = useLearningStore((s) => s.savedSubjects);

  const daily = getTodaysDiscovery();
  const primarySubject = getSubjectBySlug(daily.primarySubject);

  // Use recently visited subjects first, otherwise suggest starting subjects not yet saved
  const continueSlugs =
    recentSubjects.length > 0
      ? recentSubjects
      : savedSubjects.length > 0
      ? savedSubjects
      : (['physics', 'chemistry'] as const);

  const continueSubjects = continueSlugs
    .map((slug) => getSubjectBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .slice(0, 3);

  const relatedSuggestions = daily.relatedSubjects
    .map((slug) => getSubjectBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const isReturning = recentSubjects.length > 0;

  return (
    <section className="py-16 lg:py-20 bg-[#F5F4EF] border-b border-[#171C24]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Daily Discovery Spotlight */}
          <div className="lg:col-span-7 rounded-xl bg-[#FAF9F5] border border-[#171C24]/12 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[#5578F5]">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Daily Discovery</span>
                </span>
                <span className="font-mono text-[11px] text-[#646D7A]">
                  {daily.phenomenon}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#171C24] text-balance">
                {daily.title}
              </h2>

              <p className="text-sm sm:text-base text-[#4B5360] leading-relaxed">
                {daily.explanation}
              </p>

              <p className="text-xs font-mono text-[#5578F5] pt-1">
                Key insight: {daily.keyTakeaway}
              </p>
            </div>

            <div className="pt-4 border-t border-[#171C24]/10 flex flex-wrap items-center justify-between gap-4">
              {primarySubject && (
                <a
                  href={primarySubject.route}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ type: 'subject', slug: primarySubject.slug });
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#171C24] hover:text-[#5578F5] transition-colors"
                >
                  <span>Study inside {primarySubject.shortTitle}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}

              <div className="flex items-center gap-3 text-xs text-[#555D6B]">
                <span>Related:</span>
                {relatedSuggestions.map((rel) => (
                  <a
                    key={rel.slug}
                    href={rel.route}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate({ type: 'subject', slug: rel.slug });
                    }}
                    className="font-medium text-[#171C24] hover:text-[#5578F5] underline underline-offset-4 decoration-[#171C24]/25"
                  >
                    {rel.shortTitle}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Learning / Recently Visited */}
          <div className="lg:col-span-5 rounded-xl bg-[#ECEAE2] border border-[#171C24]/12 p-6 sm:p-8 flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[#171C24]">
                  <History className="w-3.5 h-3.5 text-[#5578F5]" />
                  <span>{isReturning ? 'Continue Learning' : 'Recommended Starting Points'}</span>
                </span>
                <span className="text-[11px] font-mono text-[#555D6B]">
                  {isReturning ? 'Recently Visited' : 'Curated'}
                </span>
              </div>

              <div className="space-y-2.5">
                {continueSubjects.map((sub) => (
                  <a
                    key={sub.slug}
                    href={sub.route}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate({ type: 'subject', slug: sub.slug });
                    }}
                    className="group flex items-center justify-between gap-3 rounded-lg bg-[#FAF9F5] border border-[#171C24]/10 hover:border-[#5578F5]/60 px-4 py-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-[#5578F5]">
                        {sub.number} · {sub.shortTitle}
                      </p>
                      <p className="text-xs text-[#4B5360] truncate mt-0.5">
                        {sub.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#555D6B] group-hover:text-[#5578F5] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#171C24]/10 flex items-center justify-between text-xs">
              <span className="text-[#555D6B]">
                {SUBJECTS.length} disciplines open without sign-in
              </span>
              <a
                href="/my-learning"
                onClick={(e) => {
                  e.preventDefault();
                  navigate({ type: 'my-learning' });
                }}
                className="font-medium text-[#171C24] hover:text-[#5578F5] transition-colors"
              >
                Open My Learning
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
