import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface NewtonsLearningPanelProps {
  defaultOpen?: boolean;
}

export const NewtonsLearningPanel: React.FC<NewtonsLearningPanelProps> = React.memo(
  ({ defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
      <section
        aria-label="Newton's Laws Theory, Instructions, and Assumptions"
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
              Objectives, Laws of Motion, Formulas &amp; Assumptions
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
          <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-[#24324B] space-y-6 text-sm text-[#CBD5E1]">
            {/* Experiment Objectives & Core Formulas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-6 rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
                <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                  Experiment Objectives
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#94A3B8]">
                  <li>Verify inertia: constant velocity persists whenever F_net = 0 N.</li>
                  <li>Measure how acceleration scales linearly with F_net and inversely with mass m.</li>
                  <li>Observe static friction holding an object stationary until |F_app| &gt; μN.</li>
                  <li>Confirm equal, opposite interaction forces between two unequal masses.</li>
                </ul>
              </div>

              <div className="lg:col-span-6 rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
                <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                  Mathematical Formulas
                </h3>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs text-[#E2E8F0]">
                  <p>F_net = m · a</p>
                  <p>N = m · g</p>
                  <p>F_f,max = μ · N</p>
                  <p>F_AB = -F_BA</p>
                  <p>p = m · v</p>
                  <p>Ek = ½ · m · v²</p>
                </div>
                <p className="text-xs text-[#94A3B8] pt-1">
                  All values are updated using fixed 240 Hz integration with static/kinetic
                  friction threshold clamping.
                </p>
              </div>
            </div>

            {/* All Three Laws */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
                <p className="font-mono text-xs text-[#5578F5]">Mode A · First Law</p>
                <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                  Law of Inertia
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  An object remains at rest or in uniform straight-line motion unless acted
                  upon by a nonzero net external force. Removing push on a frictionless
                  track preserves velocity indefinitely.
                </p>
              </div>

              <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
                <p className="font-mono text-xs text-[#5578F5]">Mode B · Second Law</p>
                <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                  Force &amp; Acceleration
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  Net force equals mass times acceleration (a = F_net / m). Doubling net
                  force doubles acceleration; doubling mass halves acceleration for the
                  same applied force.
                </p>
              </div>

              <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
                <p className="font-mono text-xs text-[#5578F5]">Mode C · Third Law</p>
                <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                  Action &amp; Reaction
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  Whenever Object A pushes Object B, Object B pushes Object A with equal
                  magnitude in the opposite direction. Smaller mass experiences greater
                  acceleration (a₁/a₂ = m₂/m₁).
                </p>
              </div>
            </div>

            {/* Instructions, Real-World Examples & Assumptions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
                <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                  Step-by-Step Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-[#94A3B8]">
                  <li>In 1st Law, start with +50 N push, then click Remove Force (0 N).</li>
                  <li>Increase μ to 0.25 and observe friction slowing the block to v = 0.</li>
                  <li>Switch to 2nd Law and log trials at 10 kg, 20 kg, and 40 kg.</li>
                  <li>Switch to 3rd Law with unequal masses and verify p₁ + p₂ = 0.</li>
                </ol>
              </div>

              <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
                <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                  Real-World Examples
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#94A3B8]">
                  <li>Seatbelts restrain passengers during sudden braking (1st Law).</li>
                  <li>Heavy cargo trucks require stronger braking forces (2nd Law).</li>
                  <li>Rocket thrusters push exhaust backward to accelerate forward (3rd Law).</li>
                  <li>Pucks glide across air-hockey tables when friction approaches zero.</li>
                </ul>
              </div>

              <div className="rounded-xl bg-[#101827] border border-[#24324B] p-5 space-y-2">
                <h3 className="font-display text-base font-semibold text-[#F5F4EF]">
                  Assumptions &amp; Limitations
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#94A3B8]">
                  <li>Blocks act as rigid bodies without tipping or rotational spin.</li>
                  <li>Track is perfectly level and horizontal (no incline slope).</li>
                  <li>Aerodynamic air drag is neglected; only dry Coulomb friction acts.</li>
                  <li>Static limit equals kinetic coefficient μN for transparent calculation.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
);

NewtonsLearningPanel.displayName = 'NewtonsLearningPanel';
