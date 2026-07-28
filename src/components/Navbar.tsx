import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, AppView } from '../types';
import { VIEW_URLS } from '../routes';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { updateUserProfile, isEmailTaken, isPhoneTaken, isUsernameTaken, deleteUserAccount } from '../lib/db';
import { Music, LogOut, User, Globe, Edit3, Check, X, ShieldAlert, Sparkles, MapPin, Feather, Phone, Mail, Camera, Upload, MessageSquare, Wind, BookOpen, ChevronDown, Users, Zap, Menu, Info, Radio, Trash2, Sliders, CircleDot } from 'lucide-react';
import { CARTOON_AVATARS } from './AuthModal';
import NotificationsDropdown from './NotificationsDropdown';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
  currentView?: AppView;
  onViewChange?: (view: AppView) => void;
  unreadCount?: number;
  onEditingProfile?: (isEditing: boolean) => void;
  onSelectPost?: (postId: string) => void;
}

export default function Navbar({ 
  currentUser, 
  onOpenAuth, 
  onLogout, 
  onProfileUpdated,
  currentView = 'community',
  onViewChange,
  unreadCount = 0,
  onEditingProfile,
  onSelectPost
}: NavbarProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileLearnMenu, setShowMobileLearnMenu] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  useEffect(() => {
    onEditingProfile?.(isEditingProfile);
  }, [isEditingProfile, onEditingProfile]);
  
  // Editable fields
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLevel, setEditLevel] = useState<string>('Beginner');
  const [editBansuri, setEditBansuri] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    if (!confirm("Are you sure you want to delete your account?")) {
      return;
    }
    setDeleting(true);
    try {
      await deleteUserAccount(currentUser.uid);
      await signOut(auth);
      onLogout();
      setIsEditingProfile(false);
      setShowProfileDropdown(false);
      alert("Your account has been deleted.");
    } catch (err: any) {
      console.error("Error deleting account:", err);
      await signOut(auth);
      onLogout();
      setIsEditingProfile(false);
      setShowProfileDropdown(false);
      alert("Account marked as deleted in database.");
    } finally {
      setDeleting(false);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLearnDropdown, setShowLearnDropdown] = useState(false);
  const learnDropdownRef = useRef<HTMLDivElement>(null);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (learnDropdownRef.current && !learnDropdownRef.current.contains(event.target as Node)) {
        setShowLearnDropdown(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setShowMoreDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    }

    if (showProfileDropdown || showLearnDropdown || showMoreDropdown || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown, showLearnDropdown, showMoreDropdown, showMobileMenu]);


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
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        {/* Brand Logo & Name */}
        <a 
          href={VIEW_URLS['community'] || '/'}
          onClick={(e) => {
            e.preventDefault();
            onViewChange?.('community');
            setShowMobileMenu(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-1.5 sm:gap-2.5 group focus:outline-none cursor-pointer min-w-0 mr-1 sm:mr-4 lg:mr-8"
          id="navbar-brand-logo-btn"
          title="Go to Home / Landing"
        >
          <img 
            src="/flutesangam_without_tagline.png" 
            alt="FluteSangam" 
            className="h-8 sm:h-11 w-auto transition-transform group-hover:scale-105 shrink-0 object-contain" 
          />
          <span className="font-display font-extrabold text-lg sm:text-2xl tracking-tight text-bamboo-950 group-hover:text-bamboo-800 transition-colors truncate">
            Flute<span className="text-amber-700">Sangam</span>
          </span>
        </a>

        {/* Desktop View Selector */}
        <div className="hidden lg:flex items-center space-x-1 bg-bamboo-50/80 p-1 rounded-xl border border-bamboo-100/50 shrink-0">
          
          {/* 1. Sadhana Feed */}
          <a
            href={VIEW_URLS['community'] || '/'}
            onClick={(e) => { e.preventDefault(); onViewChange?.('community'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentView === 'community' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-gray-600 hover:text-bamboo-800 hover:bg-bamboo-100/30'
            }`}
          >
            <Globe className={`w-3.5 h-3.5 ${currentView === 'community' ? 'text-white' : 'text-amber-600'}`} />
            <span>Sadhana Feed</span>
          </a>

          {/* 2. Standalone Flute Tuner Button */}
          <a
            href={VIEW_URLS['learn_tuner'] || '/tuner'}
            onClick={(e) => { e.preventDefault(); onViewChange?.('learn_tuner'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentView === 'learn_tuner'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                : 'text-amber-900 bg-amber-100/70 hover:bg-amber-200/80 border border-amber-300/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span>Flute Tuner</span>
            <span className="text-[9px] bg-amber-900/20 text-amber-950 font-black px-1.5 py-0.5 rounded-full">440Hz</span>
          </a>
          
          {/* 3. Learn Flute Dropdown */}
          <div className="relative" ref={learnDropdownRef}>
            <button
              onClick={() => setShowLearnDropdown(!showLearnDropdown)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'learn_intro' || currentView === 'learn_basics' || currentView === 'learn_choose_flute' || currentView === 'learn_alankaras' || currentView === 'learn_raagas' || currentView === 'learn_dashboard'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-bamboo-800 hover:bg-bamboo-100/30'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${currentView?.startsWith('learn_') ? 'text-white' : 'text-amber-600'}`} />
              <span>Learn Flute</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            
            {showLearnDropdown && (
              <div className="absolute top-full mt-2 left-0 w-60 bg-white rounded-xl shadow-xl border border-bamboo-100 py-1.5 z-50 overflow-hidden">
                <a
                  href={VIEW_URLS['learn_dashboard'] || '/learn'}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange?.('learn_dashboard');
                    setShowLearnDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-bamboo-900 bg-bamboo-50/60 hover:bg-bamboo-100/70 transition border-b border-bamboo-100 cursor-pointer flex items-center justify-between"
                >
                  <span>All Lessons Overview</span>
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                </a>
                <a
                  href={VIEW_URLS['learn_intro'] || '/learn/intro'}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange?.('learn_intro');
                    setShowLearnDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-bamboo-50 hover:text-bamboo-800 transition border-b border-bamboo-50 cursor-pointer block"
                >
                  Introduction To Flute/Bansuri
                </a>
                <a
                  href={VIEW_URLS['learn_choose_flute'] || '/learn/choose-flute'}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange?.('learn_choose_flute');
                    setShowLearnDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-bamboo-50 hover:text-bamboo-800 transition border-b border-bamboo-50 cursor-pointer block"
                >
                  Choose the Right Flute
                </a>
                <a
                  href={VIEW_URLS['learn_basics'] || '/learn/basics'}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange?.('learn_basics');
                    setShowLearnDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-bamboo-50 hover:text-bamboo-800 transition border-b border-bamboo-50 cursor-pointer block"
                >
                  The Basics &amp; Blowing
                </a>
                <a
                  href={VIEW_URLS['learn_fingering_chart'] || '/learn/fingering-chart'}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange?.('learn_fingering_chart');
                    setShowLearnDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-amber-800 hover:bg-amber-50 transition border-b border-bamboo-50 cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <CircleDot className="w-3.5 h-3.5 text-amber-600" />
                    <span>Interactive Fingering Chart</span>
                  </span>
                  <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md uppercase">Chart</span>
                </a>
                <a
                  href={VIEW_URLS['learn_alankaras'] || '/learn/alankaras'}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange?.('learn_alankaras');
                    setShowLearnDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-bamboo-50 hover:text-bamboo-800 transition border-b border-bamboo-50 cursor-pointer block"
                >
                  Alankaras Practice
                </a>
                <a
                  href={VIEW_URLS['learn_raagas'] || '/learn/raagas'}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange?.('learn_raagas');
                    setShowLearnDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-bamboo-50 hover:text-bamboo-800 transition cursor-pointer block"
                >
                  Classical Raagas
                </a>
              </div>
            )}
          </div>

          {/* 4. Standalone Alankar Generator Button */}
          <a
            href={VIEW_URLS['alankar_generator'] || '/alankar-generator'}
            onClick={(e) => { e.preventDefault(); onViewChange?.('alankar_generator'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentView === 'alankar_generator'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-bamboo-800 hover:bg-bamboo-100/30'
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 ${currentView === 'alankar_generator' ? 'text-white' : 'text-amber-600'}`} />
            <span>Alankar Generator</span>
          </a>

          {/* 4. Sangam Chats */}
          <a
            href={VIEW_URLS['chats'] || '/chats'}
            onClick={(e) => {
              e.preventDefault();
              if (!currentUser) {
                onOpenAuth();
              } else {
                onViewChange?.('chats');
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 relative cursor-pointer whitespace-nowrap ${
              currentView === 'chats' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-gray-600 hover:text-bamboo-800 hover:bg-bamboo-100/30'
            }`}
          >
            <MessageSquare className={`w-3.5 h-3.5 ${currentView === 'chats' ? 'text-white' : 'text-amber-600'}`} />
            <span>Chats</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-yellow-500 text-white text-[9px] font-black h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center border border-white animate-bounce shadow-xs">
                {unreadCount}
              </span>
            )}
          </a>
          
          {/* 5. Notation Requests */}
          <a
            href={VIEW_URLS['notation_requests'] || '/notations'}
            onClick={(e) => { e.preventDefault(); onViewChange?.('notation_requests'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentView === 'notation_requests'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-bamboo-800 hover:bg-bamboo-100/30'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${currentView === 'notation_requests' ? 'text-white' : 'text-amber-600'}`} />
            <span>Notations</span>
          </a>

          {/* 6. More Dropdown (Members & About Us) */}
          <div className="relative" ref={moreDropdownRef}>
            <button
              onClick={() => setShowMoreDropdown(!showMoreDropdown)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                currentView === 'community_members' || currentView === 'about_us'
                  ? 'bg-bamboo-700 text-white shadow-3xs'
                  : 'text-gray-600 hover:text-bamboo-800 hover:bg-bamboo-100/30'
              }`}
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {showMoreDropdown && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-xl shadow-xl border border-bamboo-100 py-1.5 z-50 overflow-hidden">
                <a
                  href={VIEW_URLS['community_members'] || '/members'}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange?.('community_members');
                    setShowMoreDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-bamboo-50 hover:text-bamboo-800 transition border-b border-bamboo-50 flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Flutists Directory</span>
                </a>
                <a
                  href={VIEW_URLS['about_us'] || '/about'}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange?.('about_us');
                    setShowMoreDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-bamboo-50 hover:text-bamboo-800 transition flex items-center gap-2 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span>About FluteSangam</span>
                </a>
              </div>
            )}
          </div>

        </div>

        {/* Hamburger Menu Button (Mobile & Tablet < lg) */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-bamboo-800 hover:bg-bamboo-50 rounded-xl transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Overlay Drawer (Optimized for Smartphones) */}
        {showMobileMenu && (
          <div 
            ref={mobileMenuRef}
            className="absolute top-16 left-2 right-2 sm:left-4 sm:right-4 bg-white/98 backdrop-blur-xl border border-bamboo-200/90 shadow-2xl rounded-2xl p-4 z-50 lg:hidden max-h-[82vh] overflow-y-auto space-y-4 text-left"
          >
            {/* Quick Practice Tools */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800/80 px-1 mb-1.5 block">
                Practice Tools
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => { onViewChange?.('learn_tuner'); setShowMobileMenu(false); }}
                  className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-bamboo-100/40 border border-amber-300/80 rounded-xl hover:bg-amber-100/70 transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-extrabold text-bamboo-950 flex items-center gap-1.5">
                        <span>Flute Tuner &amp; Scales</span>
                        <span className="text-[9px] bg-amber-200 text-amber-950 font-bold px-1.5 py-0.2 rounded-full">A=440Hz</span>
                      </div>
                      <div className="text-[11px] text-gray-600">Interactive live frequency scale tuner</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => { onViewChange?.('alankar_generator'); setShowMobileMenu(false); }}
                  className={`w-full flex items-center justify-between p-3.5 border rounded-xl transition cursor-pointer text-left ${
                    currentView === 'alankar_generator'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-amber-50/70 border-amber-200/80 hover:bg-amber-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs group-hover:scale-105 transition ${
                      currentView === 'alankar_generator' ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className={`text-xs font-extrabold ${currentView === 'alankar_generator' ? 'text-white' : 'text-bamboo-950'}`}>Alankar Generator</div>
                      <div className={`text-[11px] ${currentView === 'alankar_generator' ? 'text-amber-100' : 'text-gray-600'}`}>Create your own Alankars</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Community Section */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-600 px-1 mb-1.5 block">
                Community
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onViewChange?.('community'); setShowMobileMenu(false); }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold border transition text-left cursor-pointer ${
                    currentView === 'community'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-bamboo-50/60 text-gray-700 border-bamboo-100 hover:bg-bamboo-100/60'
                  }`}
                >
                  <Globe className={`w-4 h-4 shrink-0 ${currentView === 'community' ? 'text-white' : 'text-amber-600'}`} />
                  <span>Sadhana Feed</span>
                </button>

                <button
                  onClick={() => { 
                    if (!currentUser) onOpenAuth();
                    else onViewChange?.('chats'); 
                    setShowMobileMenu(false); 
                  }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold border transition text-left relative cursor-pointer ${
                    currentView === 'chats'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-bamboo-50/60 text-gray-700 border-bamboo-100 hover:bg-bamboo-100/60'
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 shrink-0 ${currentView === 'chats' ? 'text-white' : 'text-amber-600'}`} />
                  <span>Sangam Chats</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-yellow-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { onViewChange?.('notation_requests'); setShowMobileMenu(false); }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold border transition text-left cursor-pointer ${
                    currentView === 'notation_requests'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-bamboo-50/60 text-gray-700 border-bamboo-100 hover:bg-bamboo-100/60'
                  }`}
                >
                  <Music className={`w-4 h-4 shrink-0 ${currentView === 'notation_requests' ? 'text-white' : 'text-amber-600'}`} />
                  <span>Notations</span>
                </button>

                <button
                  onClick={() => { onViewChange?.('community_members'); setShowMobileMenu(false); }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold border transition text-left cursor-pointer ${
                    currentView === 'community_members'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-bamboo-50/60 text-gray-700 border-bamboo-100 hover:bg-bamboo-100/60'
                  }`}
                >
                  <Users className={`w-4 h-4 shrink-0 ${currentView === 'community_members' ? 'text-white' : 'text-amber-600'}`} />
                  <span>Flutists</span>
                </button>
              </div>
            </div>

            {/* Learn Flute Section */}
            <div>
              <button
                onClick={() => setShowMobileLearnMenu(!showMobileLearnMenu)}
                className="w-full flex items-center justify-between p-3 bg-bamboo-50/80 border border-bamboo-100 rounded-xl text-xs font-bold text-bamboo-950 hover:bg-bamboo-100/80 transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Learn Bansuri Lessons</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-bamboo-700 transition-transform ${showMobileLearnMenu ? 'rotate-180' : ''}`} />
              </button>

              {showMobileLearnMenu && (
                <div className="mt-2 pl-3 pr-1 py-1 space-y-1 bg-white border border-bamboo-100 rounded-xl text-left">
                  <button
                    onClick={() => { onViewChange?.('learn_dashboard'); setShowMobileMenu(false); }}
                    className="w-full text-left text-xs font-bold text-bamboo-900 hover:text-amber-700 py-2 border-b border-bamboo-50 cursor-pointer"
                  >
                    📚 All Lessons Dashboard
                  </button>
                  <button
                    onClick={() => { onViewChange?.('learn_intro'); setShowMobileMenu(false); }}
                    className="w-full text-left text-xs text-gray-700 hover:text-bamboo-800 py-2 border-b border-bamboo-50 cursor-pointer"
                  >
                    1. Introduction to Bansuri
                  </button>
                  <button
                    onClick={() => { onViewChange?.('learn_choose_flute'); setShowMobileMenu(false); }}
                    className="w-full text-left text-xs text-gray-700 hover:text-bamboo-800 py-2 border-b border-bamboo-50 cursor-pointer"
                  >
                    2. Choose the Right Flute
                  </button>
                  <button
                    onClick={() => { onViewChange?.('learn_basics'); setShowMobileMenu(false); }}
                    className="w-full text-left text-xs text-gray-700 hover:text-bamboo-800 py-2 border-b border-bamboo-50 cursor-pointer"
                  >
                    3. The Basics &amp; Blowing
                  </button>
                  <button
                    onClick={() => { onViewChange?.('learn_fingering_chart'); setShowMobileMenu(false); }}
                    className="w-full text-left text-xs font-bold text-amber-800 hover:text-bamboo-900 py-2 border-b border-bamboo-50 cursor-pointer flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <CircleDot className="w-3.5 h-3.5 text-amber-600" />
                      <span>Interactive Fingering Chart</span>
                    </span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full uppercase">Chart</span>
                  </button>
                  <button
                    onClick={() => { onViewChange?.('learn_alankaras'); setShowMobileMenu(false); }}
                    className="w-full text-left text-xs text-gray-700 hover:text-bamboo-800 py-2 border-b border-bamboo-50 cursor-pointer"
                  >
                    4. Alankaras Practice
                  </button>
                  <button
                    onClick={() => { onViewChange?.('learn_raagas'); setShowMobileMenu(false); }}
                    className="w-full text-left text-xs text-gray-700 hover:text-bamboo-800 py-2 cursor-pointer"
                  >
                    5. Indian Classical Raagas
                  </button>
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="pt-1 border-t border-bamboo-100">
              <button
                onClick={() => { onViewChange?.('about_us'); setShowMobileMenu(false); }}
                className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-gray-600 hover:text-bamboo-900 transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>About FluteSangam</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Global user stats and profile management */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {currentUser ? (
            <>
              <NotificationsDropdown 
                currentUser={currentUser}
                onSelectPost={(postId) => onSelectPost?.(postId)}
              />

              <div className="relative" ref={dropdownRef}>
                {/* Signed in avatar button */}
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-1 rounded-xl hover:bg-bamboo-50 border border-transparent hover:border-bamboo-100/60 transition"
                id="user-profile-dropdown-trigger"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-bamboo-600 bg-amber-100 flex items-center justify-center">
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
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
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-bamboo-600 bg-amber-100 flex items-center justify-center">
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
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
          </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-bamboo-700 text-white hover:bg-bamboo-600 text-[9px] sm:text-[11px] font-bold tracking-wide uppercase rounded-xl transition shadow-xs flex items-center space-x-1 shrink-0"
              id="join-sangam-header-btn"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300 shrink-0" />
              <span className="flex flex-col text-center leading-tight">
                <span>Join</span>
                <span>Sangam</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </header>

      {/* Edit Profile Dialog Overlay (Absolute modal inside navbar/context for simplicity) */}
      {isEditingProfile && currentUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-3xs" id="edit-profile-overlay">
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
                  disabled={loading || deleting}
                  className="flex-1 py-2 bg-bamboo-700 text-white text-xs font-semibold rounded-lg transition hover:bg-bamboo-600 flex items-center justify-center"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="pt-3 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting || loading}
                  className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deleting ? "Deleting Account..." : "Delete Account"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
