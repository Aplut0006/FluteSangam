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
import RagaMiyanKiMalharView from '../components/RagaMiyanKiMalharView';

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
}

const DOMAIN = 'https://flutesangam.com';

export function getRouteMetadata(path: string): RouteMetadata {
  // Normalize path
  let cleanPath = path.trim().split('?')[0].split('#')[0];
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  // 1. Home / Search
  if (cleanPath === '' || cleanPath === '/' || cleanPath === '/community' || cleanPath === '/search') {
    return {
      title: 'FluteSangam - Indian Flute (Bansuri) Community, Notations & Lessons',
      description: 'FluteSangam is a global community for Indian Bamboo Flute (Bansuri) players. Discover Sargam notations, raga guides, daily Swar Sadhana practice tools, and connect with flutists worldwide.',
      canonicalUrl: `${DOMAIN}/`,
      component: HomepageOverview,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'id': `${DOMAIN}/#website`,
        'name': 'FluteSangam',
        'url': DOMAIN,
        'description': 'The premier global platform and community for Indian Bamboo Flute (Bansuri) practice, lessons, raga guides, and Sargam notations.',
        'publisher': {
          '@type': 'Organization',
          'name': 'FluteSangam',
          'url': DOMAIN,
          'logo': `${DOMAIN}/flutesangam_without_tagline_compressed.png`
        }
      }
    };
  }

  // 2. Privacy Policy & Aliases
  if (cleanPath === '/privacy-policy' || cleanPath === '/privacy') {
    return {
      title: 'Privacy Policy | FluteSangam',
      description: 'Privacy Policy for FluteSangam: data protection, security, user account safety, cookies, and privacy compliance for the global Indian flute community.',
      canonicalUrl: `${DOMAIN}/privacy-policy`,
      component: PrivacyPolicyView
    };
  }

  // 3. Terms of Service & Aliases
  if (cleanPath === '/terms-of-service' || cleanPath === '/terms') {
    return {
      title: 'Terms of Service | FluteSangam',
      description: 'Terms of Service for FluteSangam: platform guidelines, community code of conduct, intellectual property, and user account terms.',
      canonicalUrl: `${DOMAIN}/terms-of-service`,
      component: TermsOfServiceView
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
      title: 'About FluteSangam - Mission, Vision & Community',
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
    let categoryTitle = 'Flute Learning Knowledge Base & FAQs';
    if (slug) {
      const catName = Object.keys(CATEGORY_SLUGS).find(k => CATEGORY_SLUGS[k] === slug);
      if (catName) {
        categoryTitle = `${catName} Flute FAQ`;
      }
    }

    // Generate FAQ Schema.org data
    let faqItems: { name: string; acceptedAnswer: { text: string } }[] = [];
    if (slug) {
      const categoryName = Object.keys(CATEGORY_SLUGS).find(key => CATEGORY_SLUGS[key] === slug);
      if (categoryName) {
        const matchingFaqs = FAQ_DATA.filter(item => item.category === categoryName);
        faqItems = matchingFaqs.map(item => ({
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer.replace(/\n/g, ' ')
          }
        }));
      }
    }
    if (faqItems.length === 0) {
      // Fallback top FAQs
      faqItems = FAQ_DATA.slice(0, 10).map(item => ({
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer.replace(/\n/g, ' ')
        }
      }));
    }

    return {
      title: `${categoryTitle} | FluteSangam`,
      description: `Comprehensive answers to common questions about learning bansuri: embouchure, scale selection, Swar Sadhana, Raagas, adult learning, and flute care.`,
      canonicalUrl: slug ? `${DOMAIN}/faq/${slug}` : `${DOMAIN}/faq`,
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
    return {
      title: 'Flute Sangam Learn - Master Indian Flute (Bansuri)',
      description: 'Comprehensive step-by-step learning modules for Indian Bamboo Flute (Bansuri): posture, embouchure, alankaras, raga guides, daily Swar Sadhana routines, and fingering charts.',
      canonicalUrl: `${DOMAIN}/learn`,
      component: LearnDashboard
    };
  }

  if (cleanPath === '/learn/intro') {
    return {
      title: 'Introduction to Bansuri | FluteSangam',
      description: 'Beginner\'s guide to the Indian Bamboo Flute (Bansuri). Learn about history, anatomy, producing your first clean note, and embouchure technique.',
      canonicalUrl: `${DOMAIN}/learn/intro`,
      component: LearnIntroView
    };
  }

  if (cleanPath === '/learn/choose-flute') {
    return {
      title: 'How to Choose Your First Bansuri | FluteSangam',
      description: 'Guide to choosing your first Indian bamboo flute: C Medium vs G Natural Base, key selection for beginners, finger stretch, and bamboo quality.',
      canonicalUrl: `${DOMAIN}/learn/choose-flute`,
      component: LearnChooseFluteView
    };
  }

  if (cleanPath === '/tuner') {
    return {
      title: 'Online Bansuri Pitch Tuner | FluteSangam',
      description: 'FluteSangam Online Bansuri Pitch Tuner: Tune your Indian bamboo flute accurately with real-time frequency detection and precision cent measurement.',
      canonicalUrl: `${DOMAIN}/tuner`,
      component: LearnTunerView
    };
  }

  if (cleanPath === '/learn/basics') {
    return {
      title: 'Bansuri Basics & Holding Technique | FluteSangam',
      description: 'Learn correct finger positioning, posture, embouchure hole alignment, and air pressure control on the bansuri.',
      canonicalUrl: `${DOMAIN}/learn/basics`,
      component: LearnBasicsView
    };
  }

  if (cleanPath === '/learn/fingering-chart') {
    return {
      title: 'Bansuri Fingering Chart & Scale Helper | FluteSangam',
      description: 'Interactive fingering chart for Indian bamboo flute (Bansuri). View hole coverage for Mandra, Madhya, and Tara Saptak swaras.',
      canonicalUrl: `${DOMAIN}/learn/fingering-chart`,
      component: LearnFingeringChartView
    };
  }

  if (cleanPath === '/learn/alankaras' || cleanPath.startsWith('/learn/alankaras/')) {
    const level = cleanPath.split('/')[3] || 'overview';
    const levelTitle = level !== 'overview' ? `${level.charAt(0).toUpperCase() + level.slice(1)} ` : '';
    return {
      title: `${levelTitle}Alankaras & Finger Drills for Bansuri | FluteSangam`,
      description: `Master finger speed, pitch accuracy, and ornamentations with structured Alankara drills for beginner, intermediate, and advanced flutists.`,
      canonicalUrl: cleanPath.startsWith('/learn/alankaras/') ? `${DOMAIN}${cleanPath}` : `${DOMAIN}/learn/alankaras`,
      component: LearnAlankarasView
    };
  }

  if (cleanPath === '/learn/daily-practice-guide') {
    return {
      title: 'Swar Sadhana & Daily Flute Practice Routine | FluteSangam',
      description: 'Step-by-step 30-minute daily Swar Sadhana routine for bansuri players: long note holding, tone purity, dynamic control, and pitch accuracy.',
      canonicalUrl: `${DOMAIN}/learn/daily-practice-guide`,
      component: DailyPracticeGuideView
    };
  }

  if (cleanPath === '/learn/flute-scales-octaves') {
    return {
      title: 'Bansuri Scales & Octaves Explained | FluteSangam',
      description: 'Understanding Mandra (Lower), Madhya (Middle), and Tara (Higher) Saptaks on the Indian bamboo flute, scale conversions, and pitch keys.',
      canonicalUrl: `${DOMAIN}/learn/flute-scales-octaves`,
      component: LearnScalesOctavesView
    };
  }

  if (cleanPath === '/learn/common-flute-mistakes') {
    return {
      title: '10 Common Bansuri Mistakes & How to Fix Them | FluteSangam',
      description: 'Avoid common flute playing pitfalls: airy sound, pitch sharpness, flat notes, finger leaks, shoulder tension, and improper embouchure.',
      canonicalUrl: `${DOMAIN}/learn/common-flute-mistakes`,
      component: CommonFluteMistakesView
    };
  }

  if (cleanPath === '/alankar-generator') {
    return {
      title: 'Interactive Alankar Pattern Generator | FluteSangam',
      description: 'Generate custom Alankar swar patterns in any scale, tempo, or rhythmic structure for bansuri finger practice.',
      canonicalUrl: `${DOMAIN}/alankar-generator`,
      component: AlankarGeneratorView
    };
  }

  if (cleanPath === '/learn/raagas') {
    return {
      title: 'Hindustani Classical Raaga Guides for Bansuri | FluteSangam',
      description: 'Explore comprehensive Raaga guides for Indian flute: Aaroh, Avaroh, Pakad, Vadi, Samvadi, time of day, and song compositions.',
      canonicalUrl: `${DOMAIN}/learn/raagas`,
      component: LearnRaagasView
    };
  }

  // 8. Individual Raag Pages (Supports /learn/raga-<name>, /raag/<name>, /raag-<name>)
  const raagMap: Record<string, { title: string; desc: string; comp: React.ComponentType<any> }> = {
    'bhoopali': {
      title: 'Raag Bhoopali Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Master Raag Bhoopali on Indian Bamboo Flute (Bansuri): Audav-Audav pentatonic scale, Aaroh, Avaroh, Pakad, Vadi, Samvadi, and classical compositions.',
      comp: RagaBhoopaliView
    },
    'durga': {
      title: 'Raag Durga Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Learn Raag Durga on Indian Bamboo Flute (Bansuri): Audav-Audav scale omitting Ga and Ni, Aaroh, Avaroh, Pakad, Vadi, Samvadi, and compositions.',
      comp: RagaDurgaView
    },
    'yaman': {
      title: 'Raag Yaman Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Master Raag Yaman on Indian Bamboo Flute (Bansuri): Tivra Ma usage, Sampurna scale, Aaroh, Avaroh, Pakad, phrase movement, and classical compositions.',
      comp: RagaYamanView
    },
    'hamsadhwani': {
      title: 'Raag Hamsadhwani Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Learn Raag Hamsadhwani on Indian Bamboo Flute (Bansuri): pentatonic scale with Shuddha Ga and Ni, Aaroh, Avaroh, Pakad, and flute compositions.',
      comp: RagaHamsadhwaniView
    },
    'bilawal': {
      title: 'Raag Bilawal Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Learn Raag Bilawal on Indian Bamboo Flute (Bansuri): all Shuddha swaras, Bilawal Thaat, Aaroh, Avaroh, Pakad, Vadi, Samvadi, and compositions.',
      comp: RagaBilawalView
    },
    'desh': {
      title: 'Raag Desh Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Master Raag Desh on Indian Bamboo Flute (Bansuri): Khamaj Thaat, Shuddha & Komal Ni usage, Aaroh, Avaroh, Pakad, and popular melodies.',
      comp: RagaDeshView
    },
    'kafi': {
      title: 'Raag Kafi Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Learn Raag Kafi on Indian Bamboo Flute (Bansuri): Komal Ga & Komal Ni swaras, Kafi Thaat, Aaroh, Avaroh, Pakad, and folk compositions.',
      comp: RagaKafiView
    },
    'bageshree': {
      title: 'Raag Bageshree Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Master Raag Bageshree on Indian Bamboo Flute (Bansuri): midnight beauty, Komal Ga & Ni, Audav-Sampurna scale, Aaroh, Avaroh, Pakad, and compositions.',
      comp: RagaBageshreeView
    },
    'bhimpalasi': {
      title: 'Raag Bhimpalasi Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Learn Raag Bhimpalasi on Indian Bamboo Flute (Bansuri): afternoon Raag, Komal Ga & Ni, Audav-Sampurna scale, Aaroh, Avaroh, Pakad, and gat compositions.',
      comp: RagaBhimpalasiView
    },
    'brindavani-sarang': {
      title: 'Raag Brindavani Sarang Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Master Raag Brindavani Sarang on Indian Bamboo Flute (Bansuri): Audav-Audav scale, Kafi Thaat, Aaroh, Avaroh, Pakad, and classical gat compositions.',
      comp: RagaBrindavaniSarangView
    },
    'khamaj': {
      title: 'Raag Khamaj Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Learn Raag Khamaj on Indian Bamboo Flute (Bansuri): Shuddha & Komal Ni, Khamaj Thaat, Shadav-Sampurna scale, Aaroh, Avaroh, Pakad, and Thumri melodies.',
      comp: RagaKhamajView
    },
    'bhairav': {
      title: 'Raag Bhairav Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Master Raag Bhairav on Indian Bamboo Flute (Bansuri): morning Raag, Komal Re & Dha, Bhairav Thaat, Aaroh, Avaroh, Pakad, and devotional compositions.',
      comp: RagaBhairavView
    },
    'bihag': {
      title: 'Raag Bihag Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Learn Raag Bihag on Indian Bamboo Flute (Bansuri): Bilawal Thaat, Shuddha & Tivra Ma usage, Aaroh, Avaroh, Pakad, and night compositions.',
      comp: RagaBihagView
    },
    'malkauns': {
      title: 'Raag Malkauns Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Master Raag Malkauns on Indian Bamboo Flute (Bansuri): deep midnight Raag, Komal Ga, Dha, Ni, Audav-Audav scale, Aaroh, Avaroh, Pakad, and compositions.',
      comp: RagaMalkaunsView
    },
    'marwa': {
      title: 'Raag Marwa Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Learn Raag Marwa on Indian Bamboo Flute (Bansuri): sunset Raag, Komal Re & Tivra Ma, Marwa Thaat, Aaroh, Avaroh, Pakad, and classical gat compositions.',
      comp: RagaMarwaView
    },
    'jog': {
      title: 'Raag Jog Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Master Raag Jog on Indian Bamboo Flute (Bansuri): meditative night Raag, dual Ga usage, Audav-Shadav scale, Aaroh, Avaroh, Pakad, and compositions.',
      comp: RagaJogView
    },
    'todi': {
      title: 'Raag Todi Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Learn Raag Todi on Indian Bamboo Flute (Bansuri): morning Raag, Komal Re, Ga, Dha & Tivra Ma, Todi Thaat, Aaroh, Avaroh, Pakad, and classical compositions.',
      comp: RagaTodiView
    },
    'miyan-ki-malhar': {
      title: 'Raag Miyan Ki Malhar Bansuri Guide - Aaroh, Avaroh, Pakad | FluteSangam',
      desc: 'Master Raag Miyan Ki Malhar on Indian Bamboo Flute (Bansuri): rain Raag composed by Tansen, dual Ni & Komal Ga, Aaroh, Avaroh, Pakad, and compositions.',
      comp: RagaMiyanKiMalharView
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
        '@type': 'MusicComposition',
        'name': `Raag ${raagSlug.charAt(0).toUpperCase() + raagSlug.slice(1)}`,
        'composer': {
          '@type': 'Organization',
          'name': 'Hindustani Classical Tradition'
        },
        'description': raagInfo.desc,
        'url': `${DOMAIN}/learn/raga-${raagSlug}`
      }
    };
  }

  // 9. Community Members
  if (cleanPath === '/members') {
    return {
      title: 'Community Members | FluteSangam',
      description: 'Meet flutists, learners, and mentors in the global FluteSangam community.',
      canonicalUrl: `${DOMAIN}/members`,
      component: MembersView
    };
  }

  // 10. Contact Us
  if (cleanPath === '/contact') {
    return {
      title: 'Contact Us | FluteSangam',
      description: 'Get in touch with the FluteSangam team for feedback, questions, or collaboration.',
      canonicalUrl: `${DOMAIN}/contact`,
      component: ContactUsView
    };
  }

  // 11. Notations Requests
  if (cleanPath === '/notations') {
    return {
      title: 'Sargam Song Notation Requests | FluteSangam',
      description: 'Browse and request Sargam notations for Bollywood, devotional, classical, and folk songs on the Indian bamboo flute.',
      canonicalUrl: `${DOMAIN}/notations`,
      component: NotationRequestsView
    };
  }

  // Default / 404 Fallback
  return {
    title: 'Page Not Found | FluteSangam',
    description: 'The requested page could not be found on FluteSangam.',
    canonicalUrl: `${DOMAIN}/404`,
    component: NotFoundView
  };
}

