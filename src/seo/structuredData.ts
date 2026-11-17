import type { SubjectDefinition } from '../types/subject';

export function buildHomeJsonLd(origin: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'LABVERSE',
      url: origin,
      description:
        'An interactive science-learning platform guiding learners through Physics, Chemistry, Biology, Mathematics, Earth & Space, and Engineering.',
      slogan: 'Explore. Experiment. Understand.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'LABVERSE',
      url: origin,
      description:
        'Interactive visual discovery platform across six foundational scientific domains.',
    },
  ];
}

export function buildSubjectJsonLd(origin: string, subject: SubjectDefinition) {
  const subjectUrl = `${origin}${subject.route}`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${origin}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Subjects',
          item: `${origin}/#subjects-section`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: subject.shortTitle,
          item: subjectUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: `${subject.shortTitle} Subject Journey`,
      description: subject.extendedIntro,
      url: subjectUrl,
      educationalUse: 'Interactive Science Exploration',
      learningResourceType: 'Curriculum Overview',
      isAccessibleForFree: true,
      about: subject.topics.map((topic) => ({
        '@type': 'Thing',
        name: topic,
      })),
      provider: {
        '@type': 'EducationalOrganization',
        name: 'LABVERSE',
        url: origin,
      },
    },
  ];
}

export function buildTopicJsonLd(
  origin: string,
  subject: SubjectDefinition,
  topicTitle: string,
  topicRoute: string,
  topicDescription: string,
  keyConcepts: string[]
) {
  const topicUrl = `${origin}${topicRoute}`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${origin}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Subjects',
          item: `${origin}/#subjects-section`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: subject.shortTitle,
          item: `${origin}${subject.route}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: topicTitle,
          item: topicUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: `${topicTitle} — ${subject.shortTitle} | LABVERSE`,
      description: topicDescription,
      url: topicUrl,
      educationalUse: 'Interactive Science Exploration',
      learningResourceType: 'Topic Module',
      isAccessibleForFree: true,
      about: keyConcepts.map((concept) => ({
        '@type': 'Thing',
        name: concept,
      })),
      provider: {
        '@type': 'EducationalOrganization',
        name: 'LABVERSE',
        url: origin,
      },
    },
  ];
}
