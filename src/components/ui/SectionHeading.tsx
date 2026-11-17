import React from 'react';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  align?: 'left' | 'center';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  subtitle,
  rightSlot,
  align = 'left',
}) => {
  if (align === 'center') {
    return (
      <div className="max-w-3xl mx-auto text-center mb-12">
        {kicker && (
          <p className="text-xs font-mono tracking-widest uppercase text-[#22D3EE] mb-3">
            {kicker}
          </p>
        )}
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white text-balance">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div className="max-w-2xl">
        {kicker && (
          <p className="text-xs font-mono tracking-widest uppercase text-[#5578F5] mb-2.5">
            {kicker}
          </p>
        )}
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white text-balance">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2.5 text-sm sm:text-base text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  );
};
