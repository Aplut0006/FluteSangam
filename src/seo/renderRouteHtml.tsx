import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

// Synchronously import all view components for server rendering
import HomepageOverview from '../components/HomepageOverview';
import LearnDashboard from '../components/LearnDashboard';
import LearnIntroView from '../components/LearnIntroView';
import LearnChooseFluteView from '../components/LearnChooseFluteView';
import LearnTunerView from '../components/LearnTunerView';
import LearnBasicsView from '../components/LearnBasicsView';
import LearnFingeringChartView from '../components/LearnFingeringChartView';
import LearnAlankarasView from '../components/LearnAlankarasView';
import DailyPracticeGuideView from '../components/DailyPracticeGuideView';
import LearnScalesOctavesView from '../components/LearnScalesOctavesView';
import CommonFluteMistakesView from '../components/CommonFluteMistakesView';
import AlankarGeneratorView from '../components/AlankarGeneratorView';
import LearnRaagasView from '../components/LearnRaagasView';

import RagaBhoopaliView from '../components/RagaBhoopaliView';
import RagaDurgaView from '../components/RagaDurgaView';
import RagaYamanView from '../components/RagaYamanView';
import RagaHamsadhwaniView from '../components/RagaHamsadhwaniView';
import RagaBilawalView from '../components/RagaBilawalView';
import RagaDeshView from '../components/RagaDeshView';
import RagaKafiView from '../components/RagaKafiView';
import RagaBageshreeView from '../components/RagaBageshreeView';
import RagaBhimpalasiView from '../components/RagaBhimpalasiView';
import RagaBrindavaniSarangView from '../components/RagaBrindavaniSarangView';
import RagaKhamajView from '../components/RagaKhamajView';
import RagaBhairavView from '../components/RagaBhairavView';
import RagaBihagView from '../components/RagaBihagView';
import RagaMalkaunsView from '../components/RagaMalkaunsView';
import RagaMarwaView from '../components/RagaMarwaView';
import RagaJogView from '../components/RagaJogView';
import RagaTodiView from '../components/RagaTodiView';
import RagaMultaniView from '../components/RagaMultaniView';
import RagaPahadiView from '../components/RagaPahadiView';
import RagaMiyanKiMalharView from '../components/RagaMiyanKiMalharView';
import RagaTilangView from '../components/RagaTilangView';
import RagaShivranjaniView from '../components/RagaShivranjaniView';
import BudgetFlutesView from '../components/BudgetFlutesView';
import FluteNoteKeyConverterView from '../components/FluteNoteKeyConverterView';
import HowToFindSongScaleView from '../components/HowToFindSongScaleView';

import MembersView from '../components/MembersView';
import AboutUsView from '../components/AboutUsView';
import FounderView from '../components/FounderView';
import ContactUsView from '../components/ContactUsView';
import { PrivacyPolicyView } from '../components/PrivacyPolicyView';
import { TermsOfServiceView } from '../components/TermsOfServiceView';
import FluteFaqView from '../components/FluteFaqView';
import { NotationRequestsView } from '../components/NotationRequestsView';
import NotFoundView from '../components/NotFoundView';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FlutePracticeFaqSection from '../components/FlutePracticeFaqSection';
import AboutAuthorSection from '../components/AboutAuthorSection';

import { CATEGORY_SLUGS, FAQ_DATA } from '../data/allFaqData';

export interface RouteMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  jsonLd?: object;
  component: React.ComponentType<any>;
  componentProps?: Record<string, any>;
  is404?: boolean;
  robots?: string;
  redirectUrl?: string;
}

const DOMAIN = 'https://flutesangam.com';

function createWebPageSchema(url: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    'url': url,
    'name': name,
    'description': description,
    'isPartOf': {
      '@type': 'WebSite',
      '@id': `${DOMAIN}/#website`,
      'name': 'FluteSangam',
      'url': DOMAIN
    }
  };
}

