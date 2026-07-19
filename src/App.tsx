import React, { useState, useEffect, useRef } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { seedDatabaseIfEmpty, subscribeToPosts, getUserProfile, subscribeToUnreadMessages, subscribeToAllUsers } from './lib/db';
import { UserProfile, Post } from './types';
import { motion, AnimatePresence } from 'motion/react';

// Subcomponents
import Navbar from './components/Navbar';
import RagaGuide from './components/RagaGuide';
import AuthModal from './components/AuthModal';
import CreatePostModal from './components/CreatePostModal';
import ShareModal from './components/ShareModal';
import PostCard from './components/PostCard';
import ChatSection from './components/ChatSection';
import PostDetailView from './components/PostDetailView';
import UserProfileView from './components/UserProfileView';

// Icons
import { 
  Search, Plus, Sparkles, HelpCircle, Compass, 
  BookOpen, Video, Info, ArrowUpRight, Music, Filter, CheckCircle2, MessageSquare, Bell, X
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeRagaFilter, setActiveRagaFilter] = useState<string | null>(null);
  
  // Active Tab for mobile (Feed vs Raga Sadhana vs Quick Tips vs Chats)
  const [mobileTab, setMobileTab] = useState<'feed' | 'ragas' | 'chats' | 'tips'>('feed');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeSharePost, setActiveSharePost] = useState<Post | null>(null);

  // View Management ('community' view with posts vs dedicated 'chats' dashboard vs 'post-detail' page vs 'user-profile' page)
  const [currentView, setCurrentView] = useState<'community' | 'chats' | 'post-detail' | 'user-profile'>('community');
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
    setSelectedProfileUserId(userId);
    setCurrentView('user-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChat = (targetUser: { uid: string; displayName: string; username?: string; photoURL?: string }) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setChatTargetUser(targetUser);
    setCurrentView('chats');
    setMobileTab('chats'); // ensure mobile also transitions seamlessly
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
        const profile = await getUserProfile(firebaseUser.uid);
        setCurrentUser(profile);
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
        const senderPhoto = sender?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

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
      setMobileTab('feed'); // Force mobile view back to feed
    }
  };

  const handleOpenCreatePost = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfbf7] via-[#fff4e6] to-[#fdebd0]" id="flutesangam-app-container">
      {/* Navbar Component */}
      <Navbar 
        currentUser={currentUser} 
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onProfileUpdated={(updatedProfile) => setCurrentUser(updatedProfile)}
        currentView={currentView}
        onViewChange={setCurrentView}
        unreadCount={unreadCount}
      />

      {/* Hero Welcome Banner */}
      {currentView === 'community' && (
        <section className="bg-gradient-to-br from-bamboo-800 via-bamboo-700 to-bamboo-600 text-white relative overflow-hidden shadow-sm" id="hero-banner">
          {/* Abstract design vector accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-bamboo-600/30 rounded-full blur-2xl -ml-20 -mb-20"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3.5 text-center md:text-left">
              <span className="inline-flex items-center text-[10px] font-bold tracking-widest text-yellow-300 uppercase bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Global Bansuri Mandali
              </span>
              <h2 className="text-2xl sm:text-3.5xl font-extrabold font-display leading-tight tracking-tight">
                An Oasis for Indian Flute & Bansuri Sadhakas
              </h2>
              <p className="text-xs sm:text-sm text-bamboo-100 leading-relaxed max-w-xl font-medium">
                Join a warm, supportive community of flute practitioners. Share raw recitals, demystify classical ragas, exchange honest flute reviews, and find expert tips to master your blow.
              </p>
            </div>

            {/* Core Call To Action */}
            <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/10 w-full md:w-80 shrink-0 shadow-lg space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-yellow-300">Ready to Share Your Sadhana?</h4>
                <p className="text-[11px] text-bamboo-100 font-medium">Publish your flute practice, reviews, or query today</p>
              </div>
              
              <button
                onClick={handleOpenCreatePost}
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-bamboo-900 font-bold text-xs rounded-xl transition shadow-xs tracking-wider uppercase flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Share Performance</span>
              </button>
              
              {!currentUser && (
                <p className="text-[10px] text-center text-bamboo-200">
                  Signup is quick and completely free!
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Layout Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full" id="main-content-layout">
        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden bg-white p-1 rounded-xl border border-bamboo-100/60 mb-5 text-center" id="mobile-navigation-tabs">
          {[
            { id: 'feed', label: '🎵 Feed' },
            { id: 'ragas', label: '📖 Ragas' },
            { id: 'chats', label: `💬 Chats${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
            { id: 'tips', label: '💡 Tips' }
          ].map((tab) => {
            const isSelected = mobileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'chats') {
                    if (!currentUser) {
                      setAuthModalOpen(true);
                      return;
                    }
                    setCurrentView('chats');
                  } else {
                    setCurrentView('community');
                  }
                  setMobileTab(tab.id as any);
                }}
                className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${
                  isSelected 
                    ? "bg-bamboo-700 text-white shadow-3xs" 
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {currentView === 'user-profile' && selectedProfileUserId ? (
          <UserProfileView
            userId={selectedProfileUserId}
            currentUser={currentUser}
            onBack={() => {
              setCurrentView('community');
              setSelectedProfileUserId(null);
            }}
            onStartChat={handleStartChat}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        ) : currentView === 'post-detail' && selectedPost ? (
          <PostDetailView
            post={posts.find(p => p.id === selectedPost.id) || selectedPost}
            currentUser={currentUser}
            onBack={() => {
              setCurrentView('community');
              setSelectedPost(null);
            }}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenShare={handleOpenShare}
            onStartChat={handleStartChat}
            onUserProfileClick={handleOpenUserProfile}
          />
        ) : currentView === 'chats' && currentUser ? (
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
                  setCurrentView('community');
                  setMobileTab('feed');
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
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* LEFT AREA: Search, Filters, and Posts Feed (Collapses/displays based on mobile selection) */}
          <div className={`md:col-span-8 space-y-5 ${mobileTab === 'feed' ? 'block' : 'hidden md:block'}`} id="left-feed-container">
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
                <button
                  onClick={handleOpenCreatePost}
                  className="py-2 px-4 bg-bamboo-700 hover:bg-bamboo-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-3xs shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Post</span>
                </button>
              </div>

              {/* Filtering bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-gray-100">
                <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                  <Filter className="w-3.5 h-3.5 text-bamboo-700 shrink-0 hidden sm:block" />
                  {['All', 'Performance', 'Tutorial', 'Raga Discussion', 'Review', 'Question'].map((cat) => {
                    const isSelected = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setActiveRagaFilter(null); // Reset raga filter when category is clicked
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                          isSelected 
                            ? "bg-bamboo-100 text-bamboo-800 border border-bamboo-200" 
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"
                        }`}
                      >
                        {cat === 'Raga Discussion' ? 'Ragas' : cat}
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
                      className="ml-2 text-[10px] text-amber-700 hover:text-amber-950 font-bold uppercase"
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
                  <button
                    onClick={handleOpenCreatePost}
                    className="px-4 py-2 bg-bamboo-700 text-white text-xs font-bold rounded-xl hover:bg-bamboo-600 transition"
                  >
                    Share First Post
                  </button>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onOpenAuth={() => setAuthModalOpen(true)}
                    onOpenShare={handleOpenShare}
                    onStartChat={handleStartChat}
                    onUserProfileClick={handleOpenUserProfile}
                    onPostClick={(clickedPost) => {
                      setSelectedPost(clickedPost);
                      setCurrentView('post-detail');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR: Raga Guide (Collapses/displays based on mobile selection) */}
          <div className={`md:col-span-4 space-y-6 ${mobileTab === 'ragas' ? 'block' : 'hidden md:block'}`} id="right-sidebar-ragaguide">
            <RagaGuide 
              onSelectRagaDiscussion={handleSelectRagaDiscussion}
              activeRagaFilter={activeRagaFilter}
            />
          </div>

          {/* RIGHT SIDEBAR ADDITION: Quick Tips & Guidelines (Collapses/displays on mobile selection) */}
          <div className={`md:col-span-4 space-y-6 ${mobileTab === 'tips' ? 'block' : 'hidden'}`} id="right-sidebar-tips">
            <div className="frosted-panel rounded-2xl p-4 space-y-4 shadow-sm" id="community-tips-card">
              <h3 className="font-display font-bold text-bamboo-800 text-sm flex items-center gap-1.5 border-b border-gray-100 pb-2.5">
                <HelpCircle className="w-4.5 h-4.5 text-amber-600" />
                Flute Practice FAQ
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-800">1. How do I choose my first bansuri?</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Beginners should always start with a <strong className="text-bamboo-700 font-semibold">C Natural Medium</strong> flute. It is compact, requires less hand-stretch, and matches perfectly with popular western keyboards.
                  </p>
                </div>

                <div className="space-y-1 pt-2.5 border-t border-dashed border-gray-100">
                  <h4 className="font-bold text-gray-800">2. Why does my sound sound airy or weak?</h4>
                  <p className="text-gray-600 leading-relaxed">
                    This is extremely common. Ensure that your lips cover exactly 1/3 of the blowing hole (embouchure). Blow with your diaphragm (warm belly air), not with your cheeks!
                  </p>
                </div>

                <div className="space-y-1 pt-2.5 border-t border-dashed border-gray-100">
                  <h4 className="font-bold text-gray-800">3. What is the 'pipers grip'?</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Instead of using the tips of your fingers, place the fleshy middle pads of your fingers on the holes. This is the safest way to prevent finger fatigue, especially on bass flutes.
                  </p>
                </div>

                <div className="space-y-1 pt-2.5 border-t border-dashed border-gray-100">
                  <h4 className="font-bold text-gray-800">4. Community Guidelines</h4>
                  <ul className="list-disc pl-4 text-gray-500 space-y-1 text-[11px]">
                    <li>Constructive, kind feedback only.</li>
                    <li>Always title your covers with the correct Flute Key.</li>
                    <li>Respect teachers, experts, and beginners alike.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-bamboo-800 text-bamboo-200 text-xs border-t border-bamboo-700/50 mt-12 py-8" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-white">
            <Music className="w-5 h-5 text-yellow-300" />
            <span className="font-display font-bold text-base tracking-wide">FluteSangam</span>
          </div>
          <p className="text-[11px] text-bamboo-300">
            WHERE FLUTES MEET, HEARTS CONNECT
          </p>
          <p className="text-[10px] text-bamboo-400">
            © {new Date().getFullYear()} FluteSangam . All rights reserved
          </p>
          <p className="text-[10px] text-bamboo-500 mt-2 font-medium">
            Developed by : Aplut
          </p>
        </div>
      </footer>

      {/* MODALS RENDER SECTION */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {currentUser && (
        <CreatePostModal
          isOpen={createPostModalOpen}
          onClose={() => setCreatePostModalOpen(false)}
          currentUser={currentUser}
        />
      )}

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setActiveSharePost(null);
        }}
        post={activeSharePost}
      />

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
    </div>
  );
}
