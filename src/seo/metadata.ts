import heroArtwork from '../assets/images/hero_science_sculpture_1794937014199.jpg';
import type { SubjectDefinition } from '../types/subject';

export interface PageSeoMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  robots: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
  ogType: 'website' | 'article';
  ogImage?: string;
}

export function getHomeMetadata(): PageSeoMetadata {
  return {
    title: 'LABVERSE — Explore Scientific Subjects Visually',
    description:
      'Discover Physics, Chemistry, Biology, Mathematics, Earth & Space, and Engineering through interactive visual science journeys on LABVERSE.',
    canonicalPath: '/',
    robots: 'index, follow',
    ogType: 'website',
    ogImage: heroArtwork,
  };
}

export function getSubjectMetadata(subject: SubjectDefinition): PageSeoMetadata {
  if (subject.slug === 'physics') {
    return {
      title: 'Physics — Understand the Universe | LABVERSE',
      description:
        'Explore motion, electricity, magnetism, waves, optics, thermodynamics, modern physics, and space physics through interactive discovery on LABVERSE.',
      canonicalPath: subject.route,
      robots: 'index, follow',
      ogType: 'article',
      ogImage: subject.artworkUrl,
    };
  }

  const isComplete = subject.journeyModules.length > 0 && subject.topics.length > 0;
  return {
    title: `${subject.shortTitle} — Interactive Science Journey | LABVERSE`,
    description: `${subject.description} Explore ${subject.topics.slice(0, 4).join(', ')} and core ${subject.shortTitle.toLowerCase()} principles on LABVERSE.`,
    canonicalPath: subject.route,
    robots: isComplete ? 'index, follow' : 'noindex, follow',
    ogType: 'article',
    ogImage: subject.artworkUrl,
  };
}

export function createTopicMetadata(
  subject: SubjectDefinition,
  topicTitle: string,
  topicSummary: string
): PageSeoMetadata {
  const slugified = topicTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return {
    title: `${topicTitle} · ${subject.shortTitle} | LABVERSE`,
    description: topicSummary,
    canonicalPath: `${subject.route}/${slugified}`,
    robots: 'index, follow',
    ogType: 'article',
    ogImage: subject.artworkUrl,
  };
}

export function createExperimentMetadata(
  subject: SubjectDefinition,
  experimentTitle: string,
  experimentSummary: string,
  options?: { topicSlug?: string; experimentSlug?: string; isComplete?: boolean }
): PageSeoMetadata {
  const slugified =
    options?.experimentSlug ??
    experimentTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  const base = options?.topicSlug
    ? `${subject.route}/${options.topicSlug}`
    : `${subject.route}/experiments`;
  return {
    title: `${experimentTitle} Simulation · ${subject.shortTitle} | LABVERSE`,
    description: experimentSummary,
    canonicalPath: `${base}/${slugified}`,
    robots: options?.isComplete ? 'index, follow' : 'noindex, follow',
    ogType: 'article',
    ogImage: subject.artworkUrl,
  };
}

export function getAboutMetadata(): PageSeoMetadata {
  return {
    title: 'About LABVERSE — Visual & Experimental Science Learning',
    description:
      'Learn how LABVERSE bridges museum-grade visual intuition and quantitative inquiry across six foundational scientific disciplines.',
    canonicalPath: '/about',
    robots: 'index, follow',
    ogType: 'website',
  };
}

export function getMyLearningMetadata(): PageSeoMetadata {
  return {
    title: 'My Learning — Saved Subjects & Notes | LABVERSE',
    description:
      'Access your saved scientific subjects, recently explored fields, and personal study notes in LABVERSE.',
    canonicalPath: '/my-learning',
    robots: 'noindex, follow',
    ogType: 'website',
  };
}

export function getNotFoundMetadata(path: string): PageSeoMetadata {
  return {
    title: 'Page Not Found (404) | LABVERSE',
    description:
      'The requested scientific page could not be found. Browse our six core scientific subjects on LABVERSE.',
    canonicalPath: path || '/404',
    robots: 'noindex, nofollow',
    ogType: 'website',
  };
}
