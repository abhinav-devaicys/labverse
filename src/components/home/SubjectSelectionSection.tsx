import React from 'react';
import { SUBJECTS } from '../../data/subjects';
import { SubjectCard } from './SubjectCard';

export const SubjectSelectionSection: React.FC = () => {
  return (
    <section
      id="subjects-section"
      className="py-20 lg:py-28 bg-[#F5F4EF] border-b border-[#171C24]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 lg:mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5] mb-3">
            Choose Your Subject
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-[#171C24] leading-[1.12] text-balance">
            What are you curious about?
          </h2>
          <p className="mt-3.5 text-base text-[#4B5360] leading-relaxed">
            Choose your field of interest and begin exploring the science behind it.
          </p>
        </div>

        {/* Asymmetric editorial grid (mix of wide 7-col features and 5-col cards; last pair 6/6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {SUBJECTS.map((subject, idx) => {
            const isBottomPair = idx >= 4;
            return (
              <div
                key={subject.slug}
                className={
                  isBottomPair
                    ? 'lg:col-span-6'
                    : subject.layoutSpan === 'wide'
                    ? 'lg:col-span-7'
                    : 'lg:col-span-5'
                }
              >
                <SubjectCard subject={subject} index={idx} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
