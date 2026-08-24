import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  HelpCircle, Search, ChevronDown, BookOpen, Music, Wind, 
  Sparkles, CheckCircle2, MessageSquare, ArrowRight, Shield, 
  Heart, ExternalLink, ThumbsUp, ThumbsDown, Copy, Check, 
  Calendar, Info, RefreshCw, Layers, CircleDot, Filter, AlertTriangle, LifeBuoy, Plus,
  Sliders, Package, Compass, Award, Activity, Users, Smile
} from 'lucide-react';
import { AppView } from '../types';
import { VIEW_URLS } from '../routes';
import { FAQ_DATA, CATEGORY_SLUGS, type FaqItem } from '../data/allFaqData';
export type { FaqItem };
export { FAQ_DATA, CATEGORY_SLUGS };

interface FluteFaqViewProps {
  onViewChange?: (view: AppView) => void;
}

export const CATEGORIES = [
  'All Categories',
  'Getting Started',
  'Learning the Flute',
  'Adult Learners',
  'Choosing the Right Flute',
  'Playing Techniques',
  'Advanced Techniques',
  'Daily Practice',
  'Scales & Alankars',
  'Raagas',
  'Flute Care & Maintenance',
  'Health & Breathing',
  'Children & Beginners',
  'Flute Tuning & Pitch',
  'Music Theory & Notation',
  'Flute Accessories',
  'Flute Types',
  'FluteSangam Platform'
];

export const SLUG_TO_CATEGORY: Record<string, string> = {
  '': 'All Categories',
  'getting-started': 'Getting Started',
  'learning-the-flute': 'Learning the Flute',
  'adult-learners': 'Adult Learners',
  'adults': 'Adult Learners',
  'adult-learner': 'Adult Learners',
  'choosing-the-right-flute': 'Choosing the Right Flute',
  'choosing-a-flute': 'Choosing the Right Flute',
  'playing-techniques': 'Playing Techniques',
  'advanced-techniques': 'Advanced Techniques',
  'advanced-technique': 'Advanced Techniques',
  'daily-practice': 'Daily Practice',
  'scales-and-alankars': 'Scales & Alankars',
  'scales-and-alankaras': 'Scales & Alankars',
  'scales-alankars': 'Scales & Alankars',
  'raagas': 'Raagas',
  'flute-care-and-maintenance': 'Flute Care & Maintenance',
  'health-and-breathing': 'Health & Breathing',
  'health-breathing': 'Health & Breathing',
  'children-and-beginners': 'Children & Beginners',
  'children-beginners': 'Children & Beginners',
  'kids-and-beginners': 'Children & Beginners',
  'kids-beginners': 'Children & Beginners',
  'children': 'Children & Beginners',
  'beginners': 'Children & Beginners',
  'flute-tuning-and-pitch': 'Flute Tuning & Pitch',
  'flute-tuning-pitch': 'Flute Tuning & Pitch',
  'tuning-and-pitch': 'Flute Tuning & Pitch',
  'tuning-pitch': 'Flute Tuning & Pitch',
  'music-theory': 'Music Theory & Notation',
  'music-theory-and-notation': 'Music Theory & Notation',
  'music-theory-and-tuning': 'Music Theory & Notation',
  'music-theory-tuning': 'Music Theory & Notation',
  'flute-accessories': 'Flute Accessories',
  'flute-accessories-and-gear': 'Flute Accessories',
  'flute-accessory': 'Flute Accessories',
  'accessories': 'Flute Accessories',
  'flute-types': 'Flute Types',
  'flute-types-and-scales': 'Flute Types',
  'flute-type': 'Flute Types',
  'types-of-flutes': 'Flute Types',
  'types-of-flute': 'Flute Types',
  'platform': 'FluteSangam Platform',
  'flutesangam-platform': 'FluteSangam Platform',
};

