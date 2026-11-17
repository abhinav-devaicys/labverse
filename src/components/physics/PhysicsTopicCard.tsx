import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { PhysicsTopicDefinition } from '../../data/physicsTopics';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';
import { useLearningStore } from '../../stores/useLearningStore';
import { PhysicsTopicVisual } from './PhysicsTopicVisual';

interface PhysicsTopicCardProps {
  topic: PhysicsTopicDefinition;
  index: number;
}

export const PhysicsTopicCard: React.FC<PhysicsTopicCardProps> = ({ topic, index }) => {
  const navigate = useLearningStore((s) => s.navigate);
  const prefersReduced = useReducedMotionPref();

  return (
    <motion.a
      href={topic.route}
      onClick={(e) => {
        e.preventDefault();
        navigate({
          type: 'subject-topic',
          subjectSlug: 'physics',
          topicSlug: topic.slug,
        });
      }}
      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.04, 0.24),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group h-full flex flex-col justify-between rounded-2xl bg-[#FAF9F5] border border-[#171C24]/12 hover:border-[#5578F5]/60 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-26px_rgba(23,28,36,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5578F5]"
    >
      <div className="space-y-4">
        <PhysicsTopicVisual motif={topic.visualMotif} />

        <div className="space-y-2 pt-1">
          <p className="text-xs font-mono text-[#5578F5]">
            <span>{topic.number}</span>
            <span className="mx-1.5 text-[#171C24]/30" aria-hidden="true">
              ·
            </span>
            <span className="font-sans text-[#555D6B]">{topic.domainLabel}</span>
          </p>

          <h3 className="font-display text-xl font-semibold text-[#171C24] group-hover:text-[#5578F5] transition-colors">
            {topic.title}
          </h3>

          <p className="text-sm text-[#4B5360] leading-relaxed">
            {topic.description}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#171C24]/10 flex items-center justify-between text-sm font-medium text-[#171C24] group-hover:text-[#5578F5] transition-colors">
        <span>Explore {topic.title}</span>
        <ArrowRight
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </motion.a>
  );
};
