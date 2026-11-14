import { AppView } from '../types';

export type RagaSlug =
  | 'bhoopali'
  | 'durga'
  | 'yaman'
  | 'hamsadhwani'
  | 'bilawal'
  | 'desh'
  | 'kafi'
  | 'bageshree'
  | 'bhimpalasi'
  | 'brindavani-sarang'
  | 'khamaj'
  | 'bhairav'
  | 'bihag'
  | 'malkauns'
  | 'marwa'
  | 'jog'
  | 'todi'
  | 'multani'
  | 'pahadi'
  | 'miyan-ki-malhar'
  | 'tilang'
  | 'shivranjani'
  | 'jaunpuri';

export type EditorialLayoutVariant =
  | 'treatise-monograph'
  | 'concert-chronicle'
  | 'comparative-symposium'
  | 'sadhana-essays';

export interface SamprakriticComparison {
  alliedRagaName: string;
  alliedRagaView?: AppView;
  sharedElements: string;
  criticalDistinction: string;
  bansuriNuance: string;
}

export interface NotableWorkItem {
  category: 'Classical Bandish / Dhrupad' | 'Concert Bansuri / Instrumental' | 'Film & Light-Classical Reference';
  title: string;
  contextAndAnalysis: string;
}

export interface RagaEditorialEntry {
  slug: RagaSlug;
  ragaName: string;
  layoutVariant: EditorialLayoutVariant;
  accentTheme: 'amber' | 'emerald' | 'indigo' | 'rose' | 'stone' | 'sky';
  originsHeading: string;
  originsSubtitle: string;
  originsParagraphs: string[];
  treatiseCallout: {
    title: string;
    citation: string;
    insight: string;
  };
  rasaHeading: string;
  rasaSubtitle: string;
  rasaParagraphs: string[];
  acousticTakeaway: string;
  samprakriticHeading: string;
  samprakriticSubtitle: string;
  samprakriticIntroParagraphs: string[];
  samprakriticComparisons: SamprakriticComparison[];
  repertoireHeading: string;
  repertoireSubtitle: string;
  repertoireParagraphs: string[];
  notableWorks: NotableWorkItem[];
  concertProgressionHeading: string;
  concertProgressionParagraphs: string[];
}