export function renderRouteHtml(path: string, templateHtml: string): { html: string; title: string; description: string; canonicalUrl: string } {
  const meta = getRouteMetadata(path);
  const ViewComponent = meta.component;
  const compProps = meta.componentProps || {};

  // Render the full UI layout inside MemoryRouter
  const renderedContent = ReactDOMServer.renderToString(
    <MemoryRouter initialEntries={[path]}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfbf7] via-[#fff4e6] to-[#fdebd0] pb-24 md:pb-0" id="flutesangam-app-container">
        <Navbar currentUser={null} onOpenAuth={() => {}} onLogout={() => {}} onProfileUpdated={() => {}} />
        <main className="flex-grow">
          <ViewComponent {...compProps} />
          {path === '/' && (
            <>
              <AboutAuthorSection />
              <FlutePracticeFaqSection />
            </>
          )}
        </main>
      </div>
    </MemoryRouter>
  );

  let finalHtml = templateHtml;

  // Clean out default canonical links and meta tags if present
  finalHtml = finalHtml.replace(/<link rel="canonical".*?\/>/gi, '');
  finalHtml = finalHtml.replace(/<meta name="description".*?\/>/gi, '');
  finalHtml = finalHtml.replace(/<meta name="title".*?\/>/gi, '');
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

  // Inject Meta Description & Canonical URL & OpenGraph & JSON-LD into <head>
  const headAdditions = `
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
  finalHtml = finalHtml.replace(
    /<div id="root">[\s\S]*?<\/div>\s*<script/i,
    `<div id="root">${renderedContent}</div>\n    <script`
  );

  return {
    html: finalHtml,
    title: meta.title,
    description: meta.description,
    canonicalUrl: meta.canonicalUrl
  };
}
