import React from 'react';
import { SUBJECTS } from '../../data/subjects';
import { useLearningStore } from '../../stores/useLearningStore';

export const Footer: React.FC = () => {
  const navigate = useLearningStore((s) => s.navigate);

  return (
    <footer className="bg-[#ECEAE2] text-[#4B5360]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5 space-y-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate({ type: 'home' });
              }}
              className="font-display text-base font-bold tracking-tight text-[#171C24] inline-block"
            >
              LABVERSE
            </a>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#5578F5]">
              Explore. Experiment. Understand.
            </p>
            <p className="text-sm text-[#4B5360] max-w-sm leading-relaxed">
              An interactive science-learning platform built to make scientific discovery
              visual, intuitive, and deeply engaging.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#171C24]">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/#subjects-section"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ type: 'home' }, 'subjects-section');
                  }}
                  className="hover:text-[#171C24] transition-colors inline-block"
                >
                  Subjects
                </a>
              </li>
              <li>
                <a
                  href="/#philosophy-section"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ type: 'home' }, 'philosophy-section');
                  }}
                  className="hover:text-[#171C24] transition-colors inline-block"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ type: 'about' });
                  }}
                  className="hover:text-[#171C24] transition-colors inline-block"
                >
                  About LABVERSE
                </a>
              </li>
              <li>
                <a
                  href="/my-learning"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ type: 'my-learning' });
                  }}
                  className="hover:text-[#171C24] transition-colors inline-block"
                >
                  My Learning
                </a>
              </li>
            </ul>
          </div>

          {/* Subject Journeys */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#171C24]">
              Subject Journeys
            </h3>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm">
              {SUBJECTS.map((subject) => (
                <li key={subject.slug}>
                  <a
                    href={subject.route}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate({ type: 'subject', slug: subject.slug });
                    }}
                    className="hover:text-[#5578F5] transition-colors"
                  >
                    {subject.shortTitle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#171C24]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#646D7A]">
          <p>© {new Date().getFullYear()} LABVERSE. Science isn&apos;t just something you study.</p>
          <p>Digital Science Discovery Platform</p>
        </div>
      </div>
    </footer>
  );
};
