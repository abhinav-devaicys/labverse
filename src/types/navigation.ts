import { getPhysicsTopicBySlug, type PhysicsTopicSlug } from '../data/physicsTopics';
import type { SubjectSlug } from './subject';

export type AppRoute =
  | 'home'
  | 'explore'
  | 'subjects'
  | 'how-it-works'
  | 'about'
  | 'my-lab'
  | 'simulation';

export type AppView =
  | { type: 'home' }
  | { type: 'subject'; slug: SubjectSlug; highlightModuleCode?: string }
  | { type: 'subject-topic'; subjectSlug: 'physics'; topicSlug: PhysicsTopicSlug }
  | {
      type: 'experiment';
      subjectSlug: 'physics';
      topicSlug: 'mechanics';
      experimentSlug: 'simple-pendulum' | 'newtons-laws';
    }
  | { type: 'my-learning' }
  | { type: 'about' }
  | { type: 'not-found'; path: string };

const VALID_SLUGS: SubjectSlug[] = [
  'physics',
  'chemistry',
  'biology',
  'mathematics',
  'earth-space',
  'engineering',
];

export function parseRouteFromPath(pathname: string, hash = ''): AppView {
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (clean === '/' || clean === '') {
    return { type: 'home' };
  }
  if (clean === '/my-learning') {
    return { type: 'my-learning' };
  }
  if (clean === '/about') {
    return { type: 'about' };
  }
  if (
    clean === '/subjects/physics/mechanics/simple-pendulum' ||
    clean === '/simulations/simple-pendulum'
  ) {
    return {
      type: 'experiment',
      subjectSlug: 'physics',
      topicSlug: 'mechanics',
      experimentSlug: 'simple-pendulum',
    };
  }
  if (
    clean === '/subjects/physics/mechanics/newtons-laws' ||
    clean === '/simulations/newtons-laws'
  ) {
    return {
      type: 'experiment',
      subjectSlug: 'physics',
      topicSlug: 'mechanics',
      experimentSlug: 'newtons-laws',
    };
  }
  if (clean.startsWith('/subjects/physics/')) {
    const topicSlug = clean.replace('/subjects/physics/', '');
    const matchedTopic = getPhysicsTopicBySlug(topicSlug);
    if (matchedTopic) {
      return {
        type: 'subject-topic',
        subjectSlug: 'physics',
        topicSlug: matchedTopic.slug,
      };
    }
    return { type: 'not-found', path: pathname };
  }
  if (clean.startsWith('/subjects/')) {
    const slug = clean.replace('/subjects/', '') as SubjectSlug;
    if (VALID_SLUGS.includes(slug)) {
      const highlightModuleCode = hash ? hash.replace('#', '') : undefined;
      return { type: 'subject', slug, highlightModuleCode };
    }
  }
  return { type: 'not-found', path: pathname };
}

export function getPathForView(view: AppView): string {
  switch (view.type) {
    case 'home':
      return '/';
    case 'subject':
      return `/subjects/${view.slug}${view.highlightModuleCode ? `#${view.highlightModuleCode}` : ''}`;
    case 'subject-topic':
      return `/subjects/${view.subjectSlug}/${view.topicSlug}`;
    case 'experiment':
      return `/subjects/${view.subjectSlug}/${view.topicSlug}/${view.experimentSlug}`;
    case 'my-learning':
      return '/my-learning';
    case 'about':
      return '/about';
    case 'not-found':
      return view.path;
  }
}