// Hub Cards definitions with icons and descriptions for crawlable category navigation
const FAQ_HUB_TOPICS = [
  {
    slug: 'raagas',
    title: 'Raagas & Classical Sargam',
    category: 'Raagas',
    icon: Music,
    color: 'from-amber-600 to-amber-700',
    description: 'Classical Hindustani ragas, Thaat systems, Aroha-Avroha structures, Vadi-Samvadi notes, and emotional expression.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Raagas' || f.category === 'Raagas & Sargam').length
  },
  {
    slug: 'music-theory',
    title: 'Music Theory & Notation',
    category: 'Music Theory & Notation',
    icon: Sparkles,
    color: 'from-indigo-600 to-indigo-700',
    description: '12 Swaras, Bhatkhande notation scripts, Tanpura tuning, microtonal Shrutis, and Indian-Western scale equivalents.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Music Theory & Notation' || f.category === 'Music Theory & Tuning' || f.category === 'Music Theory').length
  },
  {
    slug: 'tuning-and-pitch',
    title: 'Tuning & Pitch Calibration',
    category: 'Flute Tuning & Pitch',
    icon: Sliders,
    color: 'from-cyan-600 to-cyan-700',
    description: 'A=440Hz concert pitch standards, cents accuracy, chromatic tuners, and temperature/breath pressure pitch compensation.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Flute Tuning & Pitch' || f.category === 'Tuning & Pitch Calibration').length
  },
  {
    slug: 'flute-accessories',
    title: 'Flute Accessories & Gear',
    category: 'Flute Accessories',
    icon: Package,
    color: 'from-emerald-600 to-emerald-700',
    description: 'Hard carrying cases, gig bags, microfiber swabs, tanpura apps, electronic tuners, and live performance microphones.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Flute Accessories' || f.category === 'Flute Accessories & Gear').length
  },
  {
    slug: 'flute-types',
    title: 'Flute Types & Scales',
    category: 'Flute Types',
    icon: Compass,
    color: 'from-purple-600 to-purple-700',
    description: 'Assam bamboo Bansuri, PVC beginner flutes, Western silver concert flutes, bass flutes, and scale comparisons.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Flute Types' || f.category === 'Flute Types & Scales').length
  },
  {
    slug: 'getting-started',
    title: 'Getting Started with Bansuri',
    category: 'Getting Started',
    icon: HelpCircle,
    color: 'from-orange-600 to-orange-700',
    description: 'First embouchure blowing techniques, producing your initial clear tone, choosing beginner scales, and posture.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Getting Started').length
  },
  {
    slug: 'learning-the-flute',
    title: 'Learning & Fundamentals',
    category: 'Learning the Flute',
    icon: BookOpen,
    color: 'from-bamboo-600 to-bamboo-700',
    description: 'Step-by-step guidance for beginners, finger pad sealing, breath discipline, and transitioning across octaves.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Learning the Flute').length
  },
  {
    slug: 'daily-practice',
    title: 'Daily Practice Routines',
    category: 'Daily Practice',
    icon: Calendar,
    color: 'from-teal-600 to-teal-700',
    description: '30-minute and 60-minute Sadhana structures, Kharaj Riyaz long tones, metronome training, and consistency tips.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Daily Practice').length
  },
  {
    slug: 'flute-care-and-maintenance',
    title: 'Flute Care & Maintenance',
    category: 'Flute Care & Maintenance',
    icon: Shield,
    color: 'from-rose-600 to-rose-700',
    description: 'Mustard oiling protocols, crack prevention, thread binding, bore cleaning, and climate humidity protection.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Flute Care & Maintenance').length
  },
  {
    slug: 'health-and-breathing',
    title: 'Health & Breath Control',
    category: 'Health & Breathing',
    icon: Wind,
    color: 'from-sky-600 to-sky-700',
    description: 'Diaphragmatic breathing, Pranayama exercises, overcoming dizziness, avoiding hand cramps, and asthma benefits.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Health & Breathing').length
  },
  {
    slug: 'adult-learners',
    title: 'Adult Learners Guide',
    category: 'Adult Learners',
    icon: Users,
    color: 'from-amber-700 to-amber-800',
    description: 'Learning flute as an adult, overcoming finger stiffness, managing practice with a busy career, and musical memory.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Adult Learners').length
  },
  {
    slug: 'playing-techniques',
    title: 'Playing Techniques',
    category: 'Playing Techniques',
    icon: Activity,
    color: 'from-blue-600 to-blue-700',
    description: 'Lip flexibility, air column speed, holding angles, clean note articulation, and eliminating air hissing sounds.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Playing Techniques').length
  },
  {
    slug: 'advanced-techniques',
    title: 'Advanced Classical Ornaments',
    category: 'Advanced Techniques',
    icon: Award,
    color: 'from-fuchsia-600 to-fuchsia-700',
    description: 'Mastering Meend (glissando slides), Gamak oscillations, Murki graces, Khatka turns, and Kampan vibrato.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Advanced Techniques').length
  },
  {
    slug: 'scales-and-alankars',
    title: 'Scales & Alankar Drills',
    category: 'Scales & Alankars',
    icon: Layers,
    color: 'from-yellow-600 to-yellow-700',
    description: 'Permutations of Sargam, speed acceleration exercises, finger agility drills, and rhythmic Taals.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Scales & Alankars').length
  },
  {
    slug: 'children-and-beginners',
    title: 'Children & Young Learners',
    category: 'Children & Beginners',
    icon: Smile,
    color: 'from-green-600 to-green-700',
    description: 'Sizing flutes for small child hands, child-friendly practice routines, and motivating young music students.',
    questionCount: FAQ_DATA.filter(f => f.category === 'Children & Beginners').length
  },
  {
    slug: 'platform',
    title: 'FluteSangam Platform & Tools',
    category: 'FluteSangam Platform',
    icon: MessageSquare,
    color: 'from-bamboo-800 to-bamboo-950',
    description: 'How to record and share audio recitals, request song notations, use the online tuner, and connect with gurus.',
    questionCount: FAQ_DATA.filter(f => f.category === 'FluteSangam Platform').length
  }
];

