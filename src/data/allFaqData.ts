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
    question: 'What is FluteSangam, and is it completely free to use?',
    answer: `FluteSangam is an open, global digital sanctuary and learning community created dedicatedly for Indian bamboo flute (Bansuri) and Western flute enthusiasts, students, and gurus. 

Yes, FluteSangam is 100% FREE to join and explore! Our mission is to preserve and celebrate flute music by providing high-quality interactive learning tools, scale selection guides, Sargam generator engines, online tuners, song notations, and a supportive community feed where members can post audio/video recitals, ask questions, and connect with fellow flutists worldwide.`,
    relatedLink: { text: 'About FluteSangam & Founder Story', view: 'about_us' },
    tags: ['flutesangam', 'free platform', 'community', 'learning']
  },
  {
    id: 'platform-how-to-join',
    category: 'FluteSangam Platform',
    question: 'How do I join the community, post recitals, and request song notations?',
    answer: `Joining is instant and free! Simply click "Join Community" or "Sign In" at the top, sign in with Google or create an account with your email. 

Once logged in, you can:
• Post practice updates, audio recitals, questions, and maker reviews on the community feed.
• Request custom song Sargam notations on the "Song Notations" tab.
• Send direct messages to fellow flutists and teachers.
• Customize your public flutist profile with your scale preference, location, bio, and social links.`,
    relatedLink: { text: 'Explore Community Feed', view: 'community' },
    tags: ['sign up', 'join', 'notations', 'community']
  },
  {
    id: 'platform-request-custom-notation',
    category: 'FluteSangam Platform',
    question: 'How do I request Sargam notation for my favorite Bollywood or devotional song?',
    answer: `Requesting song notations on FluteSangam is simple:
1. Navigate to the "Song Notations" section in the navigation menu.
2. Click the "Request Song Notation" button.
3. Submit the song title, film/album name, and preferred flute scale.
Our team and community mentors review requests weekly and publish accurate Bhatkhande Sargam sheets with line-by-line finger guides.`,
    relatedLink: { text: 'Browse & Request Song Notations', view: 'notation_requests' },
    tags: ['request song notation', 'bollywood sargam', 'devotional songs', 'notations']
  },
  {
    id: 'platform-ai-assistant-help',
    category: 'FluteSangam Platform',
    question: 'How can the FluteSangam AI Assistant help me with my practice and Raag questions?',
    answer: `The FluteSangam AI Guru Assistant is trained on Indian classical music theory, bansuri acoustics, and practice routines:
• Ask questions about any Raag's Aaroh, Avaroh, Pakad, Vadi, or Samvadi notes.
• Request customized Alankar practice routines based on your current skill level and available daily practice time.
• Get instant troubleshooting advice for airy tone, squeaks, half-hole finger placements, and flute maintenance.`,
    relatedLink: { text: 'Chat with FluteSangam AI Assistant', view: 'chats' },
    tags: ['ai guru', 'ai assistant', 'raag answers', 'practice guidance', 'flutesangam ai']
  }
];
