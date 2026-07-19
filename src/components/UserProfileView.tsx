import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getUserProfile } from '../lib/db';
import { 
  ArrowLeft, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Music, 
  Award, 
  Mail, 
  Phone,
  Sparkles
} from 'lucide-react';

interface UserProfileViewProps {
  userId: string;
  currentUser: UserProfile | null;
  onBack: () => void;
  onStartChat: (targetUser: { uid: string; displayName: string; username?: string; photoURL?: string }) => void;
  onOpenAuth: () => void;
}

export default function UserProfileView({ 
  userId, 
  currentUser, 
  onBack, 
  onStartChat,
  onOpenAuth 
}: UserProfileViewProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Guru':
        return "bg-amber-100 text-amber-800 border-amber-200/60";
      case 'Advanced':
        return "bg-rose-100 text-rose-800 border-rose-200/60";
      case 'Intermediate':
        return "bg-blue-100 text-blue-800 border-blue-200/60";
      default:
        return "bg-green-100 text-green-800 border-green-200/60";
    }
  };

  const formatJoinedDate = (timestamp: any) => {
    if (!timestamp) return 'Sadhaka since recently';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return `Joined on ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    } catch (e) {
      return 'Sadhaka since recently';
    }
  };

  if (loading) {
    return (
      <div className="frosted-panel rounded-2xl p-12 text-center bg-white border border-bamboo-100/50 shadow-xs">
        <div className="w-10 h-10 border-4 border-bamboo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-gray-500">Loading sadhaka profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-bamboo-800 hover:text-bamboo-900 bg-white/70 border border-bamboo-100 px-4 py-2.5 rounded-xl transition cursor-pointer shadow-3xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="frosted-panel rounded-2xl p-8 text-center bg-white border border-red-100 shadow-xs">
          <p className="text-sm font-semibold text-red-600">Sadhaka profile not found or has been deleted.</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.uid === profile.uid;

  return (
    <div className="space-y-6" id="user-profile-view-page">
      {/* Back navigation */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-bamboo-800 hover:text-bamboo-900 bg-white/70 backdrop-blur-3xs border border-bamboo-100 px-4 py-2.5 rounded-xl transition cursor-pointer shadow-3xs hover:translate-x-[-2px] duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>
      </div>

      {/* Main Profile Card Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Avatar & Basic Stats card */}
        <div className="md:col-span-4 space-y-6">
          <div className="frosted-panel rounded-2xl p-6 text-center bg-white border border-bamboo-100/50 shadow-sm space-y-4 flex flex-col items-center">
            <img
              src={profile.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
              alt={profile.displayName}
              referrerPolicy="no-referrer"
              className="w-28 h-28 rounded-full object-cover border-4 border-bamboo-100 bg-white shadow-xs"
            />
            
            <div className="space-y-1">
              <h2 className="font-display font-extrabold text-gray-900 text-lg leading-tight">
                {profile.displayName}
              </h2>
              <p className="text-sm font-mono text-bamboo-700 font-bold">
                @{profile.username}
              </p>
              <div className="pt-2 flex justify-center">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold tracking-wide uppercase border ${getLevelBadge(profile.level)}`}>
                  {profile.level}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              {formatJoinedDate(profile.joinedAt)}
            </p>

            {/* Chat Trigger Option */}
            {!isOwnProfile && (
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                    return;
                  }
                  onStartChat({
                    uid: profile.uid,
                    displayName: profile.displayName,
                    username: profile.username,
                    photoURL: profile.photoURL
                  });
                }}
                className="w-full py-3 bg-bamboo-700 hover:bg-bamboo-800 text-white font-bold text-xs rounded-xl transition shadow-3xs tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer"
              >
                <MessageCircle className="w-4.5 h-4.5" />
                <span>Message @{profile.username}</span>
              </button>
            )}

            {isOwnProfile && (
              <div className="w-full p-3 bg-bamboo-50 rounded-xl text-center border border-bamboo-100">
                <p className="text-[11px] text-bamboo-800 font-semibold flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  This is your public profile card
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed parameters */}
        <div className="md:col-span-8 space-y-6">
          <div className="frosted-panel rounded-2xl p-6 bg-white border border-bamboo-100/50 shadow-sm space-y-6">
            <div>
              <h3 className="font-display font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 mb-3">
                Sadhaka Biography
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                {profile.bio || "No biography provided yet. This bansuri player is practicing in silence."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bansuri details */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <h4 className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-bamboo-700" />
                  Preferred Flute / Scale
                </h4>
                <p className="text-xs text-gray-600 font-medium bg-white px-2.5 py-1 rounded-md border border-gray-100 inline-block">
                  {profile.bansuriType || "C Natural Medium"}
                </p>
              </div>

              {/* Location */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <h4 className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-bamboo-700" />
                  Location / Region
                </h4>
                <p className="text-xs text-gray-600 font-medium">
                  {profile.location || "Global Sadhaka"}
                </p>
              </div>

              {/* Experience level detail */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <h4 className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-bamboo-700" />
                  Practice Level
                </h4>
                <p className="text-xs text-gray-600">
                  Currently learning as <span className="font-bold text-bamboo-700">{profile.level}</span> level practitioner.
                </p>
              </div>

              {/* Email details */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <h4 className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-bamboo-700" />
                  Contact Info
                </h4>
                <p className="text-xs text-gray-400 italic">
                  Protected via FluteSangam secure gateway
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
