import React from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Music, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  MessageSquare,
  ShieldCheck,
  Radio,
  Sliders,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post, UserProfile, AppView } from '../types';
import PostCard from './PostCard';
import RagaGuide from './RagaGuide';
import FlutePracticeFaqSection from './FlutePracticeFaqSection';
import { VIEW_URLS } from '../routes';

interface CommunityFeedViewProps {
  posts: Post[];
  loading: boolean;
  currentUser: UserProfile | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeRagaFilter: string | null;
  setActiveRagaFilter: (raga: string | null) => void;
  visiblePostsCount: number;
  setVisiblePostsCount: React.Dispatch<React.SetStateAction<number>>;
  onOpenAuth: () => void;
  onOpenCreatePost: () => void;
  onOpenShare: (post: Post) => void;
  onStartChat: (targetUser: { uid: string; displayName: string; username?: string; photoURL?: string }) => void;
  onPostClick: (post: Post, focusComment?: boolean) => void;
  onUserProfileClick: (userId: string) => void;
  onEditPost: (post: Post) => void;
  onDeletePost?: (postId: string) => void;
  onOpenImage: (imageUrl: string) => void;
  onViewChange: (view: AppView) => void;
  onSelectRagaDiscussion?: (ragaName: string) => void;
}

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({
  posts,
  loading,
  currentUser,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  activeRagaFilter,
  setActiveRagaFilter,
  visiblePostsCount,
  setVisiblePostsCount,
  onOpenAuth,
  onOpenCreatePost,
  onOpenShare,
  onStartChat,
  onPostClick,
  onUserProfileClick,
  onEditPost,
  onDeletePost,
  onOpenImage,
  onViewChange,
  onSelectRagaDiscussion
}) => {
  React.useEffect(() => {
    document.title = 'Flute Community & Practice Discussions | FluteSangam';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Connect with flute and bansuri players worldwide. Share practice recordings, ask questions, discuss flute playing and classical ragas, and receive feedback.');
    }
  }, []);

  // Filter posts based on category, raga, and search query
  const filteredPosts = posts.filter(post => {
    if (activeCategory !== 'All' && post.category !== activeCategory) {
      return false;
    }
    if (activeRagaFilter && post.raga !== activeRagaFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = (post.title || '').toLowerCase().includes(q);
      const descMatch = (post.description || '').toLowerCase().includes(q);
      const ragaMatch = (post.raga || '').toLowerCase().includes(q);
      const authorMatch = (post.authorName || '').toLowerCase().includes(q);
      const categoryMatch = (post.category || '').toLowerCase().includes(q);
      return titleMatch || descMatch || ragaMatch || authorMatch || categoryMatch;
    }
    return true;
  });

  const categories = ['All', 'Question', 'Performance', 'Tutorial', 'Raga Discussion', 'Review'];

  return (
    <div className="space-y-6 sm:space-y-8 font-sans antialiased text-slate-800 pb-16">
      {/* 1. Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-[11px] sm:text-xs font-semibold text-bamboo-800/80 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <Link 
          to="/" 
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey) {
              e.preventDefault();
              onViewChange('home');
            }
          }}
          className="hover:text-amber-700 transition shrink-0"
        >
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-bamboo-400 shrink-0" />
        <span className="text-amber-900 font-bold truncate">Flute Community &amp; Practice Discussions</span>
      </nav>

      {/* 2. Hero Banner */}
      <header className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-bamboo-950 via-bamboo-900 to-amber-950 text-white relative overflow-hidden shadow-md border border-amber-900/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>Global Bansuri Community</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display">
              Flute Community &amp; Practice Discussions
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-xl">
              Connect with flute and bansuri players worldwide. Share practice recordings, ask questions, discuss flute playing and classical ragas, and receive feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={currentUser ? onOpenCreatePost : onOpenAuth}
              className="py-2.5 px-5 bg-amber-400 hover:bg-amber-300 text-bamboo-950 font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Post</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Grid: Posts Feed (Left) & Sidebar (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Search, Filters & Posts */}
        <div className="md:col-span-8 space-y-5" id="left-feed-container">
          
          {/* Search and Filters panel */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search field */}
              <div className="flex-1 flex items-center space-x-2 bg-sand-50/80 px-3.5 py-2.5 rounded-xl border border-amber-200/60 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search discussions, ragas, techniques, or members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none placeholder-slate-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-bold uppercase pr-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Create post button */}
              <button
                onClick={currentUser ? onOpenCreatePost : onOpenAuth}
                className="hidden sm:flex py-2.5 px-4 bg-bamboo-700 hover:bg-bamboo-600 text-white text-xs font-bold rounded-xl transition items-center justify-center space-x-1.5 shadow-3xs shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Post</span>
              </button>
            </div>

            {/* Filtering Categories */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-amber-100">
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                <Filter className="w-3.5 h-3.5 text-bamboo-700 shrink-0 hidden sm:block mr-1" />
                {categories.map((cat) => {
                  const isSelected = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setActiveRagaFilter(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-amber-600 text-white shadow-xs" 
                          : "bg-amber-50/70 text-slate-600 hover:bg-amber-100 hover:text-amber-900 border border-amber-200/50"
                      }`}
                    >
                      {cat === 'Raga Discussion' ? 'Ragas' : cat === 'Question' ? 'Questions' : cat}
                    </button>
                  );
                })}
              </div>

              {/* Active raga badge if selected */}
              {activeRagaFilter && (
                <div className="flex items-center justify-between sm:justify-start bg-amber-100 border border-amber-300 text-amber-950 px-3 py-1 rounded-xl text-xs font-semibold shrink-0">
                  <span className="flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-amber-700" />
                    Raga: {activeRagaFilter}
                  </span>
                  <button 
                    onClick={() => setActiveRagaFilter(null)}
                    className="ml-2 text-[10px] text-amber-800 hover:text-amber-950 font-bold uppercase cursor-pointer"
                  >
                    × Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Posts List rendering */}
          <div className="space-y-4 min-h-[450px]" id="posts-feed-container">
            {loading ? (
              <div className="space-y-4" id="feed-loading-indicator">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-2xs animate-pulse space-y-3 min-h-[180px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-200/60 rounded-full shrink-0"></div>
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 bg-amber-200/60 rounded-md w-1/3"></div>
                        <div className="h-2.5 bg-amber-100/80 rounded-md w-1/4"></div>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="h-3.5 bg-amber-200/50 rounded-md w-full"></div>
                      <div className="h-3.5 bg-amber-200/40 rounded-md w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-amber-200/80 shadow-2xs space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                    <MessageSquare className="w-7 h-7 text-amber-700" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-slate-800 text-lg">Community Discussions &amp; Sadhana Feed</h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                      Connect with fellow flute and bansuri practitioners. Share recitals, ask technical questions on lip placement, discuss classical ragas, and receive feedback from experienced players.
                    </p>
                  </div>
                  <button
                    onClick={currentUser ? onOpenCreatePost : onOpenAuth}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Start a New Discussion</span>
                  </button>
                </div>

                {/* Educational Topics Overview */}
                <div className="bg-sand-50/70 rounded-2xl p-6 border border-amber-200/60 space-y-4">
                  <h4 className="font-bold text-bamboo-950 text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    Popular Discussion &amp; Learning Categories
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-white rounded-xl border border-amber-200/70 space-y-1">
                      <strong className="text-bamboo-900 font-bold block">1. Embouchure &amp; Tone Refinement</strong>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Tips for blowing angle, lips positioning on blowhole, producing clean upper octave notes, and eliminating airy or whistling sounds.
                      </p>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-amber-200/70 space-y-1">
                      <strong className="text-bamboo-900 font-bold block">2. Classical Raga Bandishes &amp; Sargam</strong>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Explore Aaroh, Avroh, Pakad, and Chalan for popular Ragas like Yaman, Bhoopali, Desh, Kafi, and Bhairav with fellow learners.
                      </p>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-amber-200/70 space-y-1">
                      <strong className="text-bamboo-900 font-bold block">3. Flute Scale Selection &amp; Maintenance</strong>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Advice on choosing C Medium vs. E/G Bass flutes, bamboo oiling routines, thread binding, and protecting instruments from temperature changes.
                      </p>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-amber-200/70 space-y-1">
                      <strong className="text-bamboo-900 font-bold block">4. Daily Sadhana &amp; Alankar Riyaz</strong>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Structuring daily practice sessions with long-note breath holding, metronome tempo progression, and finger speed drills.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {filteredPosts.slice(0, visiblePostsCount).map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onOpenAuth={onOpenAuth}
                    onOpenShare={onOpenShare}
                    onStartChat={onStartChat}
                    onUserProfileClick={onUserProfileClick}
                    onPostClick={onPostClick}
                    onEditPost={onEditPost}
                    onDeletePost={onDeletePost}
                    onOpenImage={onOpenImage}
                  />
                ))}

                {/* Pagination Load More */}
                {filteredPosts.length > visiblePostsCount && (
                  <div className="flex flex-col items-center justify-center pt-4 pb-2 text-center" id="load-more-posts-container">
                    <button
                      onClick={() => setVisiblePostsCount(prev => prev + 10)}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
                      id="load-more-posts-btn"
                    >
                      <ChevronDown className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
                      <span>Load More Discussions ({filteredPosts.length - visiblePostsCount} remaining)</span>
                    </button>
                    <span className="text-[11px] text-slate-500 font-medium mt-2">
                      Showing {Math.min(visiblePostsCount, filteredPosts.length)} of {filteredPosts.length} posts
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (Raga Guide & Quick Tools) */}
        <aside className="md:col-span-4 space-y-6 block min-h-[450px]" id="right-sidebar-community">
          
          {/* Community Guidelines Card */}
          <div className="bg-gradient-to-br from-amber-50 to-sand-100 p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
              <h3 className="font-bold text-amber-950 text-sm">Community Guidelines</h3>
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>Constructive feedback: encourage beginners and share practical embouchure / fingering tips.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>Both classical bandishes and light / film / devotional songs are welcome.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>Mention your flute key (e.g. C Medium, E Bass) when sharing recitals or recordings.</span>
              </li>
            </ul>
          </div>

          {/* Quick Practice Tools Card */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-600" />
              <span>Interactive Practice Tools</span>
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/tuner"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    onViewChange('learn_tuner');
                  }
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/60 font-semibold text-amber-950 transition group"
              >
                <span>Online Flute Tuner (440Hz)</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/alankar-generator"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    onViewChange('alankar_generator');
                  }
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/60 font-semibold text-amber-950 transition group"
              >
                <span>Alankar Practice Generator</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/learn/fingering-chart"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    onViewChange('learn_fingering_chart');
                  }
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/60 font-semibold text-amber-950 transition group"
              >
                <span>Interactive Fingering Chart</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Raga Guide component */}
          <RagaGuide 
            onSelectRagaDiscussion={(ragaName) => {
              if (onSelectRagaDiscussion) {
                onSelectRagaDiscussion(ragaName);
              } else {
                setActiveRagaFilter(ragaName);
              }
            }}
            activeRagaFilter={activeRagaFilter}
            onViewChange={onViewChange}
          />

          {/* FAQ Section */}
          <FlutePracticeFaqSection onViewChange={onViewChange} />
        </aside>

      </div>
    </div>
  );
};

export default CommunityFeedView;
