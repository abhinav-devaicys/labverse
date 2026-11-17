import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLearningStore } from '../../stores/useLearningStore';

export const AboutView: React.FC = () => {
  const navigate = useLearningStore((s) => s.navigate);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#F5F4EF] py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5578F5]">
            About LABVERSE
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[#171C24] leading-[1.08] text-balance">
            Science isn&apos;t just something you study. It&apos;s something you experience.
          </h1>
          <p className="text-base sm:text-lg text-[#4B5360] leading-relaxed">
            LABVERSE is an educational science-learning platform designed to feel like an
            invitation to a modern digital science museum. Rather than burying learners in
            equations first, every journey begins with curiosity, visual intuition, and
            purposeful discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#171C24]/10">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[#5578F5]">01</span>
            <h2 className="font-display text-lg font-semibold text-[#171C24]">
              Subject-First Discovery
            </h2>
            <p className="text-sm text-[#4B5360] leading-relaxed">
              Every activity, animation, and analysis tool lives inside its home subject so
              concepts connect into a coherent scientific picture.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-[#5578F5]">02</span>
            <h2 className="font-display text-lg font-semibold text-[#171C24]">
              Visual Intuition
            </h2>
            <p className="text-sm text-[#4B5360] leading-relaxed">
              Complex systems across physics, chemistry, biology, math, earth science, and
              engineering are crafted to be seen and explored.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-[#5578F5]">03</span>
            <h2 className="font-display text-lg font-semibold text-[#171C24]">
              Built to Grow
            </h2>
            <p className="text-sm text-[#4B5360] leading-relaxed">
              Our typed subject architecture scales cleanly from introductory visual
              exhibits to full interactive simulation environments.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#FAF9F5] border border-[#171C24]/12 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-semibold text-[#171C24]">
              Explore our six scientific subjects
            </h2>
            <p className="text-sm text-[#4B5360]">
              Select a field to preview its curriculum journey and guiding principles.
            </p>
          </div>

          <a
            href="/#subjects-section"
            onClick={(e) => {
              e.preventDefault();
              navigate({ type: 'home' }, 'subjects-section');
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors shrink-0"
          >
            <span>Explore Subjects</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
