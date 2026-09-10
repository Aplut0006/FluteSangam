import { AppView } from '../types';
import { GETTING_STARTED_FAQS } from './gettingStartedFaqData';
import { LEARNING_THE_FLUTE_FAQS } from './learningTheFluteFaqData';
import { DAILY_PRACTICE_FAQS } from './dailyPracticeFaqData';
import { PLAYING_TECHNIQUES_FAQS } from './playingTechniquesFaqData';
import { SCALES_AND_ALANKARS_FAQS } from './scalesAndAlankarsFaqData';
import { RAAGAS_FAQS } from './raagasFaqData';
import { MUSIC_THEORY_FAQS } from './musicTheoryFaqData';
import { FLUTE_CARE_FAQS } from './fluteCareFaqData';
import { HEALTH_AND_BREATHING_FAQS } from './healthBreathingFaqData';
import { ADVANCED_TECHNIQUES_FAQS } from './advancedTechniquesFaqData';
import { FLUTE_ACCESSORIES_FAQS } from './fluteAccessoriesFaqData';
import { FLUTE_TYPES_FAQS } from './fluteTypesFaqData';
import { TUNING_AND_PITCH_FAQS } from './tuningAndPitchFaqData';
import { CHILDREN_AND_BEGINNERS_FAQS } from './childrenAndBeginnersFaqData';
import { ADULT_LEARNERS_FAQS } from './adultLearnersFaqData';

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  relatedLink?: {
    text: string;
    view: AppView;
  };
  tags?: string[];
}

export const CATEGORY_SLUGS: Record<string, string> = {
  'All Categories': '',
  'Getting Started': 'getting-started',
  'Learning the Flute': 'learning-the-flute',
  'Adult Learners': 'adult-learners',
  'Choosing the Right Flute': 'choosing-the-right-flute',
  'Choosing a Flute': 'choosing-the-right-flute',
  'Playing Techniques': 'playing-techniques',
  'Advanced Techniques': 'advanced-techniques',
  'Daily Practice': 'daily-practice',
  'Scales & Alankars': 'scales-and-alankars',
  'Raagas': 'raagas',
  'Raagas & Sargam': 'raagas',
  'Flute Care & Maintenance': 'flute-care-and-maintenance',
  'Health & Breathing': 'health-and-breathing',
  'Children & Beginners': 'children-and-beginners',
  'Music Theory': 'music-theory',
  'Music Theory & Notation': 'music-theory',
  'Music Theory & Tuning': 'music-theory',
  'Tuning & Pitch Calibration': 'tuning-and-pitch',
  'Flute Tuning & Pitch': 'tuning-and-pitch',
  'Flute Accessories': 'flute-accessories',
  'Flute Accessories & Gear': 'flute-accessories',
  'Flute Types': 'flute-types',
  'Flute Types & Scales': 'flute-types',
  'FluteSangam Platform': 'platform',
};

export const FAQ_DATA: FaqItem[] = [
  ...GETTING_STARTED_FAQS,
  ...LEARNING_THE_FLUTE_FAQS,
  ...ADULT_LEARNERS_FAQS,
  ...PLAYING_TECHNIQUES_FAQS,
  ...ADVANCED_TECHNIQUES_FAQS,
  ...DAILY_PRACTICE_FAQS,
  ...SCALES_AND_ALANKARS_FAQS,
  ...RAAGAS_FAQS,
  ...FLUTE_CARE_FAQS,
  ...HEALTH_AND_BREATHING_FAQS,
  ...CHILDREN_AND_BEGINNERS_FAQS,
  ...MUSIC_THEORY_FAQS,
  ...TUNING_AND_PITCH_FAQS,
  ...FLUTE_ACCESSORIES_FAQS,
  ...FLUTE_TYPES_FAQS,
  {
    id: 'platform-what-is',
    category: 'FluteSangam Platform',
    question: 'What is FluteSangam, and is it free to use?',
    answer: `FluteSangam is an open online learning hub and resource platform created specifically for Indian bamboo flute (Bansuri) and flute learners. 

Yes, FluteSangam is free to explore and use. Our goal is to support bansuri learning by providing interactive practice tools (such as the online tuner and Alankar generator), scale selection guides, classical Hindustani raga breakdowns, Sargam notations, and educational articles.`,
    relatedLink: { text: 'About FluteSangam & Founder Story', view: 'about_us' },
    tags: ['flutesangam', 'free platform', 'community', 'learning']
  },
  {
    id: 'platform-how-to-join',
    category: 'FluteSangam Platform',
    question: 'How do I join the community, post recitals, and save my preferences?',
    answer: `Joining is free and straightforward. You can freely explore all learning guides, articles, and interactive tools as a guest. 

If you wish to participate in the community, you can sign in with Google or create an account with your email. Once logged in, you can post practice updates, share audio recitals, ask questions, save preferences, and customize your flutist profile.`,
    relatedLink: { text: 'Explore Community Discussions', view: 'community' },
    tags: ['sign up', 'join', 'community', 'profile']
  },
  {
    id: 'platform-request-custom-notation',
    category: 'FluteSangam Platform',
    question: 'How do I request Sargam notation for a song?',
    answer: `You can browse existing song sargams or submit requests in the Notations section:
1. Navigate to the "Song Notations" section.
2. Click the "Request Song Notation" button.
3. Submit the song title, genre/album, and preferred flute scale.
We review requests and format melodies into clear Bhatkhande Sargam notation sheets.`,
    relatedLink: { text: 'Browse & Request Song Notations', view: 'notation_requests' },
    tags: ['request song notation', 'bollywood sargam', 'devotional songs', 'notations']
  },
  {
    id: 'platform-practice-tools-help',
    category: 'FluteSangam Platform',
    question: 'How do the FluteSangam practice tools help with daily flute practice?',
    answer: `FluteSangam provides several interactive tools to support daily practice:
• Interactive Tuner & Tanpura: Check note frequencies in cents and practice pitch stability over a steady drone.
• Alankar Generator: Generate structured swara permutation drills at customizable tempos.
• Scale Selector: Compare flute keys, hand stretch requirements, and physical dimensions before purchasing an instrument.`,
    relatedLink: { text: 'Explore Online Flute Tuner', view: 'learn_tuner' },
    tags: ['practice tools', 'tuner', 'alankar generator', 'tanpura', 'flutesangam']
  }
];