export function getRouteMetadata(path: string): RouteMetadata {
  // Normalize path
  let cleanPath = path.trim().split('?')[0].split('#')[0];
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  // Legacy FAQ URL 301 Permanent Redirects
  if (cleanPath === '/faq/music-theory-and-tuning') {
    return {
      title: 'Music Theory & Notation FAQ | FluteSangam',
      description: 'Redirecting to Music Theory & Notation FAQ on FluteSangam.',
      canonicalUrl: `${DOMAIN}/faq/music-theory`,
      redirectUrl: `${DOMAIN}/faq/music-theory`,
      robots: 'noindex, follow',
      component: FluteFaqView
    };
  }
  if (cleanPath === '/faq/flute-tuning-and-pitch') {
    return {
      title: 'Flute Tuning & Pitch Calibration FAQ | FluteSangam',
      description: 'Redirecting to Flute Tuning & Pitch Calibration FAQ on FluteSangam.',
      canonicalUrl: `${DOMAIN}/faq/tuning-and-pitch`,
      redirectUrl: `${DOMAIN}/faq/tuning-and-pitch`,
      robots: 'noindex, follow',
      component: FluteFaqView
    };
  }
  if (cleanPath === '/learn/daily-practice' || cleanPath === '/practice') {
    return {
      title: 'Swar Sadhana & Daily Flute Practice Routine | FluteSangam',
      description: 'Redirecting to Daily Flute Practice Guide on FluteSangam.',
      canonicalUrl: `${DOMAIN}/learn/daily-practice-guide`,
      redirectUrl: `${DOMAIN}/learn/daily-practice-guide`,
      robots: 'noindex, follow',
      component: DailyPracticeGuideView
    };
  }

  // 1. Home / Search
  if (cleanPath === '' || cleanPath === '/' || cleanPath === '/community' || cleanPath === '/search') {
    return {
      title: 'FluteSangam | Learn Flute, Bansuri & Connect with Flutists',
      description: 'Learn flute online with lessons, songs, ragas, techniques, practice guides, and connect with a global community of flutists to learn, share, perform, and grow together.',
      canonicalUrl: `${DOMAIN}/`,
      component: HomepageOverview,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${DOMAIN}/#website`,
        'name': 'FluteSangam',
        'url': DOMAIN,
        'description': 'A comprehensive platform and community for Indian Bamboo Flute (Bansuri) practice, lessons, raga guides, and Sargam notations.',
        'publisher': {
          '@type': 'Organization',
          '@id': `${DOMAIN}/#organization`,
          'name': 'FluteSangam',
          'url': DOMAIN,
          'logo': `${DOMAIN}/flutesangam_without_tagline_compressed.png`
        }
      }
    };
  }

  // 2. Privacy Policy & Aliases
  if (cleanPath === '/privacy-policy' || cleanPath === '/privacy') {
    const title = 'Privacy Policy | FluteSangam';
    const description = 'Privacy Policy for FluteSangam: data protection, security, user account safety, cookies, and privacy compliance for the global Indian flute community.';
    const canonicalUrl = `${DOMAIN}/privacy-policy`;
    return {
      title,
      description,
      canonicalUrl,
      component: PrivacyPolicyView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  // 3. Terms of Service & Aliases
  if (cleanPath === '/terms-of-service' || cleanPath === '/terms') {
    const title = 'Terms of Service | FluteSangam';
    const description = 'Terms of Service for FluteSangam: platform guidelines, community code of conduct, intellectual property, and user account terms.';
    const canonicalUrl = `${DOMAIN}/terms-of-service`;
    return {
      title,
      description,
      canonicalUrl,
      component: TermsOfServiceView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  // 4. Founder Story
  if (cleanPath === '/founder') {
    return {
      title: 'Founder\'s Story - Aplut | FluteSangam',
      description: 'Meet Aplut, founder of FluteSangam. Discover the story behind creating a global, welcoming platform for Indian flute (Bansuri) enthusiasts.',
      canonicalUrl: `${DOMAIN}/founder`,
      component: FounderView,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${DOMAIN}/founder#aplut`,
        'name': 'Aplut',
        'jobTitle': 'Founder of FluteSangam',
        'worksFor': {
          '@type': 'Organization',
          '@id': `${DOMAIN}/#organization`,
          'name': 'FluteSangam',
          'url': DOMAIN
        },
        'description': 'Founder of FluteSangam, software professional and flute practitioner building a global platform for learning, practicing, and connecting through music.',
        'email': 'aplut0006@gmail.com',
        'url': `${DOMAIN}/founder`
      }
    };
  }

  // 5. About Us
  if (cleanPath === '/about') {
    return {
      title: 'About FluteSangam - Mission, Vision & Community | FluteSangam',
      description: 'FluteSangam is dedicated to making Indian Bamboo Flute (Bansuri) education accessible, structured, and enjoyable for musicians worldwide.',
      canonicalUrl: `${DOMAIN}/about`,
      component: AboutUsView,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${DOMAIN}/#organization`,
        'name': 'FluteSangam',
        'url': DOMAIN,
        'logo': `${DOMAIN}/flutesangam_without_tagline_compressed.png`,
        'description': 'Global community and learning platform for Indian Bamboo Flute (Bansuri) practitioners.'
      }
    };
  }

  // 6. FAQ Pages (Root /faq or /faq/:slug)
  if (cleanPath === '/faq' || cleanPath.startsWith('/faq/')) {
    const slug = cleanPath.replace('/faq/', '').replace('/faq', '');
    
    // Category metadata map
    const categoryMeta: Record<string, { title: string; desc: string; categoryName: string }> = {
      'getting-started': {
        title: 'Getting Started Flute FAQ | Beginner Bansuri Questions & Answers | FluteSangam',
        desc: 'Answers to common beginner questions on getting started with Indian bamboo flute (bansuri), initial posture, first notes, and learning tips.',
        categoryName: 'Getting Started'
      },
      'learning-the-flute': {
        title: 'Learning the Flute FAQ | Bansuri Practice & Sound Production | FluteSangam',
        desc: 'Frequently asked questions about learning the flute, blowing techniques, fingering mastery, sound production, and posture on Indian bamboo flutes.',
        categoryName: 'Learning the Flute'
      },
      'adult-learners': {
        title: 'Adult Learners Flute FAQ | Starting Flute Later in Life | FluteSangam',
        desc: 'Comprehensive answers for adult flute learners: starting age, practice routines with full-time jobs, beginner scales, self-learning tips, and breath control.',
        categoryName: 'Adult Learners'
      },
      'choosing-the-right-flute': {
        title: 'Choosing the Right Flute FAQ | Bansuri Scale, Size & Material Guide | FluteSangam',
        desc: 'Frequently asked questions on choosing the right flute: C Medium vs G Medium scales, bamboo vs PVC flutes, finger reach, sound quality, and selecting your starter bansuri.',
        categoryName: 'Choosing the Right Flute'
      },
      'playing-techniques': {
        title: 'Playing Techniques Flute FAQ | Meend, Gamak & Ornamentation | FluteSangam',
        desc: 'Frequently asked questions about bansuri playing techniques including Meend glides, Gamak oscillations, Komal notes, and breath control.',
        categoryName: 'Playing Techniques'
      },
      'advanced-techniques': {
        title: 'Advanced Flute Techniques FAQ | Meend, Gamak, Murki, Khatka & Kan Swar | FluteSangam',
        desc: 'Comprehensive answers to advanced flute questions covering Meend, Gamak, Murki, Khatka, Kan Swar ornamentation, vibrato, and performance mastery on bansuri.',
        categoryName: 'Advanced Techniques'
      },
      'daily-practice': {
        title: 'Daily Flute Practice FAQ | Routines, Sadhana & Timing | FluteSangam',
        desc: 'Answers to daily practice questions: practice routines, holding sustained notes (Kharaj), timing, tanpura practice, and daily sargam drills.',
        categoryName: 'Daily Practice'
      },
      'scales-and-alankars': {
        title: 'Scales & Alankars Flute FAQ | Sargam Patterns & Finger Speed | FluteSangam',
        desc: 'Frequently asked questions about Alankar finger drills, sargam patterns, building finger speed, metronome practice, and scale transposing.',
        categoryName: 'Scales & Alankars'
      },
      'raagas': {
        title: 'Raagas & Sargam FAQ | Hindustani Raga Rules & Practice | FluteSangam',
        desc: 'Answers to classical raga questions: Aroh-Avroh, Pakad, Vadi-Samvadi, Chalan, Aalap, Bandish, Taans, and daily raga practice for bansuri.',
        categoryName: 'Raagas & Sargam'
      },
      'flute-care-and-maintenance': {
        title: 'Flute Care & Maintenance FAQ | Oiling, Storage & Bamboo Protection | FluteSangam',
        desc: 'Frequently asked questions about bamboo flute care, thread binding, oiling, crack prevention, temperature safety, and cleaning.',
        categoryName: 'Flute Care & Maintenance'
      },
      'health-and-breathing': {
        title: 'Health & Breathing Flute FAQ | Diaphragmatic Breath & Posture | FluteSangam',
        desc: 'Frequently asked questions about breathing techniques, lung capacity, diaphragmatic support, posture alignment, lip fatigue, hand health, and practice habits for flute players.',
        categoryName: 'Health & Breathing'
      },
      'children-and-beginners': {
        title: 'Children & Beginners Flute FAQ | Bansuri for Kids & Novices | FluteSangam',
        desc: 'Frequently asked questions about children learning flute, best flute sizes for kids, beginner practice routines, first notes, and learning without prior music theory.',
        categoryName: 'Children & Beginners'
      },
      'music-theory': {
        title: 'Music Theory & Notation FAQ | Swaras, Shrutis & Tanpura | FluteSangam',
        desc: 'Answers to music theory and notation questions: 12 Swaras, Bhatkhande notation, Tanpura tuning, microtones (Shrutis), and Western scale equivalents.',
        categoryName: 'Music Theory & Notation'
      },
      'tuning-and-pitch': {
        title: 'Flute Tuning & Pitch Calibration FAQ | A=440Hz & Tuner Tools | FluteSangam',
        desc: 'Frequently asked questions about flute tuning, pitch accuracy, A=440Hz standard, cents in music, breath pressure pitch shifts, and chromatic tuners.',
        categoryName: 'Tuning & Pitch Calibration'
      },
      'flute-accessories': {
        title: 'Flute Accessories & Gear FAQ | Cases, Stands, Tuners & Mics | FluteSangam',
        desc: 'Comprehensive answers to flute accessories questions: cases, covers, cleaning rods, microfiber cloths, stands, tanpura apps, tuners, and microphones.',
        categoryName: 'Flute Accessories & Gear'
      },
      'flute-types': {
        title: 'Flute Types & Scales FAQ | Bansuri, PVC, Western & Bass Flutes | FluteSangam',
        desc: 'Comprehensive answers to flute types questions: bamboo bansuri, PVC flutes, Western concert flutes, bass flutes, piccolos, key choices, and buying comparisons.',
        categoryName: 'Flute Types & Scales'
      },
      'platform': {
        title: 'FluteSangam Platform FAQ | Community, Features & Tools | FluteSangam',
        desc: 'Frequently asked questions about FluteSangam: posting audio recitals, requesting song notations, using the tuner, and connecting with flutists.',
        categoryName: 'FluteSangam Platform'
      }
    };

    let title = 'Flute FAQ | Common Questions & Answers for Flute Learners | FluteSangam';
    let description = 'Find answers to common flute questions about learning, practice, bamboo flutes, raagas, breathing, maintenance, and more. Explore the FluteSangam FAQ for helpful guidance.';
    let categoryName = '';

    if (slug && categoryMeta[slug]) {
      title = categoryMeta[slug].title;
      description = categoryMeta[slug].desc;
      categoryName = categoryMeta[slug].categoryName;
    } else if (slug) {
      const foundCat = Object.keys(CATEGORY_SLUGS).find(k => CATEGORY_SLUGS[k] === slug);
      if (foundCat) {
        title = `${foundCat} Flute FAQ | FluteSangam`;
        categoryName = foundCat;
      }
    }

    // Generate FAQ Schema.org data ONLY for questions belonging to this specific page's category
    let faqItems: { name: string; acceptedAnswer: { text: string } }[] = [];
    if (slug) {
      const matchingFaqs = FAQ_DATA.filter(item => {
        switch (slug) {
          case 'getting-started':
            return item.category === 'Getting Started';
          case 'learning-the-flute':
            return item.category === 'Learning the Flute';
          case 'adult-learners':
            return item.category === 'Adult Learners';
          case 'choosing-the-right-flute':
          case 'choosing-a-flute':
            return item.category === 'Choosing a Flute' || item.category === 'Choosing the Right Flute';
          case 'playing-techniques':
            return item.category === 'Playing Techniques';
          case 'advanced-techniques':
            return item.category === 'Advanced Techniques';
          case 'daily-practice':
            return item.category === 'Daily Practice';
          case 'scales-and-alankars':
            return item.category === 'Scales & Alankars';
          case 'raagas':
            return item.category === 'Raagas' || item.category === 'Raagas & Sargam';
          case 'flute-care-and-maintenance':
            return item.category === 'Flute Care & Maintenance';
          case 'health-and-breathing':
            return item.category === 'Health & Breathing';
          case 'children-and-beginners':
            return item.category === 'Children & Beginners';
          case 'music-theory':
            return item.category === 'Music Theory & Notation' || item.category === 'Music Theory & Tuning' || item.category === 'Music Theory';
          case 'tuning-and-pitch':
            return item.category === 'Flute Tuning & Pitch' || item.category === 'Tuning & Pitch Calibration';
          case 'flute-accessories':
            return item.category === 'Flute Accessories' || item.category === 'Flute Accessories & Gear';
          case 'flute-types':
            return item.category === 'Flute Types' || item.category === 'Flute Types & Scales';
          case 'platform':
            return item.category === 'FluteSangam Platform';
          default:
            return item.category === categoryName;
        }
      });
      faqItems = matchingFaqs.map(item => ({
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer.replace(/\n/g, ' ')
        }
      }));
    } else {
      // General root FAQ: include only the first 10 foundational questions
      faqItems = FAQ_DATA.slice(0, 10).map(item => ({
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer.replace(/\n/g, ' ')
        }
      }));
    }

    const canonicalUrl = slug ? `${DOMAIN}/faq/${slug}` : `${DOMAIN}/faq`;
    return {
      title,
      description,
      canonicalUrl,
      component: FluteFaqView,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqItems.map(item => ({
          '@type': 'Question',
          'name': item.name,
          'acceptedAnswer': item.acceptedAnswer
        }))
      }
    };
  }

  // 7. Learn Dashboard
  if (cleanPath === '/learn') {
    const title = 'Flute Learning Hub & Lessons | FluteSangam';
    const description = 'Comprehensive step-by-step learning modules for Indian Bamboo Flute (Bansuri): posture, embouchure, alankaras, raga guides, daily Swar Sadhana routines, and fingering charts.';
    const canonicalUrl = `${DOMAIN}/learn`;
    return {
      title,
      description,
      canonicalUrl,
      component: LearnDashboard,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/learn/intro') {
    const title = 'Introduction to Bansuri | FluteSangam';
    const description = 'Beginner\'s guide to the Indian Bamboo Flute (Bansuri). Learn about history, anatomy, producing your first clean note, and embouchure technique.';
    const canonicalUrl = `${DOMAIN}/learn/intro`;
    return {
      title,
      description,
      canonicalUrl,
      component: LearnIntroView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/learn/choose-flute') {
    const title = 'How to Choose Your First Bansuri | FluteSangam';
    const description = 'Guide to choosing your first Indian bamboo flute: C Medium vs G Natural Base, key selection for beginners, finger stretch, and bamboo quality.';
    const canonicalUrl = `${DOMAIN}/learn/choose-flute`;
    return {
      title,
      description,
      canonicalUrl,
      component: LearnChooseFluteView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/best-budget-flutes') {
    const title = 'Best Budget Flutes to Buy for Beginners | FluteSangam';
    const description = 'Discover the best affordable budget flutes (bamboo and PVC) for beginners. Read our buying guide, FAQs, and tips for starting your bansuri journey.';
    const canonicalUrl = `${DOMAIN}/best-budget-flutes`;
    return {
      title,
      description,
      canonicalUrl,
      component: BudgetFlutesView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/tools/flute-note-key-converter') {
    const title = 'Flute Note & Key Converter | Swara to Western Notes | FluteSangam';
    const description = 'Convert Indian flute swaras to Western notes, translate Western notes to swaras, and explore note relationships across different flute keys with FluteSangam’s interactive converter.';
    const canonicalUrl = `${DOMAIN}/tools/flute-note-key-converter`;
    return {
      title,
      description,
      canonicalUrl,
      component: FluteNoteKeyConverterView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/learn/how-to-find-scale-of-a-song-on-flute') {
    return {
      title: 'How to Find the Scale or Key of a Song on Flute | FluteSangam',
      description: 'Learn how to find the scale or key of any song on flute, identify the tonic or Sa, test the melody, and choose a comfortable flute for playing by ear.',
      canonicalUrl: `${DOMAIN}/learn/how-to-find-scale-of-a-song-on-flute`,
      component: HowToFindSongScaleView,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': 'How to Find the Scale or Key of a Song on Flute',
        'description': 'Learn how to find the scale or key of any song on flute, identify the tonic or Sa, test the melody, and choose a comfortable flute for playing by ear.',
        'image': `${DOMAIN}/flute_tuner_image.jpeg`,
        'datePublished': '2026-08-18T00:00:00Z',
        'dateModified': '2026-08-18T00:00:00Z',
        'author': {
          '@type': 'Person',
          'name': 'Aplut',
          'url': `${DOMAIN}/founder`
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'FluteSangam',
          'logo': {
            '@type': 'ImageObject',
            'url': `${DOMAIN}/flutesangam_without_tagline_compressed.png`
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `${DOMAIN}/learn/how-to-find-scale-of-a-song-on-flute`
        }
      }
    };
  }

  if (cleanPath === '/tuner') {
    const title = 'Online Bansuri Pitch Tuner | FluteSangam';
    const description = 'FluteSangam Online Bansuri Pitch Tuner: Tune your Indian bamboo flute accurately with real-time frequency detection and precision cent measurement.';
    const canonicalUrl = `${DOMAIN}/tuner`;
    return {
      title,
      description,
      canonicalUrl,
      component: LearnTunerView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/learn/basics') {
    const title = 'Bansuri Basics & Holding Technique | FluteSangam';
    const description = 'Learn correct finger positioning, posture, embouchure hole alignment, and air pressure control on the bansuri.';
    const canonicalUrl = `${DOMAIN}/learn/basics`;
    return {
      title,
      description,
      canonicalUrl,
      component: LearnBasicsView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/learn/fingering-chart') {
    const title = 'Bansuri Fingering Chart & Scale Helper | FluteSangam';
    const description = 'Interactive fingering chart for Indian bamboo flute (Bansuri). View hole coverage for Mandra, Madhya, and Tara Saptak swaras.';
    const canonicalUrl = `${DOMAIN}/learn/fingering-chart`;
    return {
      title,
      description,
      canonicalUrl,
      component: LearnFingeringChartView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/learn/alankaras' || cleanPath.startsWith('/learn/alankaras/')) {
    const level = (cleanPath.split('/')[3] || 'overview').toLowerCase();
    let title = 'Bansuri Alankar Practice Vault: 60 Sargam Paltas & Exercises | FluteSangam';
    let description = 'Explore 60 complete bansuri alankars (paltas) for Indian bamboo flute across Beginner, Intermediate & Advanced levels. Features audio playback, swara notations, and interactive metronome.';

    if (level === 'beginner') {
      title = 'Beginner Bansuri Alankar Exercises (20 Sargam Paltas) | FluteSangam';
      description = 'Master 20 beginner bansuri alankars (sargam paltas) on Indian bamboo flute. Practice fundamental Sa Re Ga Ma notes, double swaras, 3 & 4 note patterns, metronome timing, and finger agility.';
    } else if (level === 'intermediate') {
      title = 'Intermediate Bansuri Alankar Exercises (20 Swara Paltas) | FluteSangam';
      description = 'Master 20 intermediate bansuri alankars (sargam paltas) on Indian bamboo flute. Practice vakra cross-steps, double-skips, komal swaras, half-hole fingerings, speed variations, and rhythmic laya drills.';
    } else if (level === 'advanced') {
      title = 'Advanced Bansuri Alankar Exercises (20 Master Paltas) | FluteSangam';
      description = 'Master 20 advanced bansuri alankars (master paltas) on Indian bamboo flute. Practice fast drut taan sprints, khatka-murki ornaments, gamak oscillations, 3-octave leaps, and jhala speed drills.';
    }

    const canonicalUrl = cleanPath.startsWith('/learn/alankaras/') ? `${DOMAIN}${cleanPath}` : `${DOMAIN}/learn/alankaras`;
    return {
      title,
      description,
      canonicalUrl,
      component: LearnAlankarasView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/learn/daily-practice-guide') {
    const title = 'Swar Sadhana & Daily Flute Practice Routine | FluteSangam';
    const description = 'Step-by-step 30-minute daily Swar Sadhana routine for bansuri players: long note holding, tone purity, dynamic control, and pitch accuracy.';
    const canonicalUrl = `${DOMAIN}/learn/daily-practice-guide`;
    return {
      title,
      description,
      canonicalUrl,
      component: DailyPracticeGuideView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/learn/flute-scales-octaves') {
    const title = 'Bansuri Scales & Octaves Explained | FluteSangam';
    const description = 'Understanding Mandra (Lower), Madhya (Middle), and Tara (Higher) Saptaks on the Indian bamboo flute, scale conversions, and pitch keys.';
    const canonicalUrl = `${DOMAIN}/learn/flute-scales-octaves`;
    return {
      title,
      description,
      canonicalUrl,
      component: LearnScalesOctavesView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/learn/common-flute-mistakes') {
    const title = '10 Common Bansuri Mistakes & How to Fix Them | FluteSangam';
    const description = 'Avoid common flute playing pitfalls: airy sound, pitch sharpness, flat notes, finger leaks, shoulder tension, and improper embouchure.';
    const canonicalUrl = `${DOMAIN}/learn/common-flute-mistakes`;
    return {
      title,
      description,
      canonicalUrl,
      component: CommonFluteMistakesView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/alankar-generator') {
    const title = 'Interactive Alankar Pattern Generator | FluteSangam';
    const description = 'Generate custom Alankar swar patterns in any scale, tempo, or rhythmic structure for bansuri finger practice.';
    const canonicalUrl = `${DOMAIN}/alankar-generator`;
    return {
      title,
      description,
      canonicalUrl,
      component: AlankarGeneratorView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  if (cleanPath === '/learn/raagas' || cleanPath === '/ragas') {
    const title = 'Hindustani Classical Raaga Guides for Bansuri | FluteSangam';
    const description = 'Explore comprehensive Raaga guides for Indian flute: Aaroh, Avaroh, Pakad, Vadi, Samvadi, time of day, and song compositions.';
    const canonicalUrl = `${DOMAIN}/learn/raagas`;
    return {
      title,
      description,
      canonicalUrl,
      component: LearnRaagasView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  // 8. Individual Raag Pages (Supports /learn/raga-<name>, /raag/<name>, /raag-<name>)
  const raagMap: Record<string, { title: string; desc: string; comp: React.ComponentType<any> }> = {
    'bhoopali': {
      title: 'Raag Bhoopali — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Master Raag Bhoopali on Indian Bamboo Flute (Bansuri): Audav-Audav pentatonic scale, Aaroh, Avaroh, Pakad, Vadi, Samvadi, and classical compositions.',
      comp: RagaBhoopaliView
    },
    'durga': {
      title: 'Raag Durga — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Durga on Indian Bamboo Flute (Bansuri): Audav-Audav scale omitting Ga and Ni, Aaroh, Avaroh, Pakad, Vadi, Samvadi, and compositions.',
      comp: RagaDurgaView
    },
    'yaman': {
      title: 'Raag Yaman — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Master Raag Yaman on Indian Bamboo Flute (Bansuri): Tivra Ma usage, Sampurna scale, Aaroh, Avaroh, Pakad, phrase movement, and classical compositions.',
      comp: RagaYamanView
    },
    'hamsadhwani': {
      title: 'Raag Hamsadhwani — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Hamsadhwani on Indian Bamboo Flute (Bansuri): pentatonic scale with Shuddha Ga and Ni, Aaroh, Avaroh, Pakad, and flute compositions.',
      comp: RagaHamsadhwaniView
    },
    'bilawal': {
      title: 'Raag Bilawal — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Bilawal on Indian Bamboo Flute (Bansuri): all Shuddha swaras, Bilawal Thaat, Aaroh, Avaroh, Pakad, Vadi, Samvadi, and compositions.',
      comp: RagaBilawalView
    },
    'desh': {
      title: 'Raag Desh — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Master Raag Desh on Indian Bamboo Flute (Bansuri): Khamaj Thaat, Shuddha & Komal Ni usage, Aaroh, Avaroh, Pakad, and popular melodies.',
      comp: RagaDeshView
    },
    'kafi': {
      title: 'Raag Kafi — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Kafi on Indian Bamboo Flute (Bansuri): Komal Ga & Komal Ni swaras, Kafi Thaat, Aaroh, Avaroh, Pakad, and folk compositions.',
      comp: RagaKafiView
    },
    'bageshree': {
      title: 'Raag Bageshree — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Master Raag Bageshree on Indian Bamboo Flute (Bansuri): midnight beauty, Komal Ga & Ni, Audav-Sampurna scale, Aaroh, Avaroh, Pakad, and compositions.',
      comp: RagaBageshreeView
    },
    'bhimpalasi': {
      title: 'Raag Bhimpalasi — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Bhimpalasi on Indian Bamboo Flute (Bansuri): afternoon Raag, Komal Ga & Ni, Audav-Sampurna scale, Aaroh, Avaroh, Pakad, and gat compositions.',
      comp: RagaBhimpalasiView
    },
    'brindavani-sarang': {
      title: 'Raag Brindavani Sarang — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Master Raag Brindavani Sarang on Indian Bamboo Flute (Bansuri): Audav-Audav scale, Kafi Thaat, Aaroh, Avaroh, Pakad, and classical gat compositions.',
      comp: RagaBrindavaniSarangView
    },
    'khamaj': {
      title: 'Raag Khamaj — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Khamaj on Indian Bamboo Flute (Bansuri): Shuddha & Komal Ni, Khamaj Thaat, Shadav-Sampurna scale, Aaroh, Avaroh, Pakad, and Thumri melodies.',
      comp: RagaKhamajView
    },
    'bhairav': {
      title: 'Raag Bhairav — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Master Raag Bhairav on Indian Bamboo Flute (Bansuri): morning Raag, Komal Re & Dha, Bhairav Thaat, Aaroh, Avaroh, Pakad, and devotional compositions.',
      comp: RagaBhairavView
    },
    'bihag': {
      title: 'Raag Bihag — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Bihag on Indian Bamboo Flute (Bansuri): Bilawal Thaat, Shuddha & Tivra Ma usage, Aaroh, Avaroh, Pakad, and night compositions.',
      comp: RagaBihagView
    },
    'malkauns': {
      title: 'Raag Malkauns — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Master Raag Malkauns on Indian Bamboo Flute (Bansuri): deep midnight Raag, Komal Ga, Dha, Ni, Audav-Audav scale, Aaroh, Avaroh, Pakad, and compositions.',
      comp: RagaMalkaunsView
    },
    'marwa': {
      title: 'Raag Marwa — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Marwa on Indian Bamboo Flute (Bansuri): sunset Raag, Komal Re & Tivra Ma, Marwa Thaat, Aaroh, Avaroh, Pakad, and classical gat compositions.',
      comp: RagaMarwaView
    },
    'jog': {
      title: 'Raag Jog — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Master Raag Jog on Indian Bamboo Flute (Bansuri): meditative night Raag, dual Ga usage, Audav-Shadav scale, Aaroh, Avaroh, Pakad, and compositions.',
      comp: RagaJogView
    },
    'todi': {
      title: 'Raag Todi — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Todi on Indian Bamboo Flute (Bansuri): morning Raag, Komal Re, Ga, Dha & Tivra Ma, Todi Thaat, Aaroh, Avaroh, Pakad, and classical compositions.',
      comp: RagaTodiView
    },
    'multani': {
      title: 'Raag Multani — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Multani with detailed notes, Aaroh, Avaroh, Pakad, characteristics, Aalap practice, flute tips, and an original FluteSangam learning piece.',
      comp: RagaMultaniView
    },
    'pahadi': {
      title: 'Raag Pahadi — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Pahadi with detailed notes, Aaroh, Avaroh, Pakad, characteristics, Aalap practice, flute tips, and an original FluteSangam learning piece.',
      comp: RagaPahadiView
    },
    'miyan-ki-malhar': {
      title: 'Raag Miyan Ki Malhar — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Master Raag Miyan Ki Malhar on Indian Bamboo Flute (Bansuri): rain Raag composed by Tansen, dual Ni & Komal Ga, Aaroh, Avaroh, Pakad, and compositions.',
      comp: RagaMiyanKiMalharView
    },
    'tilang': {
      title: 'Raag Tilang — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Tilang on Indian Bamboo Flute (Bansuri): Khamaj Thaat, Shuddha & Komal Ni, Aaroh, Avaroh, Pakad, practice drills, and original FluteSangam learning piece.',
      comp: RagaTilangView
    },
    'shivranjani': {
      title: 'Raag Shivranjani — Notes, Aaroh, Avaroh, Pakad & Practice | FluteSangam',
      desc: 'Learn Raag Shivranjani on Indian Bamboo Flute (Bansuri): Kafi Thaat, Komal Ga (g), Audav-Audav pentatonic scale, Aaroh, Avaroh, Pakad, practice drills, and original learning piece.',
      comp: RagaShivranjaniView
    }
  };

  // Check if path matches a Raag route
  let raagSlug = '';
  if (cleanPath.startsWith('/learn/raga-')) {
    raagSlug = cleanPath.replace('/learn/raga-', '');
  } else if (cleanPath.startsWith('/raag/')) {
    raagSlug = cleanPath.replace('/raag/', '');
  } else if (cleanPath.startsWith('/raag-')) {
    raagSlug = cleanPath.replace('/raag-', '');
  }

  if (raagSlug && raagMap[raagSlug]) {
    const raagInfo = raagMap[raagSlug];
    return {
      title: raagInfo.title,
      description: raagInfo.desc,
      canonicalUrl: `${DOMAIN}/learn/raga-${raagSlug}`,
      component: raagInfo.comp,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': raagInfo.title,
        'description': raagInfo.desc,
        'author': {
          '@type': 'Organization',
          'name': 'FluteSangam',
          'url': DOMAIN
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'FluteSangam',
          'url': DOMAIN,
          'logo': {
            '@type': 'ImageObject',
            'url': `${DOMAIN}/flutesangam_logo.png`
          }
        },
        'datePublished': '2026-08-17T00:00:00Z',
        'dateModified': '2026-08-17T00:00:00Z',
        'url': `${DOMAIN}/learn/raga-${raagSlug}`
      }
    };
  }

  // 9. Community Members (noindex, follow)
  if (cleanPath === '/members') {
    const title = 'Community Members | FluteSangam';
    const description = 'Meet flutists, learners, and mentors in the global FluteSangam community.';
    const canonicalUrl = `${DOMAIN}/members`;
    return {
      title,
      description,
      canonicalUrl,
      robots: 'noindex, follow',
      component: MembersView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  // 10. Contact Us
  if (cleanPath === '/contact') {
    const title = 'Contact Us & Support | FluteSangam';
    const description = 'Get in touch with the FluteSangam team for platform support, feedback, questions, or community collaboration.';
    const canonicalUrl = `${DOMAIN}/contact`;
    return {
      title,
      description,
      canonicalUrl,
      component: ContactUsView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  // 11. Notations Requests
  if (cleanPath === '/notations') {
    const title = 'Sargam Song Notation Requests | FluteSangam';
    const description = 'Browse and request Sargam notations for Bollywood, devotional, classical, and folk songs on the Indian bamboo flute.';
    const canonicalUrl = `${DOMAIN}/notations`;
    return {
      title,
      description,
      canonicalUrl,
      component: NotationRequestsView,
      jsonLd: createWebPageSchema(canonicalUrl, title, description)
    };
  }

  // Default / 404 Fallback
  return {
    title: 'Page Not Found | FluteSangam',
    description: 'The requested page could not be found on FluteSangam.',
    canonicalUrl: `${DOMAIN}/404`,
    component: NotFoundView,
    is404: true
  };
}

export function renderRouteHtml(path: string, templateHtml: string): { 
  html: string; 
  title: string; 
  description: string; 
  canonicalUrl: string;
  is404: boolean;
} {
  const meta = getRouteMetadata(path);

  // If this is an explicit 301/permanent redirect route
  if (meta.redirectUrl) {
    const targetUrl = meta.redirectUrl;
    let redirectHtml = templateHtml;
    redirectHtml = redirectHtml.replace(/<div id="seo-fallback-content"[\s\S]*?<\/div>\s*(?=<div id="root")/i, '');
    redirectHtml = redirectHtml.replace(/<link rel="canonical".*?\/>/gi, '');
    redirectHtml = redirectHtml.replace(/<meta name="description".*?\/>/gi, '');
    redirectHtml = redirectHtml.replace(/<meta name="title".*?\/>/gi, '');
    redirectHtml = redirectHtml.replace(/<meta name="robots".*?\/>/gi, '');
    redirectHtml = redirectHtml.replace(/<title>.*?<\/title>/s, `<title>Redirecting to ${meta.title}...</title>`);
    
    const headAdditions = `
    <meta name="robots" content="noindex, follow" />
    <meta http-equiv="refresh" content="0; url=${targetUrl}" />
    <link rel="canonical" href="${targetUrl}" />
    <script>window.location.replace("${targetUrl}");</script>
    `;
    redirectHtml = redirectHtml.replace('</head>', `${headAdditions}\n</head>`);
    
    const redirectBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 60px 20px; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #fed7aa;">
      <h2 style="color: #9a3412; font-size: 24px; font-weight: 700; margin-bottom: 12px;">Redirecting...</h2>
      <p style="color: #4b5563; font-size: 16px; margin-bottom: 20px;">We are taking you to the updated FAQ guide: <strong>${meta.title}</strong></p>
      <p style="color: #6b7280; font-size: 14px;">If you are not redirected automatically within a few seconds, <a href="${targetUrl}" style="color: #ea580c; text-decoration: underline; font-weight: 600;">click here</a>.</p>
    </div>
    `;
    
    const rootStartIndex = redirectHtml.indexOf('<div id="root">');
    if (rootStartIndex !== -1) {
      const rootEndIndex = redirectHtml.indexOf('</div>', rootStartIndex) + 6;
      redirectHtml = redirectHtml.substring(0, rootStartIndex) + 
        `<div id="root">${redirectBody}</div>` + 
        redirectHtml.substring(rootEndIndex);
    }
    
    return {
      html: redirectHtml,
      title: meta.title,
      description: meta.description,
      canonicalUrl: targetUrl,
      is404: false
    };
  }

  const ViewComponent = meta.component;
  const compProps = meta.componentProps || {};

  // Render the full UI layout inside MemoryRouter
  const renderedContent = ReactDOMServer.renderToString(
    <MemoryRouter initialEntries={[path]}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfbf7] via-[#fff4e6] to-[#fdebd0] pb-24 md:pb-0" id="flutesangam-app-container">
        <Navbar currentUser={null} onOpenAuth={() => {}} onLogout={() => {}} onProfileUpdated={() => {}} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 flex-1 w-full pb-24 md:pb-12 min-h-[75vh]" id="main-content-layout">
          <ViewComponent {...compProps} />
          {path === '/' && (
            <>
              <AboutAuthorSection />
              <FlutePracticeFaqSection />
            </>
          )}
        </main>
        <Footer />
      </div>
    </MemoryRouter>
  );

  let finalHtml = templateHtml;

  // Clean out default static fallback container so page source shows ONLY the actual pre-rendered route content
  finalHtml = finalHtml.replace(/<div id="seo-fallback-content"[\s\S]*?<\/div>\s*(?=<div id="root")/i, '');

  // Clean out default canonical links and meta tags if present
  finalHtml = finalHtml.replace(/<link rel="canonical".*?\/>/gi, '');
  finalHtml = finalHtml.replace(/<meta name="description".*?\/>/gi, '');
  finalHtml = finalHtml.replace(/<meta name="title".*?\/>/gi, '');
  finalHtml = finalHtml.replace(/<meta name="robots".*?\/>/gi, '');
  finalHtml = finalHtml.replace(/<meta property="og:title".*?\/>/gi, '');
  finalHtml = finalHtml.replace(/<meta property="og:description".*?\/>/gi, '');
  finalHtml = finalHtml.replace(/<meta property="og:url".*?\/>/gi, '');
  finalHtml = finalHtml.replace(/<meta name="twitter:title".*?\/>/gi, '');
  finalHtml = finalHtml.replace(/<meta name="twitter:description".*?\/>/gi, '');

  // Replace Title
  const titleTag = `<title>${meta.title}</title>`;
  if (finalHtml.includes('<title>')) {
    finalHtml = finalHtml.replace(/<title>.*?<\/title>/s, titleTag);
  } else {
    finalHtml = finalHtml.replace('</head>', `  ${titleTag}\n</head>`);
  }

  const robotsTag = meta.robots
    ? `<meta name="robots" content="${meta.robots}" />`
    : meta.is404
      ? '<meta name="robots" content="noindex, follow" />'
      : '<meta name="robots" content="index, follow, max-image-preview:large" />';

  // Inject Meta Description & Canonical URL & OpenGraph & JSON-LD into <head>
  const headAdditions = `
    ${robotsTag}
    <meta name="title" content="${meta.title.replace(/"/g, '&quot;')}" />
    <meta name="description" content="${meta.description.replace(/"/g, '&quot;')}" />
    <link rel="canonical" href="${meta.canonicalUrl}" />
    <meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${meta.description.replace(/"/g, '&quot;')}" />
    <meta property="og:url" content="${meta.canonicalUrl}" />
    <meta name="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${meta.description.replace(/"/g, '&quot;')}" />
    ${meta.jsonLd ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>` : ''}
  `;
  finalHtml = finalHtml.replace('</head>', `${headAdditions}\n</head>`);

  // Inject Pre-rendered React HTML into <div id="root">
  const rootStartIndex = finalHtml.indexOf('<div id="root">');
  if (rootStartIndex !== -1) {
    let rootEndIndex = finalHtml.indexOf('<script', rootStartIndex);
    const bodyEndIndex = finalHtml.indexOf('</body>', rootStartIndex);
    if (rootEndIndex === -1 || (bodyEndIndex !== -1 && rootEndIndex > bodyEndIndex)) {
      rootEndIndex = bodyEndIndex !== -1 ? bodyEndIndex : finalHtml.length;
    }
    finalHtml = finalHtml.substring(0, rootStartIndex) + 
      `<div id="root">${renderedContent}</div>\n  ` + 
      finalHtml.substring(rootEndIndex);
  } else {
    finalHtml = finalHtml.replace('</body>', `<div id="root">${renderedContent}</div>\n</body>`);
  }

  return {
    html: finalHtml,
    title: meta.title,
    description: meta.description,
    canonicalUrl: meta.canonicalUrl,
    is404: !!meta.is404
  };
}
