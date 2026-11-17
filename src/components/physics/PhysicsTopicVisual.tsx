import React from 'react';
import type { PhysicsVisualMotif } from '../../data/physicsTopics';

interface PhysicsTopicVisualProps {
  motif: PhysicsVisualMotif;
  className?: string;
}

export const PhysicsTopicVisual: React.FC<PhysicsTopicVisualProps> = ({
  motif,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full aspect-[16/10] rounded-xl bg-[#F0EFE9] border border-[#171C24]/8 overflow-hidden flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 240 150"
        className="w-full h-full text-[#171C24] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        aria-hidden="true"
      >
        {motif === 'pendulum' && (
          <g>
            <line x1="40" y1="24" x2="200" y2="24" stroke="#171C24" strokeOpacity="0.28" strokeWidth="1.2" />
            <path d="M 64 106 A 92 92 0 0 0 176 106" fill="none" stroke="#171C24" strokeOpacity="0.22" strokeDasharray="3 3" strokeWidth="1.2" />
            <line x1="120" y1="24" x2="152" y2="108" stroke="#171C24" strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="120" y1="24" x2="88" y2="108" stroke="#171C24" strokeWidth="1.5" />
            <circle cx="120" cy="24" r="3" fill="#171C24" />
            <circle cx="88" cy="108" r="11" fill="#FAF9F5" stroke="#171C24" strokeWidth="1.6" />
            <circle cx="88" cy="108" r="4" fill="#5578F5" />
            <circle cx="152" cy="108" r="8" fill="#5578F5" fillOpacity="0.2" stroke="#5578F5" strokeWidth="1.2" />
          </g>
        )}

        {motif === 'field' && (
          <g>
            <path d="M 74 75 C 96 42, 144 42, 166 75" fill="none" stroke="#5578F5" strokeOpacity="0.7" strokeWidth="1.4" />
            <path d="M 74 75 C 96 108, 144 108, 166 75" fill="none" stroke="#5578F5" strokeOpacity="0.7" strokeWidth="1.4" />
            <path d="M 74 75 C 102 22, 138 22, 166 75" fill="none" stroke="#171C24" strokeOpacity="0.24" strokeWidth="1.1" />
            <path d="M 74 75 C 102 128, 138 128, 166 75" fill="none" stroke="#171C24" strokeOpacity="0.24" strokeWidth="1.1" />
            <line x1="74" y1="75" x2="166" y2="75" stroke="#5578F5" strokeWidth="1.5" />
            <circle cx="74" cy="75" r="10" fill="#5578F5" />
            <line x1="70" y1="75" x2="78" y2="75" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="74" y1="71" x2="74" y2="79" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="166" cy="75" r="10" fill="#FAF9F5" stroke="#171C24" strokeWidth="1.6" />
            <line x1="162" y1="75" x2="170" y2="75" stroke="#171C24" strokeWidth="1.5" />
          </g>
        )}

        {motif === 'flux' && (
          <g>
            <ellipse cx="120" cy="75" rx="68" ry="42" fill="none" stroke="#5578F5" strokeOpacity="0.4" strokeWidth="1.2" />
            <ellipse cx="120" cy="75" rx="48" ry="28" fill="none" stroke="#5578F5" strokeOpacity="0.75" strokeWidth="1.4" />
            <ellipse cx="120" cy="75" rx="28" ry="15" fill="none" stroke="#171C24" strokeOpacity="0.3" strokeWidth="1.1" />
            <rect x="92" y="65" width="28" height="20" rx="2" fill="#5578F5" />
            <rect x="120" y="65" width="28" height="20" rx="2" fill="#171C24" />
            <text x="106" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="monospace">N</text>
            <text x="134" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="monospace">S</text>
          </g>
        )}

        {motif === 'wave' && (
          <g>
            <line x1="28" y1="75" x2="212" y2="75" stroke="#171C24" strokeOpacity="0.2" strokeWidth="1" />
            <path d="M 32 75 Q 54 32 76 75 T 120 75 T 164 75 T 208 75" fill="none" stroke="#5578F5" strokeWidth="2" strokeLinecap="round" />
            <path d="M 32 75 Q 54 118 76 75 T 120 75 T 164 75 T 208 75" fill="none" stroke="#171C24" strokeOpacity="0.32" strokeWidth="1.3" strokeDasharray="3 3" />
            <circle cx="32" cy="75" r="3.5" fill="#171C24" />
            <circle cx="120" cy="75" r="3.5" fill="#5578F5" />
            <circle cx="208" cy="75" r="3.5" fill="#171C24" />
          </g>
        )}

        {motif === 'prism' && (
          <g>
            <line x1="28" y1="68" x2="96" y2="82" stroke="#171C24" strokeOpacity="0.65" strokeWidth="1.75" />
            <line x1="142" y1="80" x2="212" y2="62" stroke="#5578F5" strokeWidth="1.8" />
            <line x1="142" y1="84" x2="212" y2="84" stroke="#5578F5" strokeOpacity="0.55" strokeWidth="1.4" />
            <line x1="142" y1="88" x2="212" y2="108" stroke="#171C24" strokeOpacity="0.45" strokeWidth="1.4" />
            <polygon points="120,38 156,106 84,106" fill="#FAF9F5" stroke="#171C24" strokeWidth="1.6" />
            <polygon points="120,52 144,98 96,98" fill="#5578F5" fillOpacity="0.1" />
          </g>
        )}

        {motif === 'thermal' && (
          <g>
            <line x1="42" y1="112" x2="198" y2="112" stroke="#171C24" strokeOpacity="0.25" strokeWidth="1" />
            <rect x="64" y="42" width="112" height="62" rx="8" fill="#FAF9F5" stroke="#171C24" strokeOpacity="0.22" strokeWidth="1.2" />
            <circle cx="88" cy="64" r="5" fill="#5578F5" />
            <circle cx="114" cy="84" r="4" fill="#171C24" fillOpacity="0.7" />
            <circle cx="136" cy="58" r="5.5" fill="#5578F5" fillOpacity="0.8" />
            <circle cx="154" cy="82" r="4" fill="#171C24" fillOpacity="0.5" />
            <path d="M 88 55 L 98 49 M 136 67 L 146 73" stroke="#5578F5" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 82 34 Q 88 26 94 34 M 114 34 Q 120 26 126 34 M 146 34 Q 152 26 158 34" fill="none" stroke="#5578F5" strokeOpacity="0.65" strokeWidth="1.3" strokeLinecap="round" />
          </g>
        )}

        {motif === 'quantum' && (
          <g>
            <circle cx="120" cy="75" r="48" fill="none" stroke="#171C24" strokeOpacity="0.22" strokeWidth="1.1" />
            <circle cx="120" cy="75" r="32" fill="none" stroke="#5578F5" strokeOpacity="0.55" strokeWidth="1.3" strokeDasharray="4 3" />
            <circle cx="120" cy="75" r="18" fill="none" stroke="#171C24" strokeOpacity="0.4" strokeWidth="1.2" />
            <circle cx="120" cy="75" r="6" fill="#171C24" />
            <circle cx="152" cy="75" r="4" fill="#5578F5" />
            <circle cx="96" cy="34" r="3.5" fill="#5578F5" fillOpacity="0.75" />
          </g>
        )}

        {motif === 'orbit' && (
          <g>
            <g transform="rotate(-18 120 75)">
              <ellipse cx="120" cy="75" rx="76" ry="30" fill="none" stroke="#5578F5" strokeOpacity="0.65" strokeWidth="1.5" />
              <ellipse cx="120" cy="75" rx="46" ry="18" fill="none" stroke="#171C24" strokeOpacity="0.26" strokeWidth="1.1" />
              <circle cx="184" cy="60" r="5" fill="#5578F5" />
            </g>
            <circle cx="120" cy="75" r="11" fill="#171C24" />
            <circle cx="120" cy="75" r="16" fill="none" stroke="#5578F5" strokeOpacity="0.3" strokeWidth="1" />
          </g>
        )}
      </svg>
    </div>
  );
};
