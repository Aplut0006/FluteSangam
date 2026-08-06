import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { seedDatabaseIfEmpty, subscribeToPosts, getUserProfile, getUserProfileByEmail, subscribeToUnreadMessages, subscribeToAllUsers, getPost, createUserProfile, generateUniqueUsername, markUserAsDeletedInFirestore } from './lib/db';
import { VIEW_URLS } from './routes';
import { UserProfile, Post, AppView } from './types';
import { motion, AnimatePresence } from 'motion/react';

import { lazyWithRetry } from './lib/lazyWithRetry';
import ErrorBoundary from './components/ErrorBoundary';

// Core Eagerly Loaded Layout Components
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PostCard from './components/PostCard';
import MobileBottomNav from './components/MobileBottomNav';
import FlutePracticeFaqSection from './components/FlutePracticeFaqSection';
import AboutAuthorSection from './components/AboutAuthorSection';
import ScrollToTopButton from './components/ScrollToTopButton';

// Lazy-Loaded Route & Secondary View Components with Retry & Error Protection
const RagaGuide = lazyWithRetry(() => import('./components/RagaGuide'));
const CreatePostModal = lazyWithRetry(() => import('./components/CreatePostModal'));
const ShareModal = lazyWithRetry(() => import('./components/ShareModal'));
const ChatSection = lazyWithRetry(() => import('./components/ChatSection'));
const PostDetailView = lazyWithRetry(() => import('./components/PostDetailView'));
const UserProfileView = lazyWithRetry(() => import('./components/UserProfileView'));
const LearnDashboard = lazyWithRetry(() => import('./components/LearnDashboard'));
const LearnIntroView = lazyWithRetry(() => import('./components/LearnIntroView'));
const LearnBasicsView = lazyWithRetry(() => import('./components/LearnBasicsView'));
const LearnFingeringChartView = lazyWithRetry(() => import('./components/LearnFingeringChartView'));
const LearnChooseFluteView = lazyWithRetry(() => import('./components/LearnChooseFluteView'));
const LearnTunerView = lazyWithRetry(() => import('./components/LearnTunerView'));
const LearnAlankarasView = lazyWithRetry(() => import('./components/LearnAlankarasView'));
const DailyPracticeGuideView = lazyWithRetry(() => import('./components/DailyPracticeGuideView'));
const CommonFluteMistakesView = lazyWithRetry(() => import('./components/CommonFluteMistakesView'));
const FluteFaqView = lazyWithRetry(() => import('./components/FluteFaqView'));
const AlankarGeneratorView = lazyWithRetry(() => import('./components/AlankarGeneratorView'));
const LearnRaagasView = lazyWithRetry(() => import('./components/LearnRaagasView'));
const RagaBhoopaliView = lazyWithRetry(() => import('./components/RagaBhoopaliView'));
const RagaDurgaView = lazyWithRetry(() => import('./components/RagaDurgaView'));
const RagaYamanView = lazyWithRetry(() => import('./components/RagaYamanView'));
const RagaHamsadhwaniView = lazyWithRetry(() => import('./components/RagaHamsadhwaniView'));
const RagaBilawalView = lazyWithRetry(() => import('./components/RagaBilawalView'));
const RagaDeshView = lazyWithRetry(() => import('./components/RagaDeshView'));
const RagaKafiView = lazyWithRetry(() => import('./components/RagaKafiView'));
const RagaBageshreeView = lazyWithRetry(() => import('./components/RagaBageshreeView'));
const RagaBhimpalasiView = lazyWithRetry(() => import('./components/RagaBhimpalasiView'));
const RagaBrindavaniSarangView = lazyWithRetry(() => import('./components/RagaBrindavaniSarangView'));
const MembersView = lazyWithRetry(() => import('./components/MembersView'));
const ImageModal = lazyWithRetry(() => import('./components/ImageModal'));
const AboutUsView = lazyWithRetry(() => import('./components/AboutUsView'));
const FounderView = lazyWithRetry(() => import('./components/FounderView'));
const ContactUsView = lazyWithRetry(() => import('./components/ContactUsView'));
const FluteSangamChatbot = lazyWithRetry(() => import('./components/FluteSangamChatbot').then(m => ({ default: m.FluteSangamChatbot })));
const NotationRequestsView = lazyWithRetry(() => import('./components/NotationRequestsView').then(m => ({ default: m.NotationRequestsView })));
const PrivacyPolicyView = lazyWithRetry(() => import('./components/PrivacyPolicyView'));
const TermsOfServiceView = lazyWithRetry(() => import('./components/TermsOfServiceView'));
const NotFoundView = lazyWithRetry(() => import('./components/NotFoundView'));
const HomepageOverview = lazyWithRetry(() => import('./components/HomepageOverview'));

const ViewFallbackLoader = () => (
  <div className="flex flex-col items-center justify-center p-12 my-8 bg-white/60 backdrop-blur-md rounded-2xl border border-bamboo-100 shadow-3xs max-w-md mx-auto min-h-[400px]">
    <div className="w-10 h-10 border-4 border-bamboo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
    <p className="text-xs font-bold text-bamboo-900 tracking-wide">Loading FluteSangam Module...</p>
  </div>
);

