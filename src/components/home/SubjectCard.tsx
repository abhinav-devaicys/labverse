import React, { useState } from 'react';
import { ArrowRight, Atom } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';
import { useLearningStore } from '../../stores/useLearningStore';
import type { SubjectDefinition } from '../../types/subject';

interface SubjectCardProps {
  subject: SubjectDefinition;
  index: number;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, index }) => {
  const navigate = useLearningStore((s) => s.navigate);
  const prefersReduced = useReducedMotionPref();
  const [imgError, setImgError] = useState(false);
  const [pointer, setPointer] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  const isWide = subject.layoutSpan === 'wide';
  const hasExtendedContext = index === 0 || index === 3;
  const featuredChapter = subject.journeyModules[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPointer({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setPointer((prev) => ({ ...prev, active: false }));
  };

  return (
    <motion.article
      initial={prefersReduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`${isWide ? 'lg:col-span-7' : 'lg:col-span-5'} ${hasExtendedContext ? 'h-full' : ''}`}
    >
      <a
        href={subject.route}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          e.preventDefault();
          navigate({ type: 'subject', slug: subject.slug });
        }}
        className={`relative group block h-full rounded-xl border border-[#171C24]/12 hover:border-[#5578F5]/65 ${subject.cardSurfaceClass} transition-all duration-200 hover:shadow-[0_16px_38px_-18px_rgba(23,28,36,0.2)] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]`}
      >
        {/* Subtle pointer-responsive sheen */}
        {!prefersReduced && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
            style={{
              opacity: pointer.active ? 1 : 0,
              background: `radial-gradient(420px circle at ${pointer.x}% ${pointer.y}%, rgba(85, 120, 245, 0.075), transparent 65%)`,
            }}
          />
        )}

        <div
          className={`relative z-20 h-full flex flex-col ${
            isWide ? 'md:grid md:grid-cols-12' : ''
          }`}
        >
          {/* Artwork Frame */}
          <div
            className={`relative overflow-hidden bg-[#E7E4DA] ${
              isWide
                ? 'md:col-span-6 aspect-[4/3] md:aspect-auto md:h-full'
                : 'aspect-[16/10]'
            }`}
          >
            {!imgError ? (
              <img
                src={subject.artworkUrl}
                alt={subject.artworkAlt}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
              />
            ) : (
              <div className="w-full h-full bg-museum-grid flex flex-col items-center justify-center p-6 text-center">
                <Atom className="w-8 h-8 text-[#5578F5] mb-2" />
                <span className="font-display text-sm font-medium text-[#171C24]">
                  {subject.shortTitle}
                </span>
              </div>
            )}
          </div>

          {/* Editorial Content Column */}
          <div
            className={`p-6 sm:p-7 flex flex-col justify-between gap-6 ${
              isWide ? 'md:col-span-6' : 'flex-1'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium tracking-widest text-[#5578F5]">
                  {subject.number}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-widest text-[#646D7A]">
                  Subject Journey
                </span>
              </div>

              <h3 className="font-display text-2xl font-semibold tracking-tight text-[#171C24] group-hover:text-[#5578F5] transition-colors">
                {subject.name}
              </h3>

              <p className="text-sm sm:text-base text-[#3D4450] leading-relaxed">
                {subject.description}
              </p>

              {/* Clean unboxed topic list */}
              <p className="pt-1 text-xs leading-relaxed text-[#5E6673]">
                {subject.topics.join(' · ')}
              </p>

              {/* Hover topic insight preview (fixed height container, zero layout shift) */}
              {featuredChapter && (
                <p className="text-xs text-[#5578F5] opacity-75 group-hover:opacity-100 transition-opacity duration-200 truncate">
                  Includes: {featuredChapter.title}
                </p>
              )}

              {hasExtendedContext && (
                <div className="pt-4 mt-2 border-t border-[#171C24]/10 space-y-2.5">
                  <p className="text-xs sm:text-sm text-[#4B5360] leading-relaxed">
                    {subject.extendedIntro}
                  </p>
                  <p className="font-mono text-[11px] text-[#5578F5] leading-relaxed">
                    {subject.guidingPrinciple}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#171C24]/10 flex items-center justify-between text-sm font-medium text-[#171C24] group-hover:text-[#5578F5] transition-colors">
              <span>Explore {subject.shortTitle}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </a>
    </motion.article>
  );
};
