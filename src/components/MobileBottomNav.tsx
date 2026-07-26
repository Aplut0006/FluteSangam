import React from 'react';
import { motion } from 'motion/react';
import { Compass, BookOpen, FileText, Users, MessageSquare } from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface MobileBottomNavProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenAuth: () => void;
  currentUser: UserProfile | null;
  unreadCount: number;
  isHidden?: boolean;
}

export default function MobileBottomNav({ 
  currentView,
  onViewChange, 
  onOpenAuth, 
  currentUser,
  unreadCount,
  isHidden 
}: MobileBottomNavProps) {
  if (isHidden) return null;

  const tabs = [
    { 
      id: 'community' as AppView, 
      label: 'Feed', 
      icon: Compass,
      isActive: currentView === 'community' || currentView === 'post-detail'
    },
    { 
      id: 'learn_dashboard' as AppView, 
      label: 'Learn', 
      icon: BookOpen,
      isActive: currentView === 'learn_dashboard' || currentView.startsWith('learn_')
    },
    { 
      id: 'notation_requests' as AppView, 
      label: 'Notations', 
      icon: FileText,
      isActive: currentView === 'notation_requests'
    },
    { 
      id: 'community_members' as AppView, 
      label: 'Members', 
      icon: Users,
      isActive: currentView === 'community_members'
    },
    { 
      id: 'chats' as AppView, 
      label: 'Chats', 
      icon: MessageSquare,
      isActive: currentView === 'chats'
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-3 pb-3 pt-1 pointer-events-none">
      <nav 
        className="max-w-md mx-auto pointer-events-auto bg-white/90 backdrop-blur-xl border border-bamboo-200/80 rounded-2xl shadow-2xl p-1.5 flex items-center justify-between relative overflow-hidden"
        id="mobile-bottom-nav-container"
      >
        {/* Subtle top bamboo gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'chats' && !currentUser) {
                  onOpenAuth();
                  return;
                }
                onViewChange(tab.id);
              }}
              className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors cursor-pointer select-none ${
                active ? 'text-bamboo-900 font-bold' : 'text-gray-500 hover:text-bamboo-700'
              }`}
              id={`mobile-nav-tab-${tab.id}`}
            >
              {/* Active Animated Background Pill */}
              {active && (
                <motion.div
                  layoutId="mobileNavActivePill"
                  className="absolute inset-0 bg-gradient-to-b from-bamboo-100/90 to-amber-100/70 border border-amber-300/60 rounded-xl shadow-2xs -z-0"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon Container with Springs */}
              <motion.div 
                className="relative z-10 flex items-center justify-center"
                animate={{
                  scale: active ? 1.15 : 1,
                  y: active ? -1 : 0
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon className={`w-5 h-5 transition-colors ${active ? 'text-bamboo-800 stroke-[2.25]' : 'stroke-[1.75]'}`} />
                
                {/* Unread badge for chats */}
                {tab.id === 'chats' && unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </motion.div>

              {/* Label */}
              <span className={`text-[10px] mt-1 font-medium tracking-tight relative z-10 transition-colors ${
                active ? 'text-bamboo-950 font-bold' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>

              {/* Top active dot indicator */}
              {active && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-1 w-1 h-1 rounded-full bg-amber-600"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
