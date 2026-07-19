import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { updateUserProfile, isEmailTaken, isPhoneTaken, isUsernameTaken } from '../lib/db';
import { Music, LogOut, User, Globe, Edit3, Check, X, ShieldAlert, Sparkles, MapPin, Feather, Phone, Mail, Camera, Upload, MessageSquare, Wind, BookOpen, ChevronDown } from 'lucide-react';
import { CARTOON_AVATARS } from './AuthModal';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
  currentView?: 'community' | 'chats' | 'post-detail' | 'user-profile' | 'learn_intro' | 'learn_basics' | 'learn_alankaras' | 'learn_raagas';
  onViewChange?: (view: 'community' | 'chats' | 'post-detail' | 'user-profile' | 'learn_intro' | 'learn_basics' | 'learn_alankaras' | 'learn_raagas') => void;
  unreadCount?: number;
}

export default function Navbar({ 
  currentUser, 
  onOpenAuth, 
  onLogout, 
  onProfileUpdated,
  currentView = 'community',
  onViewChange,
  unreadCount = 0
}: NavbarProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Editable fields
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLevel, setEditLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Guru'>('Beginner');
  const [editBansuri, setEditBansuri] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLearnDropdown, setShowLearnDropdown] = useState(false);
  const learnDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (learnDropdownRef.current && !learnDropdownRef.current.contains(event.target as Node)) {
        setShowLearnDropdown(false);
      }
    }

    if (showProfileDropdown || showLearnDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown, showLearnDropdown]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
      setShowProfileDropdown(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const startEditing = () => {
    if (!currentUser) return;
    setEditName(currentUser.displayName);
    const defaultUsername = currentUser.username || currentUser.displayName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka';
    setEditUsername(defaultUsername);
    setEditBio(currentUser.bio);
    setEditLevel(currentUser.level);
    setEditBansuri(currentUser.bansuriType);
    setEditLocation(currentUser.location);
    setEditEmail(currentUser.email || '');
    setEditPhone(currentUser.phoneNumber || '');
    setEditPhotoURL(currentUser.photoURL || '');
    setErrorMsg('');
    setSuccessMsg('');
    setIsEditingProfile(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    
    try {
      // 1. Email uniqueness check if email was modified
      const normalizedEmail = editEmail.trim().toLowerCase();
      const currentNormalizedEmail = (currentUser.email || '').trim().toLowerCase();
      if (normalizedEmail && normalizedEmail !== currentNormalizedEmail) {
        const emailTaken = await isEmailTaken(normalizedEmail, currentUser.uid);
        if (emailTaken) {
          setErrorMsg(`The email address "${editEmail}" is already taken by another flutist!`);
          setLoading(false);
          return;
        }
      }

      // 2. Phone number uniqueness check if phone was modified
      const cleanedPhone = editPhone.trim().replace(/\s+/g, '');
      const currentCleanedPhone = (currentUser.phoneNumber || '').trim().replace(/\s+/g, '');
      if (cleanedPhone && cleanedPhone !== currentCleanedPhone) {
        const phoneTaken = await isPhoneTaken(cleanedPhone, currentUser.uid);
        if (phoneTaken) {
          setErrorMsg(`The phone number "${editPhone}" is already taken by another member!`);
          setLoading(false);
          return;
        }
      }

      // 3. Username validation & uniqueness check
      const cleanedUsername = editUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (!cleanedUsername) {
        setErrorMsg("Username cannot be empty and can only contain alphanumeric characters and underscores.");
        setLoading(false);
        return;
      }
      if (cleanedUsername.length < 3) {
        setErrorMsg("Username must be at least 3 characters.");
        setLoading(false);
        return;
      }
      if (cleanedUsername !== (currentUser.username || '').toLowerCase()) {
        const usernameTaken = await isUsernameTaken(cleanedUsername, currentUser.uid);
        if (usernameTaken) {
          setErrorMsg(`The username "${cleanedUsername}" is already taken!`);
          setLoading(false);
          return;
        }
      }

      const updates = {
        displayName: editName,
        username: cleanedUsername,
        bio: editBio,
        level: editLevel,
        bansuriType: editBansuri,
        location: editLocation,
        email: editEmail.trim(),
        phoneNumber: editPhone.trim(),
        photoURL: editPhotoURL
      };
      
      await updateUserProfile(currentUser.uid, updates);
      
      const updatedProfile: UserProfile = {
        ...currentUser,
        ...updates
      };
      
      onProfileUpdated(updatedProfile);
      setSuccessMsg('Your flutist profile has been updated!');
      setTimeout(() => {
        setIsEditingProfile(false);
        setSuccessMsg('');
      }, 1500);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMsg(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 frosted-navbar shadow-3xs" id="app-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Slogan */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-bamboo-700 to-bamboo-600 rounded-xl text-yellow-300 shadow-xs flex items-center justify-center shrink-0">
            <Wind className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-display tracking-tight text-bamboo-800 flex items-center gap-1">
              FluteSangam
            </h1>
            <p className="text-[10px] text-gray-500 font-medium">Where Flutes Meet, Hearts Connect</p>
          </div>
        </div>

        {/* Desktop View Selector */}
        <div className="hidden md:flex items-center space-x-1 bg-bamboo-50 p-1 rounded-xl border border-bamboo-100/50">
          <button
            onClick={() => onViewChange?.('community')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              currentView === 'community' 
                ? 'bg-bamboo-700 text-white shadow-3xs' 
                : 'text-gray-600 hover:text-bamboo-800 hover:bg-bamboo-100/30'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-600" />
            <span>Sadhana Feed</span>
          </button>
          
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
              } else {
                onViewChange?.('chats');
              }
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 relative cursor-pointer ${
              currentView === 'chats' 
                ? 'bg-bamboo-700 text-white shadow-3xs' 
                : 'text-gray-600 hover:text-bamboo-800 hover:bg-bamboo-100/30'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>Sangam Chats</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-yellow-500 text-white text-[9px] font-black h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center border border-white animate-bounce shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Learn Flute Dropdown */}
          <div className="relative" ref={learnDropdownRef}>
            <button
              onClick={() => setShowLearnDropdown(!showLearnDropdown)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'learn_intro' || currentView === 'learn_alankaras'
                  ? 'bg-bamboo-700 text-white shadow-3xs'
                  : 'text-gray-600 hover:text-bamboo-800 hover:bg-bamboo-100/30'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Learn Flute</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            
            {showLearnDropdown && (
              <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-xl shadow-xl border border-bamboo-100 py-1.5 z-50 overflow-hidden">
                <button
                  onClick={() => {
                    onViewChange?.('learn_intro');
                    setShowLearnDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-bamboo-50 hover:text-bamboo-800 transition border-b border-bamboo-50 last:border-b-0 cursor-pointer"
                >
                  Introduction To Flute/Bansuri
                </button>
                <button
                  onClick={() => {
                    onViewChange?.('learn_basics');
                    setShowLearnDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-bamboo-50 hover:text-bamboo-800 transition border-b border-bamboo-50 last:border-b-0 cursor-pointer"
                >
                  The Basics
                </button>
                <button
                  onClick={() => {
                    onViewChange?.('learn_alankaras');
                    setShowLearnDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-bamboo-50 hover:text-bamboo-800 transition border-b border-bamboo-50 cursor-pointer"
                >
                  Alankaras
                </button>
                <button
                  onClick={() => {
                    onViewChange?.('learn_raagas');
                    setShowLearnDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-bamboo-50 hover:text-bamboo-800 transition cursor-pointer"
                >
                  Raagas
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global user stats and profile management */}
        <div className="flex items-center space-x-4">
          {/* Subtle online stats */}
          <div className="hidden md:flex items-center space-x-1.5 bg-bamboo-50 px-3 py-1 rounded-full border border-bamboo-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-semibold text-bamboo-700">312 Bansuri Sadhakas online</span>
          </div>

          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              {/* Signed in avatar button */}
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-1 rounded-xl hover:bg-bamboo-50 border border-transparent hover:border-bamboo-100/60 transition"
                id="user-profile-dropdown-trigger"
              >
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-bamboo-600"
                />
                <span className="hidden sm:inline text-xs font-semibold text-gray-700 truncate max-w-[100px]">
                  {currentUser.displayName}
                </span>
              </button>

              {/* Profile dropdown */}
              {showProfileDropdown && (
                <div 
                  className="absolute right-0 mt-2.5 w-72 bg-white border border-bamboo-100/80 rounded-2xl shadow-xl p-4 space-y-3.5 origin-top-right animate-fadeIn"
                  id="user-profile-dropdown"
                >
                  <div className="flex items-center space-x-3 border-b border-gray-100 pb-3">
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-bamboo-600"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1">
                        {currentUser.displayName}
                        <span className="text-[8px] bg-bamboo-100 text-bamboo-800 px-1 py-0.5 rounded font-bold uppercase shrink-0">
                          {currentUser.level}
                        </span>
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {currentUser.location}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400 font-medium">Bansuri Key:</span>
                      <span className="font-semibold text-bamboo-800">{currentUser.bansuriType}</span>
                    </div>
                    <p className="text-gray-600 leading-normal italic text-[11px] pt-1">
                      "{currentUser.bio}"
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={startEditing}
                      className="flex-1 py-2 bg-bamboo-50 hover:bg-bamboo-100 border border-bamboo-100 text-bamboo-700 text-xs font-semibold rounded-lg transition flex items-center justify-center space-x-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 shrink-0" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="py-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition flex items-center justify-center"
                      title="Log Out"
                    >
                      <LogOut className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-bamboo-700 text-white hover:bg-bamboo-600 text-xs font-bold tracking-wider uppercase rounded-xl transition shadow-xs flex items-center space-x-1.5"
              id="join-sangam-header-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Join the Sangam</span>
            </button>
          )}
        </div>
      </div>
    </header>

      {/* Edit Profile Dialog Overlay (Absolute modal inside navbar/context for simplicity) */}
      {isEditingProfile && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-3xs" id="edit-profile-overlay">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-bamboo-100 overflow-hidden flex flex-col max-h-[92vh]" id="edit-profile-card">
            <div className="bg-bamboo-700 px-5 py-4 text-white flex justify-between items-center shrink-0">
              <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                <Feather className="w-4 h-4 text-yellow-300 shrink-0" />
                Update Musician Profile
              </h3>
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="p-1 rounded-full hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

             <form onSubmit={handleUpdateProfile} className="p-5 space-y-3.5 overflow-y-auto flex-1" id="edit-profile-form">
              {successMsg && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg flex items-center space-x-1">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start space-x-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Profile Picture Upload & Cartoon Chooser */}
              <div className="space-y-2.5 p-3 bg-gray-50/70 rounded-xl border border-gray-100" id="edit-profile-photo-container">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Profile Picture</label>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {editPhotoURL ? (
                      <img 
                        src={editPhotoURL} 
                        alt="Profile Preview" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-bamboo-600 shadow-3xs bg-white"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => document.getElementById('edit-photo-upload')?.click()}
                        className="px-2 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-700 transition flex items-center gap-1 shadow-3xs"
                      >
                        <Upload className="w-3 h-3 text-bamboo-700" />
                        Upload New Photo
                      </button>
                      <input 
                        type="file"
                        id="edit-photo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 500 * 1024) {
                              setErrorMsg("Image size must be under 500KB.");
                              return;
                            }
                            setErrorMsg('');
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditPhotoURL(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100/80 pt-2 space-y-1">
                  <span className="block text-[10px] font-semibold text-gray-500">Or pick one of the 10 default cartoon icons:</span>
                  <div className="grid grid-cols-5 gap-2 px-0.5 justify-items-center">
                    {CARTOON_AVATARS.map((avatarUrl, index) => {
                      const isSelected = editPhotoURL === avatarUrl;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setEditPhotoURL(avatarUrl);
                            setErrorMsg('');
                          }}
                          className={`relative rounded-full p-0.5 border-2 transition hover:scale-105 ${
                            isSelected ? 'border-bamboo-600 bg-bamboo-50 scale-105' : 'border-transparent hover:border-gray-200'
                          }`}
                        >
                          <img 
                            src={avatarUrl} 
                            alt={`Cartoon ${index + 1}`} 
                            className="w-8 h-8 rounded-full bg-white"
                            referrerPolicy="no-referrer"
                          />
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 bg-bamboo-600 text-white p-0.5 rounded-full shadow-md">
                              <Check className="w-2 h-2 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Your Display Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-bamboo-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Unique Username</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-semibold text-gray-400">@</span>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="username"
                    className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-bamboo-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Playing Level</label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-bamboo-600"
                  >
                    <option value="Beginner">Beginner (Sadhaka)</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Guru">Guru / Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bansuri Flute Key</label>
                  <input
                    type="text"
                    required
                    value={editBansuri}
                    onChange={(e) => setEditBansuri(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-bamboo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-bamboo-600"
                    placeholder="e.g. name@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-bamboo-600"
                    placeholder="e.g. +919876543210 (with country code)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Musician Location</label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-bamboo-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sadhana Bio</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-bamboo-600 resize-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="w-1/3 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-bamboo-700 text-white text-xs font-semibold rounded-lg transition hover:bg-bamboo-600 flex items-center justify-center"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