export default function FluteFaqView({ onViewChange }: FluteFaqViewProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Map current URL pathname to category name
  const currentPathCategory = useMemo(() => {
    const path = location.pathname;
    if (path === '/faq' || path === '/faq/') {
      return 'All Categories';
    }
    if (path.startsWith('/faq/')) {
      const slug = path.replace('/faq/', '').split('/')[0].toLowerCase().trim();
      return SLUG_TO_CATEGORY[slug] || 'All Categories';
    }
    return 'All Categories';
  }, [location.pathname]);

  const [selectedCategory, setSelectedCategory] = useState<string>(currentPathCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('start-what-is-bamboo-flute');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, 'yes' | 'no'>>({});
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Sync category state when URL changes (e.g., via browser Back/Forward or direct link)
  useEffect(() => {
    if (selectedCategory !== currentPathCategory) {
      setSelectedCategory(currentPathCategory);
    }
  }, [currentPathCategory]);

  const handleCategorySelect = (cat: string) => {
    let targetCategory = cat;
    if (cat === selectedCategory && cat !== 'All Categories') {
      targetCategory = 'All Categories';
    }

    setSelectedCategory(targetCategory);
    if (searchQuery) {
      setSearchQuery('');
    }

    // Update URL route dynamically
    const slug = CATEGORY_SLUGS[targetCategory] || '';
    const targetUrl = slug ? `/faq/${slug}` : '/faq';
    if (location.pathname !== targetUrl) {
      navigate(targetUrl);
    }

    setTimeout(() => {
      const container = document.getElementById('faq-list-container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Reset pagination when category or search changes
  useEffect(() => {
    setVisibleCount(10);
  }, [selectedCategory, searchQuery]);

  // Inject dynamic SEO Title, Meta Description, and Canonical Link based on selected category
  useEffect(() => {
    let title = 'Flute FAQ | Common Questions & Answers for Flute Learners | FluteSangam';
    let description = 'Find answers to common flute questions about learning, practice, bamboo flutes, raagas, breathing, maintenance, and more. Explore the FluteSangam FAQ for helpful guidance.';

    switch (selectedCategory) {
      case 'Getting Started':
        title = 'Getting Started Flute FAQ | Beginner Bansuri Questions & Answers | FluteSangam';
        description = 'Find answers to common beginner questions about starting the flute: what is a bansuri, unique features, first sounds, beginner scales, and embouchure.';
        break;
      case 'Learning the Flute':
        title = 'Learning the Flute FAQ | Beginner & Practice Advice | FluteSangam';
        description = 'Frequently asked questions about learning the flute: finger placement, breath control, octave shifts, self-learning vs gurus, and daily practice routines.';
        break;
      case 'Adult Learners':
        title = 'Adult Flute Learners FAQ | Learning Bansuri Later in Life | FluteSangam';
        description = 'Common questions for adult flute beginners: hand flexibility, learning pace, managing practice time, breath stamina, and adult-friendly methods.';
        break;
      case 'Choosing the Right Flute':
      case 'Choosing a Flute':
        title = 'Choosing the Right Flute FAQ | C Natural, G Base & Scale Guide | FluteSangam';
        description = 'Answers to flute selection questions: C Medium vs G Base, bamboo vs PVC vs acrylic, finding trusted makers, and inspecting flute tuning.';
        break;
      case 'Playing Techniques':
        title = 'Flute Playing Techniques FAQ | Embouchure, Tone & Articulation | FluteSangam';
        description = 'Common questions about flute playing techniques: clear embouchure, eliminating airy tone, mastering Komal/Teevra swaras, and tongue articulation.';
        break;
      case 'Advanced Techniques':
        title = 'Advanced Flute Techniques FAQ | Meend, Gamak, Murki & Khatka | FluteSangam';
        description = 'Advanced Indian classical flute questions: producing smooth Meend glides, Gamak oscillations, fast Murki/Khatka, and breath vibrato.';
        break;
      case 'Daily Practice':
        title = 'Daily Flute Practice FAQ | Routines, Metronomes & Riyaz | FluteSangam';
        description = 'Answers to daily practice questions: structured 30/60 min routines, morning Kharaj practice, metronome training, and overcoming plateaus.';
        break;
      case 'Scales & Alankars':
        title = 'Flute Scales & Alankars FAQ | Sargam Drills & Speed Exercises | FluteSangam';
        description = 'Questions about scales and Alankars: essential beginner drills, building speed, practicing in Thaats, and finger agility patterns.';
        break;
      case 'Raagas':
      case 'Raagas & Sargam':
        title = 'Raagas & Sargam Flute FAQ | Classical Indian Ragas on Bansuri | FluteSangam';
        description = 'Frequently asked questions on classical Indian raagas: first ragas for beginners (Bhoopali, Yaman), Aroha/Avroha, Vadi/Samvadi, and Pakad phrases.';
        break;
      case 'Flute Care & Maintenance':
        title = 'Flute Care & Maintenance FAQ | Oiling, Binding & Crack Prevention | FluteSangam';
        description = 'Expert answers to flute care questions: mustard oiling frequency, repairing hairline cracks, thread binding, temperature safety, and cleaning.';
        break;
      case 'Health & Breathing':
        title = 'Flute Health & Breathing FAQ | Pranayama, Posture & Lung Capacity | FluteSangam';
        description = 'Frequently asked questions on health and breathing for flutists: diaphragmatic breathing, avoiding dizziness, hand ergonomics, and asthma benefits.';
        break;
      case 'Children & Beginners':
        title = 'Flute for Children & Young Beginners FAQ | Sizing & Teaching Tips | FluteSangam';
        description = 'Helpful answers for young flute learners: ideal starting age, small hand flutes (G/A High), child-friendly practice, and music fundamentals.';
        break;
      case 'Music Theory & Notation':
      case 'Music Theory & Tuning':
      case 'Music Theory':
        title = 'Music Theory & Notation Flute FAQ | Swaras, Shrutis & Tanpura | FluteSangam';
        description = 'Answers to music theory and notation questions: 12 Swaras, Bhatkhande notation, Tanpura tuning, microtones (Shrutis), and Western scale equivalents.';
        break;
      case 'Tuning & Pitch Calibration':
      case 'Flute Tuning & Pitch':
        title = 'Flute Tuning & Pitch Calibration FAQ | A=440Hz & Tuner Tools | FluteSangam';
        description = 'Frequently asked questions about flute tuning, pitch accuracy, A=440Hz standard, cents in music, breath pressure pitch shifts, and chromatic tuners.';
        break;
      case 'Flute Accessories & Gear':
      case 'Flute Accessories':
        title = 'Flute Accessories & Gear FAQ | Cases, Stands, Tuners & Mics | FluteSangam';
        description = 'Comprehensive answers to flute accessories questions: cases, covers, cleaning rods, microfiber cloths, stands, tanpura apps, tuners, and microphones.';
        break;
      case 'Flute Types & Scales':
      case 'Flute Types':
        title = 'Flute Types & Scales FAQ | Bansuri, PVC, Western & Bass Flutes | FluteSangam';
        description = 'Comprehensive answers to flute types questions: bamboo bansuri, PVC flutes, Western concert flutes, bass flutes, piccolos, key choices, and buying comparisons.';
        break;
      case 'FluteSangam Platform':
        title = 'FluteSangam Platform FAQ | Community, Features & Tools | FluteSangam';
        description = 'Frequently asked questions about FluteSangam: posting audio recitals, requesting song notations, using the tuner, and connecting with flutists.';
        break;
    }

    document.title = title;
    
    // Set or update Meta Description tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Set or update Canonical Link tag
    const slug = CATEGORY_SLUGS[selectedCategory] || '';
    const canonicalUrl = `https://flutesangam.com/faq${slug ? '/' + slug : ''}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Scroll smoothly to top when category changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory]);

  // Filter FAQs based on active category & live search text
  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return FAQ_DATA.filter((faq) => {
      // When searching, search across ALL categories
      if (query) {
        const matchesQuestion = faq.question.toLowerCase().includes(query);
        const matchesAnswer = faq.answer.toLowerCase().includes(query);
        const matchesCategoryText = faq.category.toLowerCase().includes(query);
        const matchesTags = faq.tags?.some(tag => tag.toLowerCase().includes(query));

        return matchesQuestion || matchesAnswer || matchesCategoryText || matchesTags;
      }

      // When there is no search query, filter by selected category
      const matchesCategory =
        selectedCategory === 'All Categories' ||
        faq.category === selectedCategory ||
        ((selectedCategory === 'Choosing a Flute' || selectedCategory === 'Choosing the Right Flute') &&
         (faq.category === 'Choosing a Flute' || faq.category === 'Choosing the Right Flute')) ||
        ((selectedCategory === 'Music Theory & Tuning' || selectedCategory === 'Music Theory & Notation' || selectedCategory === 'Music Theory') &&
         (faq.category === 'Music Theory & Tuning' || faq.category === 'Music Theory & Notation' || faq.category === 'Music Theory')) ||
        ((selectedCategory === 'Flute Types' || selectedCategory === 'Flute Types & Scales') &&
         (faq.category === 'Flute Types' || faq.category === 'Flute Types & Scales')) ||
        ((selectedCategory === 'Flute Tuning & Pitch' || selectedCategory === 'Tuning & Pitch Calibration') &&
         (faq.category === 'Flute Tuning & Pitch' || faq.category === 'Tuning & Pitch Calibration')) ||
        ((selectedCategory === 'Flute Accessories' || selectedCategory === 'Flute Accessories & Gear') &&
         (faq.category === 'Flute Accessories' || faq.category === 'Flute Accessories & Gear')) ||
        ((selectedCategory === 'Raagas' || selectedCategory === 'Raagas & Sargam') &&
         (faq.category === 'Raagas' || faq.category === 'Raagas & Sargam'));

      return matchesCategory;
    });
  }, [selectedCategory, searchQuery]);

  // For category-specific views, render ALL questions for that category to match the FAQPage schema exactly
  // For 'All Categories', paginate with Load More for smooth client performance while ensuring initial questions have full answers in DOM
  const visibleFaqs = useMemo(() => {
    if (selectedCategory !== 'All Categories' || searchQuery.trim()) {
      return filteredFaqs;
    }
    return filteredFaqs.slice(0, visibleCount);
  }, [filteredFaqs, selectedCategory, searchQuery, visibleCount]);

  const hasMore = selectedCategory === 'All Categories' && !searchQuery.trim() && visibleCount < filteredFaqs.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 15);
  };

  const toggleExpand = (id: string) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  const handleCopyLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleFeedback = (id: string, choice: 'yes' | 'no', e: React.MouseEvent) => {
    e.stopPropagation();
    setHelpfulFeedback(prev => ({ ...prev, [id]: choice }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
      id="flute-faq-page-container"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-bamboo-950 via-bamboo-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-amber-800/40">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 transform -translate-x-12 translate-y-12 w-64 h-64 bg-bamboo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30 backdrop-blur-md">
            <LifeBuoy className="w-4 h-4 text-amber-400" />
            <span>FluteSangam Help Center &amp; Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-amber-100 leading-tight">
            Frequently Asked Questions <span className="text-amber-400 font-serif italic">(FAQ)</span>
          </h1>

          <p className="text-sm sm:text-base text-bamboo-200 leading-relaxed font-sans">
            Welcome to the official FluteSangam Knowledge Base! Whether you are picking up the flute (Bansuri) for the very first time, selecting your initial scale, troubleshooting breath control, practicing classical raagas, or exploring our community tools, you will find comprehensive, step-by-step guidance right here.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200/90 pt-2 border-t border-amber-800/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Last Updated: August 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Structured Answers &amp; Community Insights</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{FAQ_DATA.length} Detailed Q&amp;A Topics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Crawlable Topic Navigation Hub: Browse FAQ by Topic */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-md space-y-6" id="faq-topic-navigation-hub">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>Browse FAQ by Topic</span>
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Explore specialized questions, technical breakdowns, and guides across all bansuri subjects.
            </p>
          </div>

          <Link
            to="/faq"
            onClick={() => handleCategorySelect('All Categories')}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer self-start sm:self-auto ${
              selectedCategory === 'All Categories'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
            }`}
          >
            View All ({FAQ_DATA.length} Q&amp;A)
          </Link>
        </div>

        {/* 16 Crawlable Category Hub Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FAQ_HUB_TOPICS.map((topic) => {
            const Icon = topic.icon;
            const isSelected = selectedCategory === topic.category || 
              ((topic.category === 'Raagas' || topic.category === 'Raagas & Sargam') && (selectedCategory === 'Raagas' || selectedCategory === 'Raagas & Sargam')) ||
              ((topic.category === 'Music Theory & Notation' || topic.category === 'Music Theory & Tuning' || topic.category === 'Music Theory') && (selectedCategory === 'Music Theory & Notation' || selectedCategory === 'Music Theory & Tuning' || selectedCategory === 'Music Theory')) ||
              ((topic.category === 'Flute Tuning & Pitch' || topic.category === 'Tuning & Pitch Calibration') && (selectedCategory === 'Flute Tuning & Pitch' || selectedCategory === 'Tuning & Pitch Calibration')) ||
              ((topic.category === 'Flute Accessories' || topic.category === 'Flute Accessories & Gear') && (selectedCategory === 'Flute Accessories' || selectedCategory === 'Flute Accessories & Gear')) ||
              ((topic.category === 'Flute Types' || topic.category === 'Flute Types & Scales') && (selectedCategory === 'Flute Types' || selectedCategory === 'Flute Types & Scales'));

            return (
              <Link
                key={topic.slug}
                to={`/faq/${topic.slug}`}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey) {
                    handleCategorySelect(topic.category);
                  }
                }}
                className={`group p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-amber-50/90 border-amber-500 shadow-sm ring-2 ring-amber-400/30'
                    : 'bg-white hover:bg-amber-50/40 border-amber-200/80 hover:border-amber-400 hover:shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${topic.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      {topic.questionCount} Questions
                    </span>
                  </div>

                  <h3 className="text-sm font-bold font-display text-bamboo-950 group-hover:text-amber-800 transition-colors">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {topic.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-100/70 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-900">
                  <span>Browse Questions</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Live Interactive Search Bar & Quick Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-md space-y-4" id="faq-search-section">
        <div className="relative">
          <label htmlFor="faq-search-input" className="sr-only">
            Search FAQ Questions
          </label>
          <Search className="w-5 h-5 text-amber-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (val.trim() && selectedCategory !== 'All Categories') {
                handleCategorySelect('All Categories');
              }
            }}
            placeholder="Search any question across all categories (e.g., 'breath control', 'embouchure', 'C Medium', 'raagas', 'tuning')..."
            className="w-full pl-11 pr-16 py-3 min-h-[44px] bg-amber-50/50 border border-amber-300 rounded-xl text-sm font-medium text-bamboo-950 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner"
            id="faq-search-input"
            aria-label="Search FAQ questions across all categories"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                handleCategorySelect('All Categories');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] px-3 py-2 text-xs font-bold bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-lg transition cursor-pointer flex items-center justify-center"
              title="Clear search"
              aria-label="Clear search input"
            >
              Clear
            </button>
          )}
        </div>

        {/* Mobile Dropdown Category Select */}
        <div className="block sm:hidden space-y-1.5 pt-1">
          <label htmlFor="faq-category-dropdown-mobile" className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>Select FAQ Category:</span>
          </label>
          <div className="relative">
            <select
              id="faq-category-dropdown-mobile"
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="w-full min-h-[44px] appearance-none bg-amber-50 border border-amber-300 text-bamboo-950 font-bold text-xs py-2.5 pl-3.5 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer shadow-2xs"
              aria-label="Select FAQ Category"
            >
              {CATEGORIES.map((cat) => {
                const count = cat === 'All Categories' 
                  ? FAQ_DATA.length 
                  : FAQ_DATA.filter(f => f.category === cat || ((cat === 'Choosing a Flute' || cat === 'Choosing the Right Flute') && (f.category === 'Choosing a Flute' || f.category === 'Choosing the Right Flute'))).length;
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count} Q&amp;A)
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-amber-800 font-bold text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Desktop Category Pills Slider */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-amber-600" /> Filter:
          </span>
          {CATEGORIES.map((cat) => {
            const count = cat === 'All Categories' 
              ? FAQ_DATA.length 
              : FAQ_DATA.filter(f => f.category === cat || ((cat === 'Choosing a Flute' || cat === 'Choosing the Right Flute') && (f.category === 'Choosing a Flute' || f.category === 'Choosing the Right Flute'))).length;
            const isActive = selectedCategory === cat || 
              ((cat === 'Raagas' || cat === 'Raagas & Sargam') && (selectedCategory === 'Raagas' || selectedCategory === 'Raagas & Sargam')) ||
              ((cat === 'Music Theory & Notation' || cat === 'Music Theory & Tuning' || cat === 'Music Theory') && (selectedCategory === 'Music Theory & Notation' || selectedCategory === 'Music Theory & Tuning' || selectedCategory === 'Music Theory')) ||
              ((cat === 'Flute Tuning & Pitch' || cat === 'Tuning & Pitch Calibration') && (selectedCategory === 'Flute Tuning & Pitch' || selectedCategory === 'Tuning & Pitch Calibration')) ||
              ((cat === 'Flute Accessories' || cat === 'Flute Accessories & Gear') && (selectedCategory === 'Flute Accessories' || selectedCategory === 'Flute Accessories & Gear')) ||
              ((cat === 'Flute Types' || cat === 'Flute Types & Scales') && (selectedCategory === 'Flute Types' || selectedCategory === 'Flute Types & Scales'));

            const catSlug = CATEGORY_SLUGS[cat] || '';
            const catHref = catSlug ? `/faq/${catSlug}` : '/faq';

            return (
              <Link
                key={cat}
                to={catHref}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey) {
                    handleCategorySelect(cat);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs border border-amber-700'
                    : 'bg-amber-50 text-bamboo-800 hover:bg-amber-100 border border-amber-200/80'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-amber-800 text-amber-100' : 'bg-amber-200/70 text-amber-900'
                }`}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Introduction Narrative */}
      <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-amber-100 pb-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <h2 className="text-xl font-bold font-display text-bamboo-950">
            About the FluteSangam Help Center
          </h2>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3 font-sans">
          <p>
            The Indian bamboo flute (Bansuri) is one of humanity's oldest and purest musical instruments. Crafting a soulful sound from a simple piece of Assam bamboo requires an exquisite harmony of physical technique, mindful breath control, emotional expression, and continuous practice (Sadhana). Because self-learning or finding a traditional Guru can sometimes feel overwhelming, FluteSangam has compiled this comprehensive Help Center &amp; FAQ library to empower every flutist on their journey.
          </p>
          <p>
            Our answers cover the entire spectrum of flute playing—from selecting your very first beginner scale (such as C Medium or G Medium) and mastering your lip embouchure, to executing smooth Alankars, practicing classical Hindustani raagas (like Bhoopali or Yaman), maintaining bamboo durability, and utilizing digital tuners. Browse through the categories above or search for specific terms to discover practical, structured answers tailored specifically for your progress!
          </p>
        </div>
      </section>

      {/* FAQ Accordion List - Every single question and answer is in the HTML DOM for crawlers, visually collapsed with CSS */}
      <div className="space-y-4 min-h-[500px] scroll-mt-28" id="faq-list-container">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
          <span>
            Showing {visibleFaqs.length} of {filteredFaqs.length} Questions
            {selectedCategory !== 'All Categories' && (
              <span className="ml-2 text-amber-900 font-bold bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1">
                Category: {selectedCategory}
              </span>
            )}
            {searchQuery.trim() && (
              <span className="ml-2 text-amber-900 font-bold bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1">
                Searched across All Categories
              </span>
            )}
          </span>
          {selectedCategory !== 'All Categories' && !searchQuery.trim() && (
            <Link 
              to="/faq"
              onClick={() => handleCategorySelect('All Categories')} 
              className="text-amber-700 hover:underline cursor-pointer"
            >
              Reset Category Filter
            </Link>
          )}
          {searchQuery.trim() && (
            <button 
              onClick={() => {
                setSearchQuery('');
                handleCategorySelect('All Categories');
              }} 
              className="text-amber-700 hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center space-y-3 border border-amber-200 shadow-2xs">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-bamboo-950">No matching questions found</h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              We couldn't find any FAQ matching "{searchQuery}". Feel free to post your question directly in our community feed or send us a message!
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Clear Search
              </button>
              {onViewChange && (
                <button
                  onClick={() => onViewChange('contact_us')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Ask Support / Contact Us
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {visibleFaqs.map((faq, index) => {
              const isExpanded = expandedFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  id={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                    isExpanded ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md' : 'border-amber-200/90 hover:border-amber-300'
                  }`}
                >
                  {/* Question Header Button */}
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none group"
                    aria-expanded={isExpanded}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                          {faq.category}
                        </span>
                        {faq.tags?.map(t => (
                          <span key={t} className="text-[10px] text-gray-600 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-display text-bamboo-950 group-hover:text-amber-800 transition-colors leading-snug">
                        {index + 1}. {faq.question}
                      </h3>
                    </div>

                    <div className={`p-2 rounded-xl transition-all shrink-0 ${
                      isExpanded ? 'bg-amber-500 text-white rotate-180' : 'bg-amber-100 text-amber-800 group-hover:bg-amber-200'
                    }`}>
                      <ChevronDown className="w-5 h-5 transition-transform" />
                    </div>
                  </button>

                  {/* Answer Content - Always rendered in the HTML DOM for SSR & SEO, visually collapsed with CSS */}
                  <div
                    id={`faq-answer-${faq.id}`}
                    className={`border-t border-amber-100 bg-amber-50/30 transition-all duration-200 ${
                      isExpanded ? 'block' : 'hidden'
                    }`}
                  >
                    <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-gray-800 leading-relaxed font-sans">
                      {/* Body Answer Text formatted with paragraphs */}
                      {faq.answer.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="leading-relaxed">
                          {paragraph}
                        </p>
                      ))}

                      {/* Direct Action Link to Related App Tool */}
                      {faq.relatedLink && (
                        <div className="pt-2">
                          <Link
                            to={VIEW_URLS[faq.relatedLink.view] || '/learn'}
                            onClick={() => onViewChange?.(faq.relatedLink!.view)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                          >
                            <span>{faq.relatedLink.text}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      )}

                      {/* Utilities Bar */}
                      <div className="pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-600">Was this helpful?</span>
                          <button
                            onClick={(e) => handleFeedback(faq.id, 'yes', e)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${
                              helpfulFeedback[faq.id] === 'yes'
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                                : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Yes</span>
                          </button>

                          <button
                            onClick={(e) => handleFeedback(faq.id, 'no', e)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${
                              helpfulFeedback[faq.id] === 'no'
                                ? 'bg-rose-100 border-rose-400 text-rose-800'
                                : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
                            <span>No</span>
                          </button>
                        </div>

                        <button
                          onClick={(e) => handleCopyLink(faq.id, e)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 transition cursor-pointer"
                          title="Copy link to this answer"
                        >
                          {copiedId === faq.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Link Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-amber-600" />
                              <span>Copy Answer Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {hasMore && (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-4 h-4" />
                  <span>Load More Questions ({filteredFaqs.length - visibleCount} remaining)</span>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Didn't Find Your Answer? Contact & Community Callout */}
      <section className="bg-gradient-to-r from-amber-500/10 via-amber-100/60 to-bamboo-100/50 rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6" id="faq-contact-callout">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold font-display text-bamboo-950 flex items-center justify-center md:justify-start gap-2">
            <MessageSquare className="w-6 h-6 text-amber-700" />
            <span>Didn't find your answer?</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 max-w-xl leading-relaxed">
            Feel free to contact our support team directly or join the global FluteSangam community feed to post your questions, share your recitals, and learn alongside fellow bansuri players!
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <Link
            to="/contact"
            onClick={() => onViewChange?.('contact_us')}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-white" />
            <span>Contact Us</span>
          </Link>

          <Link
            to="/"
            onClick={() => onViewChange?.('community')}
            className="px-5 py-2.5 bg-bamboo-900 hover:bg-bamboo-950 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Join Community</span>
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
