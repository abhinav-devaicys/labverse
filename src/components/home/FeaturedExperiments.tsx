import React from 'react';
import { Layers } from 'lucide-react';
import { getFeaturedSimulations } from '../../registry/simulationRegistry';
import { useLabStore } from '../../stores/useLabStore';
import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import { ExperimentCard } from './ExperimentCard';

export const FeaturedExperiments: React.FC = () => {
  const featured = getFeaturedSimulations();
  const navigateTo = useLabStore((s) => s.navigateTo);

  return (
    <section
      id="featured-experiments-section"
      className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#0B0F17]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Interactive Experiment Previews"
          title="Featured Experiments"
          subtitle="Explore curated physics, circuits, and chemistry previews staged in our modular simulation registry. Full real-time solvers are scheduled per module."
          rightSlot={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigateTo('explore')}
            >
              <Layers className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Browse Full Catalog</span>
            </Button>
          }
        />

        {/* 6-column responsive grid: first 3 cards span 2 cols each (3-up), next 2 cards span 3 cols each (2-up) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
          {featured.map((sim, idx) => (
            <ExperimentCard
              key={sim.id}
              simulation={sim}
              wide={idx >= 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