// Icons
import { 
  Search, Plus, Sparkles, HelpCircle, Compass, ChevronDown,
  BookOpen, Video, Info, ArrowUpRight, Music, Filter, CheckCircle2, MessageSquare, Bell, X, Wind, ShieldCheck, User, Users, Globe, ArrowLeft, Home
} from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeRagaFilter, setActiveRagaFilter] = useState<string | null>(null);
  const [visiblePostsCount, setVisiblePostsCount] = useState<number>(6);

  useEffect(() => {
    setVisiblePostsCount(6);
  }, [searchQuery, activeCategory, activeRagaFilter]);
  
  // Active Tab for mobile (Feed vs Raga Sadhana vs Quick Tips vs Chats)
  // const [mobileTab, setMobileTab] = useState<'feed' | 'ragas' | 'chats' | 'tips'>('feed');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeSharePost, setActiveSharePost] = useState<Post | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // View Management
  const [currentView, setCurrentView] = useState<AppView>('community');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [allUsersList, setAllUsersList] = useState<UserProfile[]>([]);
  const [chatTargetUser, setChatTargetUser] = useState<{
    uid: string;
    displayName: string;
    username?: string;
    photoURL?: string;
  } | null>(null);

  // Post editing state
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isNavbarEditingProfile, setIsNavbarEditingProfile] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // Dynamic SEO Title & Meta Description Management
  useEffect(() => {
    let title = 'FluteSangam | Learn Flute, Bansuri & Connect with Flutists';
    let description = 'Learn flute online with lessons, songs, ragas, techniques, practice guides, and connect with a global community of flutists to learn, share, perform, and grow together.';

    switch (currentView) {
      case 'community':
        title = 'FluteSangam | Learn Flute, Bansuri & Connect with Flutists';
        description = 'FluteSangam is the premier Indian flute and bansuri sargam learning community. Explore community posts, audio recitals, questions, and member discussions.';
        break;
      case 'chats':
        title = 'Direct Messages & Chat | FluteSangam Community';
        description = 'FluteSangam Direct Messages & Chat: Connect with Indian flute and bansuri flutists, ask questions, exchange guidance, and collaborate on classical ragas.';
        break;
      case 'learn_dashboard':
        title = 'Flute Learning Hub & Lessons | FluteSangam';
        description = 'FluteSangam Flute Learning Hub & Lessons: Learn Indian flute and bansuri step-by-step with posture guides, alankar drills, and Hindustani classical ragas.';
        break;
      case 'learn_intro':
        title = 'Introduction to Bansuri | FluteSangam Hub';
        description = 'FluteSangam Introduction to Bansuri: Discover origin, anatomy, scale selection, maintenance, and essential playing fundamentals of Indian bamboo flute.';
        break;
      case 'learn_basics':
        title = 'Bansuri Basics & Fingering | FluteSangam';
        description = 'FluteSangam Bansuri Basics & Blowing Techniques: Master sound generation, blowing posture, finger positioning, and accurate swara production on bamboo flute.';
        break;
      case 'learn_choose_flute':
        title = 'How to Choose the Right Flute | FluteSangam';
        description = 'FluteSangam guide on How to Choose the Right Flute (Bansuri): Learn how to select C Middle, A Base, or G Base flutes for beginner and advanced players.';
        break;
      case 'learn_fingering_chart':
        title = 'Interactive Fingering Chart | FluteSangam';
        description = 'FluteSangam Interactive Fingering Chart: Interactive scale selector, Sa Re Ga Ma notes & audio playback for Indian bamboo flute (Bansuri).';
        break;
      case 'learn_tuner':
        title = 'Bansuri Tuner & Tanpura | FluteSangam';
        description = 'FluteSangam Online Bansuri Tuner & Tanpura Drone: Tune your Indian bamboo flute accurately with real-time frequency detection and tanpura playback.';
        break;
      case 'learn_alankaras':
        title = 'Alankar Exercises & Sargam | FluteSangam';
        description = 'FluteSangam Alankar Exercises & Sargam Drills: Practice finger agility, pitch accuracy, tempo stability, and daily sargam exercises on Indian bamboo flute.';
        break;
      case 'learn_daily_practice':
        title = 'Daily Flute Practice Guide | Improve Tone, Technique & Rhythm | FluteSangam';
        description = 'Master your daily bansuri flute practice routine. Improve tone, breath control, finger coordination, rhythm, scales, and musicality with this complete step-by-step guide.';
        break;
      case 'learn_common_mistakes':
        title = 'Common Flute Mistakes and How to Fix Them | FluteSangam';
        description = 'Learn the most common flute mistakes beginners and intermediate players make, along with practical tips to improve tone, finger placement, breathing, rhythm, and technique.';
        break;
      case 'flute_faq':
        title = 'Flute FAQ | Common Questions & Answers for Flute Learners | FluteSangam';
        description = 'Find answers to common flute questions about learning, practice, bamboo flutes, raagas, breathing, maintenance, and more. Explore the FluteSangam FAQ for helpful guidance';
        break;
      case 'alankar_generator':
        title = 'Interactive Alankar Generator & Practice Engine | FluteSangam';
        description = 'FluteSangam Alankar Generator: Create custom sargam patterns for Indian bamboo flute (Bansuri). Filter by scale, difficulty, pattern type, tempo metronome, and practice daily.';
        break;
      case 'learn_raagas':
        title = 'Learn Ragas & Sargam | FluteSangam Lessons';
        description = 'FluteSangam Learn Ragas, Swaras & Sargam: Master Hindustani and Carnatic ragas on bansuri with detailed scale structures, key phrases, and compositions.';
        break;
      case 'raga_bhoopali':
        title = 'Raag Bhoopali (Bhupali) – Complete Guide for Beginners | FluteSangam';
        description = 'Learn Raag Bhoopali (Bhupali) online with step-by-step swara guides, Aaroh-Avaroh, Pakad, Chalan, practice routine, alankars, and original composition Prabhat Prerna.';
        break;
      case 'raga_durga':
        title = 'Raag Durga: Notes, Aaroh, Avaroh, Pakad, Practice & Composition | FluteSangam';
        description = 'Master Raag Durga on bansuri with step-by-step swara guides, Aaroh-Avaroh, Pakad, Chalan, practice routine, alankars, and original composition Shant Dhara.';
        break;
      case 'raga_yaman':
        title = 'Raag Yaman: Notes, Aaroh, Avaroh, Pakad, Practice & Composition | FluteSangam';
        description = 'Learn Raag Yaman online with step-by-step Tivra Ma swara guides, Aaroh-Avaroh, Pakad, Chalan, 45-min practice schedule, alankars, and original piece Sandhya Prakash.';
        break;
      case 'raga_hamsadhwani':
        title = 'Raag Hamsadhwani: Notes, Aaroh, Avaroh, Pakad, Practice & FluteSangam Original Learning Piece';
        description = 'Learn Raag Hamsadhwani on Indian flute: Notes, Aaroh, Avaroh, Pakad, Chalan, 35-min daily practice schedule, alankars, and original learning piece Udaya Sur.';
        break;
      case 'raga_bilawal':
        title = 'Raag Bilawal: Complete Guide, Notes, Aaroh, Avaroh & Practice | FluteSangam';
        description = 'Master Raag Bilawal on Indian Bamboo Flute (Bansuri). Step-by-step guide with swara playback, Aaroh-Avaroh, Pakad, Chalan, 35-min practice routine, alankars, and practice piece Pratah Sur.';
        break;
      case 'raga_desh':
        title = 'Raag Desh: Complete Guide, Notes, Aaroh, Avaroh & Practice | FluteSangam';
        description = 'Master Raag Desh on Indian Bamboo Flute (Bansuri). Step-by-step guide featuring Swara playback, Pakad, Chalan, original Alankars, and the practice piece Sandhya Vihar.';
        break;
      case 'raga_kafi':
        title = 'Raag Kafi: Complete Guide, Notes, Aaroh, Avaroh & Practice | FluteSangam';
        description = 'Master Raag Kafi on Indian Bamboo Flute (Bansuri). Complete guide with Swara playback, Pakad, Chalan, original Alankars, and the practice piece Komal Sur Lahari.';
        break;
      case 'raga_bageshree':
        title = 'Raag Bageshree: Complete Guide, Notes, Aaroh, Avaroh & Practice | FluteSangam';
        description = 'Master Raag Bageshree on Indian Bamboo Flute (Bansuri). Complete guide with Swara playback, Pakad, Chalan, original Alankars, and the practice piece Nisha Dhwani.';
        break;
      case 'raga_bhimpalasi':
        title = 'Raag Bhimpalasi: Complete Guide, Notes, Aaroh, Avaroh & Practice | FluteSangam';
        description = 'Master Raag Bhimpalasi on Indian Bamboo Flute (Bansuri). Complete guide with Swara playback, Pakad, Chalan, original Alankars, and the practice piece Madhur Vela.';
        break;
      case 'raga_brindavani_sarang':
        title = 'Raag Brindavani Sarang: Complete Guide, Notes, Aaroh, Avaroh & Practice | FluteSangam';
        description = 'Master Raag Brindavani Sarang on Indian Bamboo Flute (Bansuri). Step-by-step guide with Swara playback, Pakad, Chalan, 45-min practice routine, alankars, and practice piece Vrindavan Prabhat.';
        break;
      case 'notation_requests':
        title = 'Song Notation Requests | FluteSangam Sargam';
        description = 'FluteSangam Song Notation Requests & Sargam Music: Request sargam sheet music for Bollywood, devotional, folk, or classical songs for Indian bamboo flute.';
        break;
      case 'community_members':
        title = 'Flutist Directory & Members | FluteSangam';
        description = 'FluteSangam Flutist Directory & Member Profiles: Connect with Indian flute players, bansuri teachers, performers, and fellow learners in our global community.';
        break;
      case 'about_us':
        title = 'About Us - Indian Bamboo Flute | FluteSangam';
        description = 'FluteSangam About Us: Learn about our mission to preserve and promote Indian bamboo flute (bansuri) heritage through accessible education and community.';
        break;
      case 'founder':
        title = 'Aplut – Founder of FluteSangam';
        description = 'Meet Aplut, Founder of FluteSangam. Software engineer & Bansuri practitioner building a global community, free flute practice tools, and raga guides.';
        break;
      case 'contact_us':
        title = 'Contact Us & Support | FluteSangam Community';
        description = 'FluteSangam Contact Us & Support: Reach out to our team for platform support, feedback, song sargam notation requests, or community partnership inquiries.';
        break;
      case 'privacy_policy':
        title = 'Privacy Policy | FluteSangam Flute Community';
        description = 'FluteSangam Official Privacy Policy: Learn how we collect, store, protect, and respect your personal information and user data on our bansuri community.';
        break;
      case 'terms_of_service':
        title = 'Terms of Service & Rules | FluteSangam';
        description = 'FluteSangam Terms of Service & Rules: Read official guidelines, platform rules, and commitments for our global Indian flute and bansuri learning community.';
        break;
      case 'not_found':
        title = '404 - Page Not Found | FluteSangam';
        description = 'The requested page or lesson was not found on FluteSangam. Explore our Indian bamboo flute lessons, raga guides, tuner, alankars, and song notation community.';
        break;
      case 'post-detail':
        if (selectedPost) {
          let pTitle = `${selectedPost.title} | FluteSangam`;
          if (pTitle.length > 58) {
            pTitle = pTitle.substring(0, 55) + '...';
          }
          title = pTitle;

          let rawDesc = selectedPost.description ? selectedPost.description.replace(/\s+/g, ' ').trim() : '';
          if (rawDesc.length < 151) {
            rawDesc = `FluteSangam post on "${selectedPost.title}" by ${selectedPost.authorName}: Read community discussions, audio recitals, and sargam notes from our Indian flute community.`;
          }
          if (rawDesc.length > 160) {
            rawDesc = rawDesc.substring(0, 157) + '...';
          }
          description = rawDesc;
        } else {
          title = 'Post Details & Discussions | FluteSangam';
          description = 'FluteSangam Post Details & Discussions: View community post details, audio recordings, raga performance feedback, song discussions, and member replies.';
        }
        break;
      case 'user-profile':
        title = 'Flutist Member Profile | FluteSangam';
        description = 'FluteSangam Flutist Member Profile: View flutist profile, bansuri scale preferences, skill level, bio, audio recordings, and community contributions.';
        break;
      default:
        break;
    }

    // Set Document Title
    document.title = title;

    // Determine Freshness Timestamps for current view
    let pubDate = '2026-07-26T00:00:00Z';
    let modDate = '2026-07-30T10:00:00Z';

    if (currentView === 'raga_bhoopali' || currentView === 'raga_durga') {
      pubDate = '2026-07-30T00:00:00Z';
      modDate = '2026-07-30T10:00:00Z';
    } else if (currentView === 'post-detail' && selectedPost) {
      if (selectedPost.createdAt) {
        pubDate = selectedPost.createdAt.toDate
          ? selectedPost.createdAt.toDate().toISOString()
          : new Date(selectedPost.createdAt).toISOString();
      }
      if (selectedPost.updatedAt) {
        modDate = selectedPost.updatedAt.toDate
          ? selectedPost.updatedAt.toDate().toISOString()
          : new Date(selectedPost.updatedAt).toISOString();
      } else {
        modDate = pubDate;
      }
    }

    // Helper to safely set or create meta tags
    const setMeta = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', contentVal);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="title"]', 'name', 'title', title);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    
    // Explicit Freshness Meta Tags
    setMeta('meta[name="article:published_time"]', 'name', 'article:published_time', pubDate);
    setMeta('meta[name="article:modified_time"]', 'name', 'article:modified_time', modDate);
    setMeta('meta[property="og:updated_time"]', 'property', 'og:updated_time', modDate);

    // Track dynamic view navigation in Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'G-X3ZN371N8X', {
        page_title: title,
        page_path: '/' + currentView,
      });
    }

    // Dynamic JSON-LD Structured Data Graph for AI SEO & LLM Optimization
    let jsonLdScript = document.getElementById('dynamic-jsonld') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'dynamic-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }

    const organizationSchema = {
      '@type': 'Organization',
      '@id': 'https://flutesangam.com/#organization',
      'name': 'FluteSangam',
      'alternateName': 'Flute Sangam',
      'url': 'https://flutesangam.com/',
      'logo': 'https://flutesangam.com/flutesangam_logo.png'
    };

    let breadcrumbItems = [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://flutesangam.com/' }
    ];

    if (currentView === 'community') {
      breadcrumbItems.push({ '@type': 'ListItem', 'position': 2, 'name': 'Community', 'item': 'https://flutesangam.com/community' });
    } else if (currentView === 'post-detail' && selectedPost) {
      breadcrumbItems.push({ '@type': 'ListItem', 'position': 2, 'name': 'Community', 'item': 'https://flutesangam.com/community' });
      breadcrumbItems.push({ '@type': 'ListItem', 'position': 3, 'name': selectedPost.title, 'item': `https://flutesangam.com/post/${selectedPost.id}` });
    } else if (currentView.startsWith('learn_')) {
      breadcrumbItems.push({ '@type': 'ListItem', 'position': 2, 'name': 'Learn', 'item': 'https://flutesangam.com/learn' });
      breadcrumbItems.push({ '@type': 'ListItem', 'position': 3, 'name': title, 'item': `https://flutesangam.com/learn#${currentView}` });
    } else if (currentView === 'learn_tuner') {
      breadcrumbItems.push({ '@type': 'ListItem', 'position': 2, 'name': 'Bansuri Tuner', 'item': 'https://flutesangam.com/tuner' });
    } else if (currentView === 'flute_faq') {
      breadcrumbItems.push({ '@type': 'ListItem', 'position': 2, 'name': 'Flute FAQ', 'item': 'https://flutesangam.com/faq' });
      if (location.pathname.startsWith('/faq/')) {
        breadcrumbItems.push({ '@type': 'ListItem', 'position': 3, 'name': title, 'item': `https://flutesangam.com${location.pathname}` });
      }
    }

    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbItems
    };

    let primarySchema: any = {
      '@context': 'https://schema.org',
      'inLanguage': 'en',
      'datePublished': pubDate,
      'dateModified': modDate,
    };

    if (currentView === 'post-detail' && selectedPost) {
      primarySchema['@type'] = 'DiscussionForumPosting';
      primarySchema['@id'] = `https://flutesangam.com/post/${selectedPost.id}#posting`;
      primarySchema['headline'] = title;
      primarySchema['description'] = description;
      primarySchema['author'] = {
        '@type': 'Person',
        'name': selectedPost.authorName
      };
      if (selectedPost.imageUrl) {
        primarySchema['image'] = selectedPost.imageUrl;
      }
    } else if (currentView.startsWith('learn_')) {
      primarySchema['@type'] = ['LearningResource', 'HowTo', 'Course'];
      primarySchema['@id'] = `https://flutesangam.com/learn#${currentView}`;
      primarySchema['name'] = title;
      primarySchema['headline'] = title;
      primarySchema['description'] = description;
      primarySchema['educationalLevel'] = 'Beginner to Advanced';
      primarySchema['learningResourceType'] = 'Music Lesson & Sargam Guide';
      primarySchema['provider'] = { '@id': 'https://flutesangam.com/#organization' };
      
      primarySchema['step'] = [
        {
          '@type': 'HowToStep',
          'name': 'Posture & Breathing',
          'text': 'Maintain correct spine posture and diaphragmatic breath control before blowing into the Bansuri.'
        },
        {
          '@type': 'HowToStep',
          'name': 'Finger Placement',
          'text': 'Cover tone holes using the pads of your fingers for airtight seals.'
        },
        {
          '@type': 'HowToStep',
          'name': 'Practice Alankaras',
          'text': 'Practice Sa-Re-Ga-Ma patterns consistently with a metronome to build tone stability.'
        }
      ];

      primarySchema['video'] = {
        '@type': 'VideoObject',
        'name': `${title} - Video Demonstration`,
        'description': `Visual and audio demonstration of ${title} on Indian Bamboo Flute (Bansuri).`,
        'thumbnailUrl': 'https://flutesangam.com/flutesangam_logo.png',
        'uploadDate': pubDate,
        'contentUrl': 'https://flutesangam.com/learn',
        'embedUrl': 'https://flutesangam.com/learn'
      };
    } else {
      primarySchema['@type'] = 'WebPage';
      primarySchema['@id'] = `https://flutesangam.com/#${currentView}`;
      primarySchema['headline'] = title;
      primarySchema['description'] = description;
      primarySchema['image'] = 'https://flutesangam.com/flutesangam_logo.png';
      primarySchema['about'] = {
        '@id': 'https://flutesangam.com/#organization'
      };
    }

    const graphData = {
      '@context': 'https://schema.org',
      '@graph': [
        organizationSchema,
        breadcrumbSchema,
        primarySchema
      ]
    };

    jsonLdScript.textContent = JSON.stringify(graphData);
  }, [currentView, selectedPost, selectedProfileUserId]);


  // Sync URL with view
  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/post/')) {
      const postId = path.split('/')[2];
      if (postId && (currentView !== 'post-detail' || selectedPost?.id !== postId)) {
        const foundPost = posts.find(p => p.id === postId);
        if (foundPost) {
          handleViewChange('post-detail', { postId, post: foundPost }, false);
        } else {
          getPost(postId).then((fetchedPost) => {
            if (fetchedPost) {
              handleViewChange('post-detail', { postId, post: fetchedPost }, false);
            } else {
              handleViewChange('not_found', {}, false);
            }
          });
        }
      }
    } else if (path.startsWith('/profile/')) {
        const userId = path.split('/')[2];
        if (currentView !== 'user-profile' || selectedProfileUserId !== userId) {
            handleViewChange('user-profile', { userId }, false);
        }
    } else if (path === '/privacy' || path === '/privacy-policy') {
        if (currentView !== 'privacy_policy') {
            handleViewChange('privacy_policy', {}, false);
        }
    } else if (path === '/terms' || path === '/terms-of-service') {
        if (currentView !== 'terms_of_service') {
            handleViewChange('terms_of_service', {}, false);
        }
    } else if (path === '/faq' || path.startsWith('/faq/')) {
        if (currentView !== 'flute_faq') {
            handleViewChange('flute_faq', {}, false);
        }
    } else if (path === '/community') {
        if (currentView !== 'community') {
            handleViewChange('community', {}, false);
        }
        navigate('/', { replace: true });
    } else {
        const matchingView = Object.keys(VIEW_URLS).find(v => VIEW_URLS[v as AppView] === path) as AppView;
        const targetView = matchingView || (path === '/' ? 'community' : 'not_found');
        if (targetView && currentView !== targetView) {
            handleViewChange(targetView, {}, false);
        }
    }
  }, [location.pathname, posts]);

  const handleViewChange = (
    view: AppView,
    stateExtra: any = {},
    push = true
  ) => {
    console.log(`handleViewChange called for view: ${view}`);
    
    // Navigate URL
    if (push) {
      let url = VIEW_URLS[view];
      if (view === 'post-detail' && stateExtra.postId) {
        url = `/post/${stateExtra.postId}`;
      } else if (view === 'user-profile' && stateExtra.userId) {
        url = `/profile/${stateExtra.userId}`;
      } else if (view === 'user-profile' && !stateExtra.userId && currentUser) {
        url = `/profile/${currentUser.uid}`;
      }
      if (url && location.pathname !== url) {
        navigate(url);
      }
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (
      view === 'community' || 
      view === 'learn_intro' || 
      view === 'learn_basics' || 
      view === 'learn_choose_flute' || 
      view === 'learn_alankaras' || 
      view === 'learn_raagas' || 
      view === 'raga_bhoopali' ||
      view === 'raga_durga' ||
      view === 'raga_yaman' ||
      view === 'raga_hamsadhwani' ||
      view === 'raga_bilawal' ||
      view === 'raga_desh' ||
      view === 'raga_kafi' ||
      view === 'raga_bageshree' ||
      view === 'raga_bhimpalasi' ||
      view === 'raga_brindavani_sarang' ||
      view === 'community_members' ||
      view === 'about_us' ||
      view === 'founder' ||
      view === 'contact_us' ||
      view === 'notation_requests' ||
      view === 'learn_dashboard' ||
      view === 'not_found'
    ) {
      setSelectedPost(null);
      setSelectedProfileUserId(null);
    } else if (view === 'post-detail') {
      if (stateExtra.post) setSelectedPost(stateExtra.post);
    } else if (view === 'user-profile') {
      if (stateExtra.userId) {
        setSelectedProfileUserId(stateExtra.userId);
      } else if (currentUser) {
        setSelectedProfileUserId(currentUser.uid);
      }
    }
  };

  const handleGoBack = () => {
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else if (currentView.startsWith('learn_') || currentView.startsWith('raga_') || currentView === 'alankar_generator') {
      handleViewChange('learn_dashboard');
    } else {
      handleViewChange('community');
    }
  };

  // Incoming floating notification toast
  const [activeNotification, setActiveNotification] = useState<{
    id: string;
    senderName: string;
    senderPhoto?: string;
    text: string;
    chatId: string;
    targetUser: any;
  } | null>(null);

  const notifiedMessageIdsRef = useRef<Set<string>>(new Set());

  const handleOpenUserProfile = (userId: string) => {
    handleViewChange('user-profile', { userId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChat = (targetUser: { uid: string; displayName: string; username?: string; photoURL?: string }) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setChatTargetUser(targetUser);
    handleViewChange('chats');
  };

  // 1. Initial Auth and database seeding
  useEffect(() => {
    // Seed database if empty first, then subscribe to real-time posts
    const initializeApp = async () => {
      await seedDatabaseIfEmpty();
    };
    initializeApp();

    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Enforce email verification check for password provider logins
        const isPasswordProvider = firebaseUser.providerData.some(p => p.providerId === 'password') || (!firebaseUser.providerData.length && !firebaseUser.emailVerified);
        if (isPasswordProvider && !firebaseUser.emailVerified) {
          await signOut(auth);
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile && firebaseUser.email) {
          profile = await getUserProfileByEmail(firebaseUser.email);
        }

        // If profile is not found immediately, retry to give AuthModal time to save custom user profile
        if (!profile) {
          for (let attempt = 0; attempt < 2; attempt++) {
            await new Promise(r => setTimeout(r, 600));
            profile = await getUserProfile(firebaseUser.uid);
            if (!profile && firebaseUser.email) {
              profile = await getUserProfileByEmail(firebaseUser.email);
            }
            if (profile) break;
          }
        }

        if (profile && (profile.isDeleted || profile.status === 'deleted')) {
          await signOut(auth);
          setCurrentUser(null);
          setLoading(false);
          return;
        }
        if (profile) {
          setCurrentUser({
            ...profile,
            email: profile.email || firebaseUser.email || ''
          });
        } else {
          // If profile document is missing in Firestore (e.g. user deleted from Firestore),
          // sign them out of Firebase Auth so a new profile document is NOT automatically recreated!
          await signOut(auth);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Subscribe to real-time posts
    const unsubscribePosts = subscribeToPosts((loadedPosts) => {
      setPosts(loadedPosts);
    });

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
    };
  }, []);

  // 2. Real-time notifications and unread counts subscription
  useEffect(() => {
    if (!currentUser) {
      setUnreadCount(0);
      return;
    }

    // Subscribe to all users list so we can lookup profiles for notification names
    const unsubscribeUsers = subscribeToAllUsers((users) => {
      setAllUsersList(users);
    });

    // Subscribe to unread messages destined for the current user
    const unsubscribeUnread = subscribeToUnreadMessages(currentUser.uid, (unreadMsgs) => {
      setUnreadCount(unreadMsgs.length);

      // If we are currently in chats view, we don't want to show notifications/toasts
      if (currentView === 'chats') {
        unreadMsgs.forEach(m => notifiedMessageIdsRef.current.add(m.id));
        return;
      }

      // Check if there is any new unread message that hasn't been notified yet
      const newUnread = unreadMsgs.find(m => !notifiedMessageIdsRef.current.has(m.id));
      if (newUnread) {
        // Mark it as notified
        notifiedMessageIdsRef.current.add(newUnread.id);

        // Look up sender's name and photo
        const sender = allUsersList.find(u => u.uid === newUnread.senderId);
        const senderName = sender?.displayName || "Fellow Flutist";
        const senderPhoto = sender?.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix";

        // Show toast
        setActiveNotification({
          id: newUnread.id,
          senderName,
          senderPhoto,
          text: newUnread.imageUrl ? "📷 Sent an image attachment" : newUnread.text,
          chatId: newUnread.chatId,
          targetUser: sender || { uid: newUnread.senderId, displayName: senderName, photoURL: senderPhoto }
        });

        // Automatically hide the notification after 5 seconds
        const timer = setTimeout(() => {
          setActiveNotification(prev => prev?.id === newUnread.id ? null : prev);
        }, 5000);
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeUnread();
    };
  }, [currentUser, currentView, allUsersList.length]);

  // Filter posts based on search query, category, and raga filter
  const filteredPosts = posts.filter(post => {
    // Search match
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      post.title.toLowerCase().includes(searchLower) ||
      post.description.toLowerCase().includes(searchLower) ||
      (post.raga && post.raga.toLowerCase().includes(searchLower)) ||
      post.authorName.toLowerCase().includes(searchLower);

    // Category match
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;

    // Raga match
    const matchesRaga = !activeRagaFilter || post.raga === activeRagaFilter;

    return matchesSearch && matchesCategory && matchesRaga;
  });

  const handleSelectRagaDiscussion = (ragaName: string) => {
    if (activeRagaFilter === ragaName) {
      // Toggle off
      setActiveRagaFilter(null);
    } else {
      setActiveRagaFilter(ragaName);
      setActiveCategory('All'); // Reset category filter to show all discussions for that raga
    }
  };

  const handleOpenCreatePost = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setEditingPost(null);
      setCreatePostModalOpen(true);
    }
  };

  const handleOpenEditPost = (post: Post) => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setEditingPost(post);
      setCreatePostModalOpen(true);
    }
  };

  const handleOpenShare = (post: Post) => {
    setActiveSharePost(post);
    setShareModalOpen(true);
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
  };

  const handleSelectPostById = async (postId: string) => {
    let targetPost = posts.find(p => p.id === postId);
    if (!targetPost) {
      targetPost = (await getPost(postId)) || undefined;
    }
    if (targetPost) {
      handleViewChange('post-detail', { postId: targetPost.id, post: targetPost });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('This post may have been removed or is no longer available.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfbf7] via-[#fff4e6] to-[#fdebd0] pb-24 md:pb-0" id="flutesangam-app-container">
      {/* Navbar Component */}
      <Navbar 
        currentUser={currentUser} 
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onProfileUpdated={(updatedProfile) => setCurrentUser(updatedProfile)}
        currentView={currentView}
        onViewChange={(view) => handleViewChange(view)}
        unreadCount={unreadCount}
        onEditingProfile={setIsNavbarEditingProfile}
        onSelectPost={handleSelectPostById}
      />

      {/* Main Layout Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 flex-1 w-full pb-24 md:pb-12" id="main-content-layout">
        {/* Global Navigation Top Bar for Subpages */}
        {currentView !== 'community' && (
          <div className="mb-3 sm:mb-6 flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-amber-200/80 shadow-xs" id="global-top-back-bar">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-bamboo-950 text-xs sm:text-sm font-bold border border-amber-300/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group shrink-0"
              title="Go back to previous page"
              id="global-back-btn"
            >
              <ArrowLeft className="w-4 h-4 text-amber-700 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleViewChange('community')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-bamboo-900 bg-amber-100/70 hover:bg-amber-200/80 border border-amber-300/60 transition cursor-pointer shrink-0"
                id="global-feed-btn"
                title="Go to Home"
              >
                <Home className="w-3.5 h-3.5 text-amber-700" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleViewChange('flute_faq')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  currentView === 'flute_faq'
                    ? 'text-amber-900 bg-amber-200/90 shadow-2xs'
                    : 'text-amber-950 bg-amber-100/70 hover:bg-amber-200/80 border border-amber-300/60'
                }`}
                id="global-faq-btn"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Flute FAQ</span>
              </button>

              {(currentView.startsWith('learn_') || currentView.startsWith('raga_') || currentView === 'alankar_generator') && (
                <button
                  onClick={() => handleViewChange('learn_dashboard')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-200/80 transition cursor-pointer shrink-0"
                  id="global-learn-hub-btn"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>Learning Hub</span>
                </button>
              )}
            </div>
          </div>
        )}

        <ErrorBoundary>
          <React.Suspense fallback={<ViewFallbackLoader />}>


        {currentView === 'user-profile' ? (
          (selectedProfileUserId || currentUser) ? (
            <UserProfileView
              userId={selectedProfileUserId || currentUser!.uid}
              currentUser={currentUser}
              onBack={() => handleViewChange('community', {}, true)}
              onStartChat={handleStartChat}
              onOpenAuth={() => setAuthModalOpen(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-bamboo-100 shadow-sm max-w-lg mx-auto space-y-3 my-8">
              <User className="w-12 h-12 text-amber-600 mb-1" />
              <h3 className="text-xl font-display font-bold text-bamboo-900">Musician Profile</h3>
              <p className="text-xs text-gray-600 max-w-xs mx-auto">Please sign in to view your profile and contributions.</p>
              <button 
                onClick={() => setAuthModalOpen(true)} 
                className="bg-bamboo-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-bamboo-800 transition shadow-sm cursor-pointer"
              >
                Join / Sign In
              </button>
            </div>
          )
        ) : currentView === 'post-detail' ? (
          selectedPost ? (
            <PostDetailView
              post={posts.find(p => p.id === selectedPost.id) || selectedPost}
              currentUser={currentUser}
              autoFocusComment={window.history.state?.focusComment}
              onBack={() => handleViewChange('community', {}, true)}
              onOpenAuth={() => setAuthModalOpen(true)}
              onOpenShare={handleOpenShare}
              onStartChat={handleStartChat}
              onUserProfileClick={handleOpenUserProfile}
              onEditPost={handleOpenEditPost}
              onOpenImage={(url) => setSelectedImageUrl(url)}
            />
          ) : (
            <div className="frosted-panel rounded-2xl p-12 text-center my-8 bg-white border border-bamboo-100 shadow-xs">
              <div className="w-10 h-10 border-4 border-bamboo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-semibold text-gray-500">Loading post details...</p>
            </div>
          )
        ) : currentView === 'learn_dashboard' ? (
          <LearnDashboard onViewChange={handleViewChange} />
        ) : currentView === 'learn_intro' ? (
          <LearnIntroView onViewChange={handleViewChange} />
        ) : currentView === 'learn_basics' ? (
          <LearnBasicsView onViewChange={handleViewChange} />
        ) : currentView === 'learn_fingering_chart' ? (
          <LearnFingeringChartView onViewChange={handleViewChange} />
        ) : currentView === 'learn_choose_flute' ? (
          <LearnChooseFluteView onViewChange={handleViewChange} />
        ) : currentView === 'learn_tuner' ? (
          <LearnTunerView onViewChange={handleViewChange} />
        ) : currentView === 'learn_alankaras' ? (
          <LearnAlankarasView onViewChange={handleViewChange} />
        ) : currentView === 'learn_daily_practice' ? (
          <DailyPracticeGuideView onViewChange={handleViewChange} />
        ) : currentView === 'learn_common_mistakes' ? (
          <CommonFluteMistakesView onViewChange={handleViewChange} />
        ) : currentView === 'flute_faq' ? (
          <FluteFaqView onViewChange={handleViewChange} />
        ) : currentView === 'alankar_generator' ? (
          <AlankarGeneratorView currentUser={currentUser} />
        ) : currentView === 'learn_raagas' ? (
          <LearnRaagasView onViewChange={handleViewChange} />
        ) : currentView === 'raga_bhoopali' ? (
          <RagaBhoopaliView onViewChange={handleViewChange} />
        ) : currentView === 'raga_durga' ? (
          <RagaDurgaView onViewChange={handleViewChange} />
        ) : currentView === 'raga_yaman' ? (
          <RagaYamanView onViewChange={handleViewChange} />
        ) : currentView === 'raga_hamsadhwani' ? (
          <RagaHamsadhwaniView onViewChange={handleViewChange} />
        ) : currentView === 'raga_bilawal' ? (
          <RagaBilawalView onViewChange={handleViewChange} />
        ) : currentView === 'raga_desh' ? (
          <RagaDeshView onViewChange={handleViewChange} />
        ) : currentView === 'raga_kafi' ? (
          <RagaKafiView onViewChange={handleViewChange} />
        ) : currentView === 'raga_bageshree' ? (
          <RagaBageshreeView onViewChange={handleViewChange} />
        ) : currentView === 'raga_bhimpalasi' ? (
          <RagaBhimpalasiView onViewChange={handleViewChange} />
        ) : currentView === 'raga_brindavani_sarang' ? (
          <RagaBrindavaniSarangView onViewChange={handleViewChange} />
        ) : currentView === 'about_us' ? (
          <AboutUsView onViewChange={handleViewChange} />
        ) : currentView === 'founder' ? (
          <FounderView onViewChange={handleViewChange} />
        ) : currentView === 'contact_us' ? (
          <ContactUsView onBackToCommunity={() => handleViewChange('community')} />
        ) : currentView === 'privacy_policy' ? (
          <PrivacyPolicyView onBackToCommunity={() => handleViewChange('community')} />
        ) : currentView === 'terms_of_service' ? (
          <TermsOfServiceView onBackToCommunity={() => handleViewChange('community')} />
        ) : currentView === 'not_found' ? (
          <NotFoundView 
            onViewChange={handleViewChange} 
            onSearchSubmit={(q) => {
              setSearchQuery(q);
              handleViewChange('community');
            }} 
          />
        ) : currentView === 'notation_requests' ? (
          <NotationRequestsView currentUser={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />
        ) : currentView === 'community_members' ? (
          <MembersView 
            currentUser={currentUser} 
            onUserProfileClick={handleOpenUserProfile} 
            onStartChat={handleStartChat}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        ) : currentView === 'chats' ? (
          currentUser ? (
            <div className="space-y-5">
              <div className="hidden md:flex items-center justify-between bg-white/70 backdrop-blur-md p-4.5 rounded-2xl border border-bamboo-100/60 shadow-3xs">
                <div>
                  <h2 className="text-sm font-bold text-bamboo-900 font-display flex items-center gap-1.5">
                    <MessageSquare className="w-5 h-5 text-amber-600 animate-pulse" />
                    Sadhaka Conversation Sangam
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">Request composition keys, raw feedback reviews, or discuss bansuri blowing styles with fellow learners.</p>
                </div>
                <button
                  onClick={() => {
                    handleViewChange('community');
                  }}
                  className="px-4 py-2 bg-bamboo-50 hover:bg-bamboo-100 border border-bamboo-100 text-bamboo-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Back to Feed
                </button>
              </div>
              
              <ChatSection
                currentUser={currentUser}
                onProfileUpdated={(updatedProfile) => setCurrentUser(updatedProfile)}
                initialTargetUser={chatTargetUser}
                onClearInitialTargetUser={() => setChatTargetUser(null)}
                onOpenImage={(url) => setSelectedImageUrl(url)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-bamboo-100 shadow-sm max-w-lg mx-auto space-y-3 my-8">
              <MessageSquare className="w-12 h-12 text-amber-600 mb-1" />
              <h3 className="text-xl font-display font-bold text-bamboo-900">Sangam Direct Messages</h3>
              <p className="text-xs text-gray-600 max-w-xs mx-auto">Please sign in to chat directly with fellow flutists and gurus.</p>
              <button 
                onClick={() => setAuthModalOpen(true)} 
                className="bg-bamboo-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-bamboo-800 transition shadow-sm cursor-pointer"
              >
                Join / Sign In
              </button>
            </div>
          )
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {/* Overview & Purpose Section for Google AdSense & Visitors */}
            <HomepageOverview 
              onViewChange={handleViewChange}
              onOpenAuth={() => setAuthModalOpen(true)}
              onOpenCreatePost={handleOpenCreatePost}
              currentUser={currentUser}
            />

            {/* Recent Discussions & Community Feed Section */}
            <div id="recent-discussions-section" className="space-y-4 pt-4 border-t border-bamboo-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bamboo-100 pb-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    Sadhaka Sangam Feed
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-bamboo-950">
                    Recent Discussions &amp; Community Recitals
                  </h2>
                  <p className="text-xs text-gray-600">
                    Explore live questions, performance videos, audio recitals, and raga discussions from flutists around the world.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* LEFT AREA: Search, Filters, and Posts Feed */}
                <div className="md:col-span-8 space-y-4 block" id="left-feed-container">
                  {/* Search and Filters panel */}
                  <div className="frosted-panel rounded-2xl p-4 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Search field */}
                      <div className="flex-1 flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200/60 focus-within:ring-2 focus-within:ring-bamboo-600 focus-within:border-transparent transition-all">
                        <Search className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search compositions, ragas, keys, reviews, or gurus..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-transparent text-xs text-gray-700 focus:outline-none placeholder-gray-400"
                        />
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="text-[10px] text-gray-400 hover:text-gray-600 font-semibold uppercase pr-1"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Create post trigger for desktop */}
                      {currentUser && (
                        <button
                          onClick={handleOpenCreatePost}
                          className="py-2 px-4 bg-bamboo-700 hover:bg-bamboo-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-3xs shrink-0 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>New Post</span>
                        </button>
                      )}
                    </div>

                    {/* Filtering bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-gray-100">
                      <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                        <Filter className="w-3.5 h-3.5 text-bamboo-700 shrink-0 hidden sm:block" />
                        {['All', 'Question', 'Performance', 'Tutorial', 'Raga Discussion', 'Review'].map((cat) => {
                          const isSelected = activeCategory === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setActiveCategory(cat);
                                setActiveRagaFilter(null);
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-bamboo-100 text-bamboo-800 border border-bamboo-200" 
                                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"
                              }`}
                            >
                              {cat === 'Raga Discussion' ? 'Ragas' : cat === 'Question' ? 'Questions' : cat}
                            </button>
                          );
                        })}
                      </div>

                      {/* Reset active raga indicator if any */}
                      {activeRagaFilter && (
                        <div className="flex items-center justify-between sm:justify-start bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-lg text-xs font-semibold">
                          <span className="flex items-center gap-1">
                            <Music className="w-3.5 h-3.5 text-amber-600" />
                            Raga: {activeRagaFilter}
                          </span>
                          <button 
                            onClick={() => setActiveRagaFilter(null)}
                            className="ml-2 text-[10px] text-amber-700 hover:text-amber-950 font-bold uppercase cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Posts List rendering */}
                  <div className="space-y-5" id="posts-feed-container">
                    {loading ? (
                      <div className="frosted-panel rounded-2xl p-12 text-center" id="feed-loading-indicator">
                        <div className="w-10 h-10 border-4 border-bamboo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm font-semibold text-gray-500">Connecting to FluteSangam...</p>
                      </div>
                    ) : filteredPosts.length === 0 ? (
                      <div className="frosted-panel rounded-2xl p-12 text-center space-y-3" id="feed-empty-state">
                        <div className="p-4 bg-bamboo-50 rounded-full w-14 h-14 mx-auto text-bamboo-600 flex items-center justify-center">
                          <Compass className="w-7 h-7" />
                        </div>
                        <h3 className="font-display font-bold text-gray-800 text-base">No Matching Posts Found</h3>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                          We couldn't find any posts matching your search criteria. Be the first to share a recital, ask a question, or discuss this raga!
                        </p>
                        {currentUser && (
                          <button
                            onClick={handleOpenCreatePost}
                            className="px-4 py-2 bg-bamboo-700 text-white text-xs font-bold rounded-xl hover:bg-bamboo-600 transition cursor-pointer"
                          >
                            Share First Post
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        {filteredPosts.slice(0, visiblePostsCount).map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            currentUser={currentUser}
                            onOpenAuth={() => setAuthModalOpen(true)}
                            onOpenShare={handleOpenShare}
                            onStartChat={handleStartChat}
                            onUserProfileClick={handleOpenUserProfile}
                            onPostClick={(clickedPost, focusComment) => {
                              handleViewChange('post-detail', { postId: clickedPost.id, post: clickedPost, focusComment });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            onEditPost={handleOpenEditPost}
                            onOpenImage={(url) => setSelectedImageUrl(url)}
                          />
                        ))}

                        {filteredPosts.length > visiblePostsCount && (
                          <div className="flex flex-col items-center justify-center pt-4 pb-2 text-center" id="load-more-posts-container">
                            <button
                              onClick={() => setVisiblePostsCount(prev => prev + 6)}
                              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
                              id="load-more-posts-btn"
                            >
                              <ChevronDown className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
                              <span>Load More Posts ({filteredPosts.length - visiblePostsCount} remaining)</span>
                            </button>
                            <span className="text-[11px] text-gray-500 font-medium mt-2">
                              Showing {Math.min(visiblePostsCount, filteredPosts.length)} of {filteredPosts.length} posts
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDEBAR: Raga Guide & Tips */}
                <div className="md:col-span-4 space-y-6 block" id="right-sidebar-ragaguide">
                  <React.Suspense fallback={<ViewFallbackLoader />}>
                    <RagaGuide 
                      onSelectRagaDiscussion={handleSelectRagaDiscussion}
                      activeRagaFilter={activeRagaFilter}
                    />
                  </React.Suspense>
                  <FlutePracticeFaqSection onViewChange={handleViewChange} />
                </div>
              </div>
            </div>
          </div>
        )}
          </React.Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="bg-bamboo-800 text-bamboo-200 text-xs border-t border-bamboo-700/50 mt-12 py-10 pb-20 md:pb-10" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-bamboo-700/60 pb-6">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); handleViewChange('community'); }}
              className="cursor-pointer group flex items-center gap-3 focus:outline-none"
              title="FluteSangam - Home"
              id="footer-brand-logo-btn"
            >
              <img 
                src="/flutesangam_without_tagline_compressed.png"
                alt="FluteSangam Logo" 
                width="80"
                height="80"
                className="h-16 sm:h-20 w-16 sm:w-20 object-contain drop-shadow-md group-hover:scale-105 transition-transform shrink-0" 
                loading="lazy"
              />
              <div>
                <span className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight block">
                  Flute<span className="text-amber-400">Sangam</span>
                </span>
                <span className="text-xs text-bamboo-300 block font-sans">
                  Indian Flute &amp; Bansuri Learning Community
                </span>
              </div>
            </a>

            <a
              href="https://www.reddit.com/r/FluteSangam/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg text-sm tracking-wide hover:scale-105"
            >
              Join Our Community on Reddit
            </a>
          </div>

          {/* Internal Links Sitemap Grid for SEO */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs pt-2">
            
            <div className="space-y-2">
              <h3 className="font-display font-bold text-amber-300 uppercase tracking-wider text-xs">
                Flute Learning
              </h3>
              <ul className="space-y-1.5 text-bamboo-200">
                <li>
                  <a href="/learn" onClick={(e) => { e.preventDefault(); handleViewChange('learn_dashboard'); }} className="hover:text-amber-300 transition">
                    Learning Hub Overview
                  </a>
                </li>
                <li>
                  <a href="/learn/intro" onClick={(e) => { e.preventDefault(); handleViewChange('learn_intro'); }} className="hover:text-amber-300 transition">
                    Introduction to Bansuri
                  </a>
                </li>
                <li>
                  <a href="/learn/choose-flute" onClick={(e) => { e.preventDefault(); handleViewChange('learn_choose_flute'); }} className="hover:text-amber-300 transition">
                    Choose Right Flute
                  </a>
                </li>
                <li>
                  <a href="/learn/basics" onClick={(e) => { e.preventDefault(); handleViewChange('learn_basics'); }} className="hover:text-amber-300 transition">
                    Bansuri Basics &amp; Fingering
                  </a>
                </li>
                <li>
                  <a href="/faq" onClick={(e) => { e.preventDefault(); handleViewChange('flute_faq'); }} className="hover:text-amber-300 transition text-amber-300 font-semibold">
                    Flute FAQ &amp; Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-amber-300 uppercase tracking-wider text-xs">
                Practice Tools
              </h3>
              <ul className="space-y-1.5 text-bamboo-200">
                <li>
                  <a href="/learn/alankaras" onClick={(e) => { e.preventDefault(); handleViewChange('learn_alankaras'); }} className="hover:text-amber-300 transition">
                    Alankar Sargam Drills
                  </a>
                </li>
                <li>
                  <a href="/learn/daily-practice-guide" onClick={(e) => { e.preventDefault(); handleViewChange('learn_daily_practice'); }} className="hover:text-amber-300 transition text-amber-300 font-semibold">
                    Daily Flute Practice Guide
                  </a>
                </li>
                <li>
                  <a href="/alankar-generator" onClick={(e) => { e.preventDefault(); handleViewChange('alankar_generator'); }} className="hover:text-amber-300 transition font-bold text-amber-300">
                    Alankar Generator Engine
                  </a>
                </li>
                <li>
                  <a href="/tuner" onClick={(e) => { e.preventDefault(); handleViewChange('learn_tuner'); }} className="hover:text-amber-300 transition">
                    Online Flute Tuner (440Hz)
                  </a>
                </li>
                <li>
                  <a href="/notations" onClick={(e) => { e.preventDefault(); handleViewChange('notation_requests'); }} className="hover:text-amber-300 transition">
                    Song Notation Requests
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-amber-300 uppercase tracking-wider text-xs">
                Community
              </h3>
              <ul className="space-y-1.5 text-bamboo-200">
                <li>
                  <a href="/" onClick={(e) => { e.preventDefault(); handleViewChange('community'); }} className="hover:text-amber-300 transition">
                    Sadhana Feed &amp; Posts
                  </a>
                </li>
                <li>
                  <a href="/members" onClick={(e) => { e.preventDefault(); handleViewChange('community_members'); }} className="hover:text-amber-300 transition">
                    Flutists Directory
                  </a>
                </li>
                <li>
                  <a href="/chats" onClick={(e) => { e.preventDefault(); handleViewChange('chats'); }} className="hover:text-amber-300 transition">
                    Direct Messages &amp; Chat
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-amber-300 uppercase tracking-wider text-xs">
                Legal &amp; Support
              </h3>
              <ul className="space-y-1.5 text-bamboo-200">
                <li>
                  <a href="/about" onClick={(e) => { e.preventDefault(); handleViewChange('about_us'); }} className="hover:text-amber-300 transition">
                    About FluteSangam
                  </a>
                </li>
                <li>
                  <a href="/founder" onClick={(e) => { e.preventDefault(); handleViewChange('founder'); }} className="hover:text-amber-300 transition">
                    Founder Story (Aplut)
                  </a>
                </li>
                <li>
                  <a href="/contact" onClick={(e) => { e.preventDefault(); handleViewChange('contact_us'); }} className="hover:text-amber-300 transition">
                    Contact Us &amp; Support
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); handleViewChange('privacy_policy'); }} className="hover:text-amber-300 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms-of-service" onClick={(e) => { e.preventDefault(); handleViewChange('terms_of_service'); }} className="hover:text-amber-300 transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-bamboo-700/60 text-center space-y-2">
            <p className="text-xs text-bamboo-300/80 max-w-xl mx-auto leading-relaxed">
              FluteSangam is a free learning platform for Indian Bansuri and flute players. Learn step-by-step with beginner guides, alankars, ragas, fingering charts, practice routines, and connect with flute learners worldwide
            </p>
            <p className="text-[11px] font-medium text-amber-300/90 tracking-wide">
              Free learning resources • Community driven • Made for Flute enthusiasts worldwide
            </p>
            <p className="text-[11px] text-bamboo-400">
              © {new Date().getFullYear()} FluteSangam. All rights reserved.
            </p>
            <p className="text-[11px] text-bamboo-500 font-medium">
              Designed &amp; Developed by Aplut
            </p>
          </div>

        </div>
      </footer>

      {/* MODALS RENDER SECTION */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <ErrorBoundary>
        <React.Suspense fallback={null}>
          {currentUser && createPostModalOpen && (
            <CreatePostModal
              isOpen={createPostModalOpen}
              onClose={() => {
                setCreatePostModalOpen(false);
                setEditingPost(null);
              }}
              currentUser={currentUser}
              postToEdit={editingPost}
            />
          )}

          {shareModalOpen && (
            <ShareModal
              isOpen={shareModalOpen}
              onClose={() => {
                setShareModalOpen(false);
                setActiveSharePost(null);
              }}
              post={activeSharePost}
            />
          )}

          {selectedImageUrl && <ImageModal imageUrl={selectedImageUrl} onClose={() => setSelectedImageUrl(null)} />}

          <FluteSangamChatbot 
            onViewChange={handleViewChange}
            isHidden={authModalOpen || createPostModalOpen || shareModalOpen || isNavbarEditingProfile || !!editingPost || currentView === 'learn_tuner' || currentView === 'notation_requests'}
            onOpenChange={setIsChatbotOpen}
          />

          <ScrollToTopButton 
            isHidden={authModalOpen || createPostModalOpen || shareModalOpen || isNavbarEditingProfile || !!editingPost || currentView === 'learn_tuner' || currentView === 'notation_requests' || isChatbotOpen}
          />
        </React.Suspense>
      </ErrorBoundary>

      {/* Floating Real-Time Notifications Toast */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200 shadow-xl overflow-hidden flex items-start gap-3 p-4"
            id="floating-message-notification-toast"
          >
            <div className="relative shrink-0 mt-0.5">
              <img
                src={activeNotification.senderPhoto}
                alt={activeNotification.senderName}
                className="w-10 h-10 rounded-full object-cover border border-amber-300 shadow-3xs"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-white p-0.5 rounded-full border border-white">
                <Bell className="w-2.5 h-2.5 animate-bounce" />
              </span>
            </div>
            
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="font-bold text-[11px] text-gray-800 leading-none">
                New Message from {activeNotification.senderName}
              </h4>
              <p className="text-[11px] text-gray-500 truncate leading-relaxed">
                {activeNotification.text}
              </p>
              
              <div className="flex items-center gap-2 pt-2.5">
                <button
                  onClick={() => {
                    handleStartChat(activeNotification.targetUser);
                    setActiveNotification(null);
                  }}
                  className="px-3.5 py-1 bg-bamboo-700 hover:bg-bamboo-800 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition cursor-pointer shadow-3xs"
                >
                  Reply
                </button>
                <button
                  onClick={() => setActiveNotification(null)}
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-500 font-semibold text-[10px] uppercase rounded-lg transition cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveNotification(null)}
              className="text-gray-400 hover:text-gray-600 shrink-0 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <MobileBottomNav
        currentView={currentView}
        onViewChange={handleViewChange}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        unreadCount={unreadCount}
        isHidden={authModalOpen || createPostModalOpen || shareModalOpen || isNavbarEditingProfile || !!editingPost || !!selectedImageUrl}
      />
    </div>
  );
}
