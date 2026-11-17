export type SubjectSlug =
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'mathematics'
  | 'earth-space'
  | 'engineering';

export interface SubjectJourneyModule {
  code: string;
  title: string;
  focus: string;
  stageSummary: string;
}

export interface SubjectDefinition {
  number: string;
  slug: SubjectSlug;
  route: `/subjects/${SubjectSlug}`;
  name: string;
  shortTitle: string;
  description: string;
  extendedIntro: string;
  topics: string[];
  artworkUrl: string;
  artworkAlt: string;
  accentHex: string;
  cardSurfaceClass: string;
  layoutSpan: 'wide' | 'standard';
  guidingPrinciple: string;
  journeyModules: SubjectJourneyModule[];
}
