import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SUBJECTS } from '../../data/subjects';
import { useLearningStore } from '../../stores/useLearningStore';

interface NotFoundViewProps {
  path: string;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ path }) => {
  const navigate = useLearningStore((s) => s.navigate);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#F5F4EF] py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#5578F5]">
          404 · Page Not Found
        </p>

        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#171C24] text-balance">
          This scientific destination doesn&apos;t exist.
        </h1>

        <p className="text-base text-[#4B5360] leading-relaxed max-w-xl mx-auto">
          We couldn&apos;t find <code className="font-mono text-sm text-[#171C24]">{path}</code>.
          Return to the homepage or choose one of our six scientific subjects below.
        </p>

        <div className="pt-2">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate({ type: 'home' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#5578F5] text-white text-sm font-medium hover:bg-[#4467E4] transition-colors"
          >
            <span>Return to LABVERSE Home</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="pt-10 border-t border-[#171C24]/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
          {SUBJECTS.map((sub) => (
            <a
              key={sub.slug}
              href={sub.route}
              onClick={(e) => {
                e.preventDefault();
                navigate({ type: 'subject', slug: sub.slug });
              }}
              className="rounded-lg bg-[#FAF9F5] border border-[#171C24]/10 hover:border-[#5578F5]/60 p-3.5 transition-colors"
            >
              <span className="font-mono text-[11px] text-[#5578F5]">{sub.number}</span>
              <p className="font-display text-sm font-semibold text-[#171C24]">
                {sub.shortTitle}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
