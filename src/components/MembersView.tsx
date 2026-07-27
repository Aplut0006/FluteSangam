import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { subscribeToAllUsers } from '../lib/db';
import { 
  Search, 
  Users, 
  Award, 
  MapPin, 
  Music, 
  MessageSquare, 
  UserCheck, 
  Sparkles,
  Filter,
  X,
  Lock
} from 'lucide-react';

interface MembersViewProps {
  currentUser?: UserProfile | null;
  onUserProfileClick: (userId: string) => void;
  onStartChat?: (targetUser: { uid: string; displayName: string; username?: string; photoURL?: string }) => void;
  onOpenAuth?: () => void;
}

export default function MembersView({ 
  currentUser, 
  onUserProfileClick, 
  onStartChat, 
  onOpenAuth 
}: MembersViewProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedScale, setSelectedScale] = useState<string>('All');

  useEffect(() => {
    if (!currentUser) {
      setUsers([]);
      return;
    }
    const unsubscribe = subscribeToAllUsers((loadedUsers) => {
      setUsers(loadedUsers);
    });
    return () => unsubscribe();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl border border-bamboo-200/80 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-16 h-16 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto border border-amber-200 shadow-3xs">
            <Lock className="w-8 h-8 text-amber-700" />
          </div>
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-widest bg-amber-100/70 text-amber-900 px-3 py-1 rounded-full border border-amber-300/60">
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>Sadhaka Community Directory</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-bamboo-950">
              Authentication Required
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Please sign in or create an account to view community members, explore flutist profiles, and connect with fellow learners worldwide.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3 bg-bamboo-800 hover:bg-bamboo-900 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter users based on search, level, and scale
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel = selectedLevel === 'All' || user.level === selectedLevel;
    const matchesScale = selectedScale === 'All' || (user.bansuriType && user.bansuriType.includes(selectedScale));

    return matchesSearch && matchesLevel && matchesScale;
  });

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'Guru':
        return 'bg-amber-100 text-amber-800 border-amber-300/80';
      case 'Advanced':
        return 'bg-rose-100 text-rose-800 border-rose-300/80';
      case 'Intermediate':
        return 'bg-sky-100 text-sky-800 border-sky-300/80';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300/80';
    }
  };

  const handleChatClick = (e: React.MouseEvent, user: UserProfile) => {
    e.stopPropagation();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (onStartChat) {
      onStartChat({
        uid: user.uid,
        displayName: user.displayName,
        username: user.username,
        photoURL: user.photoURL
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-1 sm:px-4 py-2">
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-bamboo-900 via-bamboo-800 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-amber-200 via-bamboo-400 to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-widest bg-amber-400/20 text-amber-200 px-3 py-1 rounded-full border border-amber-300/30">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Community Flutists &amp; Sadhakas</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Explore &amp; Connect with Bansuri Artists
          </h1>
          <p className="text-xs sm:text-sm text-bamboo-100/90 leading-relaxed">
            Discover gurus, classical exponents, and fellow learners across the globe. Share scales, request ragas, or start a direct conversation!
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-bamboo-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 flex items-center bg-bamboo-50/50 px-3.5 py-2.5 rounded-xl border border-bamboo-200/70 focus-within:ring-2 focus-within:ring-bamboo-600 focus-within:border-transparent transition">
            <Search className="w-4 h-4 text-bamboo-700 shrink-0 mr-2.5" />
            <input
              type="text"
              placeholder="Search by name, @username, location, or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-gray-900 focus:outline-none placeholder-gray-400 w-full"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-gray-400 hover:text-gray-700 p-1 font-bold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Scale / Key Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-bamboo-900 shrink-0 flex items-center gap-1">
              <Music className="w-3.5 h-3.5 text-amber-600" />
              <span>Flute Scale:</span>
            </span>
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
              className="bg-bamboo-50/70 border border-bamboo-200 text-bamboo-900 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bamboo-600 cursor-pointer"
            >
              <option value="All">All Scales / Keys</option>
              <option value="E Bass">E Bass</option>
              <option value="C Natural">C Natural</option>
              <option value="A Natural">A Natural</option>
              <option value="G Bass">G Bass</option>
              <option value="D Natural">D Natural</option>
              <option value="G Medium">G Medium</option>
            </select>
          </div>
        </div>

        {/* Level Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-bamboo-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-bamboo-700" />
              <span>Level:</span>
            </span>
            {['All', 'Guru', 'Advanced', 'Intermediate', 'Beginner'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedLevel === level
                    ? 'bg-bamboo-800 text-white border-bamboo-800 shadow-3xs'
                    : 'bg-bamboo-50/60 text-bamboo-900 border-bamboo-200/60 hover:bg-bamboo-100/70'
                }`}
              >
                {level === 'All' ? 'All Levels' : level}
              </button>
            ))}
          </div>

          <div className="text-xs font-semibold text-bamboo-800 bg-bamboo-50 px-3 py-1 rounded-full border border-bamboo-200/80">
            Showing <strong>{filteredUsers.length}</strong> {filteredUsers.length === 1 ? 'member' : 'members'}
          </div>
        </div>
      </div>

      {/* Members Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-bamboo-200 p-8 space-y-3">
          <div className="w-12 h-12 bg-bamboo-50 text-bamboo-700 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-800 font-display">No Community Members Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            No member matched your search query or selected level/scale filter. Try adjusting your search parameters!
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedLevel('All');
              setSelectedScale('All');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-bamboo-800 text-white rounded-xl text-xs font-bold hover:bg-bamboo-900 transition cursor-pointer shadow-3xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredUsers.map(user => {
            const isSelf = currentUser?.uid === user.uid;
            
            return (
              <div
                key={user.uid}
                onClick={() => onUserProfileClick(user.uid)}
                className="bg-white border border-bamboo-200/70 rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Header info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={user.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"}
                          alt={user.displayName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border-2 border-bamboo-200 group-hover:border-bamboo-500 transition"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Active Community Sadhaka" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-bamboo-950 truncate group-hover:text-bamboo-800 transition">
                            {user.displayName}
                          </h3>
                          {isSelf && (
                            <span className="text-[10px] bg-bamboo-100 text-bamboo-800 px-1.5 py-0.5 rounded font-extrabold uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 font-mono truncate">@{user.username}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${getLevelBadgeClass(user.level || 'Beginner')}`}>
                      {user.level || 'Beginner'}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed min-h-[2.25rem]">
                    {user.bio || "Bansuri Sadhaka & Indian classical music enthusiast."}
                  </p>

                  {/* Tags / Details */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-gray-600">
                    {user.bansuriType && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                        <Music className="w-3 h-3 text-amber-700" />
                        <span>Key: {user.bansuriType}</span>
                      </span>
                    )}

                    {user.location && (
                      <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 border border-gray-200/70 px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="truncate max-w-[120px]">{user.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 mt-4 border-t border-bamboo-100/80 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUserProfileClick(user.uid);
                    }}
                    className="flex-1 px-3 py-2 bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-900 border border-bamboo-200/80 rounded-xl text-xs font-bold transition cursor-pointer text-center"
                  >
                    View Profile
                  </button>

                  {!isSelf && onStartChat && (
                    <button
                      onClick={(e) => handleChatClick(e, user)}
                      className="px-3 py-2 bg-bamboo-800 hover:bg-bamboo-900 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-3xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
