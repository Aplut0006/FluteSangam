import React from 'react';
import { motion } from 'motion/react';
import { Compass, BookOpen, Music, Radio } from 'lucide-react';
import { AppView, UserProfile } from '../types';
import { VIEW_URLS } from '../routes';

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
      isActive: currentView === 'learn_dashboard' || (currentView.startsWith('learn_') && currentView !== 'learn_tuner')
    },
    { 
      id: 'learn_tuner' as AppView, 
      label: 'Tuner', 
      icon: Radio,
      isActive: currentView === 'learn_tuner'
    },
    { 
      id: 'notation_requests' as AppView, 
      label: 'Notations', 
      icon: Music,
      isActive: currentView === 'notation_requests'
    },
  ];

  return (
    <div 
      className="fixed bottom-0 inset-x-0 z-[999] md:hidden bg-white/98 border-t border-bamboo-200/80 shadow-[0_-4px_25px_rgba(0,0,0,0.1)] transition-transform duration-200 ease-out"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        willChange: 'transform'
      }}
    >
      <nav 
        className="max-w-md mx-auto px-3 pt-2 pb-1 flex items-center justify-around relative"
        id="mobile-bottom-nav-container"
      >
        {/* Subtle top bamboo gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive;

          return (
            <a
              key={tab.id}
              href={VIEW_URLS[tab.id] || '/'}
              onClick={(e) => {
                e.preventDefault();
                onViewChange(tab.id);
              }}
              className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer select-none ${
                active ? 'text-bamboo-900 font-bold' : 'text-gray-500 hover:text-bamboo-700'
              }`}
              id={`mobile-nav-tab-${tab.id}`}
            >
              {/* Active Animated Pill */}
              {active && (
                <motion.div
                  layoutId="mobileNavActivePill"
                  className="absolute inset-x-1.5 inset-y-0.5 bg-gradient-to-b from-bamboo-100/90 to-amber-100/70 border border-amber-300/60 rounded-xl shadow-2xs -z-0"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}

              {/* Icon Container with Springs */}
              <motion.div 
                className="relative z-10 flex items-center justify-center"
                animate={{
                  scale: active ? 1.12 : 1,
                  y: active ? -1 : 0
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon className={`w-5 h-5 transition-colors ${active ? 'text-bamboo-850 stroke-[2.25]' : 'stroke-[1.75]'}`} />
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
                  className="absolute top-0.5 w-1 h-1 rounded-full bg-amber-600"
                />
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
