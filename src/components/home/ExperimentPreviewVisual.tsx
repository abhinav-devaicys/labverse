import React from 'react';

interface ExperimentPreviewVisualProps {
  simulationId: string;
}

export const ExperimentPreviewVisual: React.FC<ExperimentPreviewVisualProps> = ({
  simulationId,
}) => {
  switch (simulationId) {
    case 'pendulum-motion':
      return (
        <div className="relative h-40 rounded-lg bg-[#0A0F1A] border border-slate-800/90 bg-lab-grid-fine overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 280 140" className="w-full h-full" aria-hidden="true">
            {/* Pivot bar */}
            <line x1="90" y1="16" x2="190" y2="16" stroke="#475569" strokeWidth="2" />
            <circle cx="140" cy="16" r="3.5" fill="#94A3B8" />
            {/* Vertical equilibrium dashed line */}
            <line
              x1="140"
              y1="16"
              x2="140"
              y2="124"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {/* Swing arc */}
            <path
              d="M 88 92 A 92 92 0 0 0 192 92"
              fill="none"
              stroke="#5578F5"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Pendulum rod */}
            <line x1="140" y1="16" x2="94" y2="94" stroke="#E2E8F0" strokeWidth="1.75" />
            {/* Bob */}
            <circle cx="94" cy="94" r="10" fill="#5578F5" stroke="#93C5FD" strokeWidth="1.5" />
            {/* Labels */}
            <text x="92" y="58" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">
              L = 1.20 m
            </text>
            <text x="150" y="96" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">
              g = 9.81 m/s²
            </text>
            <rect x="206" y="14" width="60" height="20" rx="4" fill="#131B29" stroke="#334155" />
            <text x="214" y="27" fill="#34D399" fontSize="9" fontFamily="JetBrains Mono">
              T = 2.19 s
            </text>
          </svg>
        </div>
      );

    case 'electric-circuit-builder':
      return (
        <div className="relative h-40 rounded-lg bg-[#0A0F1A] border border-slate-800/90 bg-lab-grid-fine overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 280 140" className="w-full h-full" aria-hidden="true">
            {/* Closed circuit loop */}
            <rect
              x="62"
              y="32"
              width="156"
              height="78"
              rx="4"
              fill="none"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Resistor zigzag on top */}
            <rect x="116" y="22" width="48" height="20" fill="#0A0F1A" />
            <polyline
              points="116,32 122,25 130,39 138,25 146,39 154,25 160,32"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.75"
            />
            {/* Battery left branch */}
            <rect x="52" y="58" width="20" height="26" fill="#0A0F1A" />
            <line x1="54" y1="66" x2="70" y2="66" stroke="#34D399" strokeWidth="2.5" />
            <line x1="58" y1="74" x2="66" y2="74" stroke="#34D399" strokeWidth="1.5" />
            {/* Ammeter node right branch */}
            <circle cx="218" cy="71" r="10" fill="#131B29" stroke="#5578F5" strokeWidth="1.5" />
            <text x="214.5" y="74.5" fill="#93C5FD" fontSize="9" fontFamily="JetBrains Mono">
              A
            </text>
            {/* Labels */}
            <text x="118" y="18" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">
              R = 100 Ω
            </text>
            <text x="78" y="74" fill="#E2E8F0" fontSize="9" fontFamily="JetBrains Mono">
              V = 12.0 V
            </text>
            <text x="155" y="74" fill="#34D399" fontSize="9" fontFamily="JetBrains Mono">
              I = 0.12 A
            </text>
          </svg>
        </div>
      );

    case 'build-an-atom':
      return (
        <div className="relative h-40 rounded-lg bg-[#0A0F1A] border border-slate-800/90 bg-lab-grid-fine overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 280 140" className="w-full h-full" aria-hidden="true">
            {/* Orbital shells */}
            <circle cx="140" cy="70" r="28" fill="none" stroke="#334155" strokeDasharray="3 3" strokeWidth="1.2" />
            <circle cx="140" cy="70" r="50" fill="none" stroke="#5578F5" strokeOpacity="0.45" strokeWidth="1.2" />
            {/* Nucleus */}
            <circle cx="136" cy="67" r="4" fill="#5578F5" />
            <circle cx="144" cy="68" r="4" fill="#F59E0B" />
            <circle cx="140" cy="74" r="4" fill="#5578F5" />
            <circle cx="137" cy="73" r="3.5" fill="#22D3EE" />
            <circle cx="143" cy="64" r="3.5" fill="#22D3EE" />
            {/* Electrons on n=1 & n=2 */}
            <circle cx="112" cy="70" r="3.5" fill="#34D399" />
            <circle cx="168" cy="70" r="3.5" fill="#34D399" />
            <circle cx="140" cy="20" r="3.5" fill="#34D399" />
            <circle cx="140" cy="120" r="3.5" fill="#34D399" />
            <circle cx="96" cy="46" r="3.5" fill="#34D399" />
            <circle cx="184" cy="94" r="3.5" fill="#34D399" />
            {/* Labels */}
            <text x="14" y="124" fill="#CBD5E1" fontSize="9.5" fontFamily="JetBrains Mono">
              ¹²C Carbon (Neutral)
            </text>
            <text x="188" y="24" fill="#34D399" fontSize="9" fontFamily="JetBrains Mono">
              Stable · 0 Charge
            </text>
          </svg>
        </div>
      );

    case 'newtons-laws':
      return (
        <div className="relative h-40 rounded-lg bg-[#0A0F1A] border border-slate-800/90 bg-lab-grid-fine overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 360 140" className="w-full h-full" aria-hidden="true">
            {/* Ground track */}
            <line x1="28" y1="104" x2="332" y2="104" stroke="#334155" strokeWidth="2" />
            {/* Mass block */}
            <rect
              x="148"
              y="62"
              width="64"
              height="42"
              rx="4"
              fill="#1E293B"
              stroke="#5578F5"
              strokeWidth="1.75"
            />
            <text x="169" y="87" fill="#E2E8F0" fontSize="10" fontFamily="JetBrains Mono">
              8.0 kg
            </text>
            {/* Applied force vector */}
            <line x1="212" y1="83" x2="292" y2="83" stroke="#5578F5" strokeWidth="2.5" />
            <polygon points="292,78 302,83 292,88" fill="#5578F5" />
            <text x="218" y="74" fill="#93C5FD" fontSize="9.5" fontFamily="JetBrains Mono">
              F_applied = 45 N
            </text>
            {/* Friction vector */}
            <line x1="148" y1="98" x2="94" y2="98" stroke="#F59E0B" strokeWidth="2" />
            <polygon points="94,94 85,98 94,102" fill="#F59E0B" />
            <text x="90" y="88" fill="#FBBF24" fontSize="9.5" fontFamily="JetBrains Mono">
              F_f
            </text>
            {/* Resultant acceleration badge */}
            <rect x="242" y="14" width="96" height="22" rx="4" fill="#131B29" stroke="#F59E0B" strokeOpacity="0.5" />
            <text x="252" y="28" fill="#FBBF24" fontSize="9.5" fontFamily="JetBrains Mono">
              a = 2.6 m/s²
            </text>
          </svg>
        </div>
      );

    case 'wave-interference':
    default:
      return (
        <div className="relative h-40 rounded-lg bg-[#0A0F1A] border border-slate-800/90 bg-lab-grid-fine overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 360 140" className="w-full h-full" aria-hidden="true">
            {/* Double slit barrier */}
            <line x1="90" y1="16" x2="90" y2="54" stroke="#475569" strokeWidth="3" />
            <line x1="90" y1="64" x2="90" y2="78" stroke="#475569" strokeWidth="3" />
            <line x1="90" y1="88" x2="90" y2="124" stroke="#475569" strokeWidth="3" />
            {/* Slit wave arcs */}
            {[22, 38, 54, 70, 86, 102].map((r) => (
              <g key={r}>
                <path
                  d={`M 90 ${59 - r} A ${r} ${r} 0 0 1 90 ${59 + r}`}
                  fill="none"
                  stroke="#34D399"
                  strokeOpacity="0.35"
                  strokeWidth="1.2"
                />
                <path
                  d={`M 90 ${83 - r} A ${r} ${r} 0 0 1 90 ${83 + r}`}
                  fill="none"
                  stroke="#5578F5"
                  strokeOpacity="0.35"
                  strokeWidth="1.2"
                />
              </g>
            ))}
            {/* Interference detector strip */}
            <rect x="306" y="18" width="12" height="104" rx="2" fill="#0F172A" stroke="#334155" />
            <rect x="307" y="28" width="10" height="10" fill="#34D399" fillOpacity="0.45" />
            <rect x="307" y="48" width="10" height="12" fill="#34D399" fillOpacity="0.7" />
            <rect x="307" y="65" width="10" height="14" fill="#34D399" fillOpacity="0.95" />
            <rect x="307" y="84" width="10" height="12" fill="#34D399" fillOpacity="0.7" />
            <rect x="307" y="104" width="10" height="10" fill="#34D399" fillOpacity="0.45" />
            {/* Formula */}
            <text x="220" y="24" fill="#94A3B8" fontSize="9.5" fontFamily="JetBrains Mono">
              d sin θ = m λ
            </text>
          </svg>
        </div>
      );
  }
};
