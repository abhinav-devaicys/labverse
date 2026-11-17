import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
interface PendulumLearningPanelProps {
  length: number;
  gravity: number;
  initialAngleDeg: number;
  theoreticalPeriod: number;
  measuredPeriod: number | null;
  periodDeviationPercent: number | null;
  defaultOpen?: boolean;
}

export const PendulumLearningPanel: React.FC<PendulumLearningPanelProps> = React.memo(({
  length,
  gravity,
  initialAngleDeg,
  theoreticalPeriod,
  measuredPeriod,
  periodDeviationPercent,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      aria-label="Experiment Theory and Learning Guide"
      className="bg-[#162033] border border-[#24324B] rounded-xl overflow-hidden"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#1B273E] transition-colors cursor-pointer"
      >
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5578F5]">
            Learning Panel
          </p>
          <h2 className="font-display text-lg sm:text-xl font-semibold text-[#F5F4EF] mt-0.5">
            Theory, Procedure &amp; Small-Angle Period Comparison
          </h2>
        </div>
        <span className="p-1.5 rounded-lg bg-[#101827] border border-[#24324B] text-[#CBD5E1]">
          {isOpen ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </span>
      </button>

      {isOpen && (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#24324B] space-y-6 text-sm text-[#CBD5E1]">
          {/* Theoretical vs Measured Period Spotlight */}
          <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-5 space-y-1.5">
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#5578F5]">
                Small-Angle Period Formula
              </p>
              <p className="font-mono text-2xl font-semibold text-[#F5F4EF]">
                T = 2π√(L / g)
              </p>
              <p className="text-xs text-[#94A3B8]">
                With L = {length.toFixed(2)} m and g = {gravity.toFixed(2)} m/s²,
                T_theory ={' '}
                <span className="text-[#F5F4EF] font-mono">
                  {theoreticalPeriod.toFixed(4)} s
                </span>
              </p>
            </div>

            <div className="lg:col-span-7 space-y-2 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              <p>
                <span className="font-semibold text-[#F5F4EF]">
                  Approximation at Small Angles:
                </span>{' '}
                Because the exact equation is θ&apos;&apos; = -(g/L) sin(θ), replacing
                sin(θ) with θ (in radians) yields the simple formula T = 2π√(L/g). At
                small angles (&lt;15°), the error is under 0.5%. At your current release
                angle ({initialAngleDeg}°), the true nonlinear period is slightly longer
                {measuredPeriod !== null
                  ? `—measured at ${measuredPeriod.toFixed(4)} s (${
                      periodDeviationPercent !== null
                        ? `+${Math.abs(periodDeviationPercent).toFixed(2)}%`
                        : '0%'
                    } difference).`
                  : '—run the simulation through two crossings to compare.'}
              </p>
            </div>
          </div>

          {/* Structured 6-Part Curriculum Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
              <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                1. Experiment Aim
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Investigate how pendulum length (L), gravitational acceleration (g),
                release angle (θ₀), and bob mass (m) govern oscillation period, angular
                motion, and mechanical energy conservation.
              </p>
            </div>

            <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
              <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                2. Scientific Theory
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Gravity applies a restoring torque proportional to -m·g·L·sin(θ). In the
                absence of friction, total energy E = Ek + Ep remains constant as energy
                continuously trades between potential height and kinetic speed.
              </p>
            </div>

            <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
              <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                3. Governing Equations
              </h3>
              <ul className="space-y-1 text-xs font-mono text-[#CBD5E1]">
                <li>θ&apos;&apos; = -(g / L) · sin(θ)</li>
                <li>Ep = m · g · L · (1 - cos θ)</li>
                <li>Ek = ½ · m · (L · ω)²</li>
                <li>T ≈ 2π √(L / g) (small θ)</li>
              </ul>
            </div>

            <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
              <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                4. Step-by-Step Procedure
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-[#94A3B8]">
                <li>Set initial angle to 15° and length to 1.0 m, then press Start.</li>
                <li>Wait for two equilibrium passes to record Measured Period.</li>
                <li>Record observations across 4 different lengths (0.5–2.5 m).</li>
                <li>Vary bob mass (0.5 kg vs 4.0 kg) and verify T stays unchanged.</li>
              </ol>
            </div>

            <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
              <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                5. Factors Affecting Period
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Longer cords increase T (T ∝ √L), while stronger gravity speeds up the
                swing (T ∝ 1/√g). Mass cancels out of the restoring acceleration equation,
                so heavy and light bobs oscillate identically.
              </p>
            </div>

            <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
              <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                6. Practical Applications &amp; Observations
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Used in precision mechanical clocks, seismic motion sensors, musical
                metronomes, and Foucault pendulums proving Earth&apos;s rotation. Key
                observation: speed peaks at θ = 0° where Ek is maximum and Ep = 0.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

PendulumLearningPanel.displayName = 'PendulumLearningPanel';
