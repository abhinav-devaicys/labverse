import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLearningStore } from '../../stores/useLearningStore';

export const FinalCtaSection: React.FC = () => {
  const navigate = useLearningStore((s) => s.navigate);

  const handleExploreSubjects = () => {
    navigate({ type: 'home' }, 'subjects-section');
  };

  return (
    <section className="py-24 lg:py-32 bg-[#F5F4EF] border-b border-[#171C24]/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]">
          Begin Your Journey
        </p>

        <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#171C24] leading-[1.1] text-balance">
          Curiosity is where every discovery begins.
        </h2>

        <p className="text-base sm:text-lg text-[#4B5360] leading-relaxed max-w-2xl mx-auto">
          Choose a subject, follow your curiosity and discover a new way to understand
          science.
        </p>

        <div className="pt-3">
          <a
            href="/#subjects-section"
            onClick={(e) => {
              e.preventDefault();
              handleExploreSubjects();
            }}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]/60"
          >
            <span>Explore Subjects</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
