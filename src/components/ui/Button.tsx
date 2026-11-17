import React from 'react';

type ButtonVariant = 'amber' | 'blue' | 'secondary' | 'ghost' | 'crimson';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  amber:
    'bg-[#F59E0B] text-[#0B0F17] hover:bg-[#FBBF24] font-semibold shadow-sm focus-visible:ring-2 focus-visible:ring-[#F59E0B]/70',
  blue:
    'bg-[#5578F5] text-white hover:bg-[#6686F7] font-semibold shadow-sm focus-visible:ring-2 focus-visible:ring-[#5578F5]/70',
  crimson:
    'bg-[#E11D48] text-white hover:bg-[#F43F5E] font-semibold shadow-sm focus-visible:ring-2 focus-visible:ring-[#E11D48]/70',
  secondary:
    'bg-[#131B29] text-slate-200 border border-slate-700/80 hover:border-slate-500 hover:bg-[#182234] font-medium focus-visible:ring-2 focus-visible:ring-slate-500',
  ghost:
    'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium focus-visible:ring-2 focus-visible:ring-slate-500',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-xs min-h-[36px]',
  md: 'px-4 py-2.5 text-sm min-h-[40px]',
  lg: 'px-6 py-3 text-sm min-h-[44px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'blue',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
