import React from 'react';
import { Compass, BookOpen, MessageSquare, HelpCircle, Users } from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface MobileBottomNavProps {
  onViewChange: (view: AppView) => void;
  onOpenAuth: () => void;
  currentUser: UserProfile | null;
  unreadCount: number;
}

export default function MobileBottomNav({ 
  onViewChange, 
  onOpenAuth, 
  currentUser,
  unreadCount 
}: MobileBottomNavProps) {
  const tabs: { id: AppView | 'tips', label: string, icon: any }[] = [
    { id: 'community', label: 'Feed', icon: Compass },
    { id: 'community_members', label: 'Members', icon: Users },
    { id: 'learn_raagas', label: 'Ragas', icon: BookOpen },
    { id: 'chats', label: 'Chats', icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 md:hidden flex justify-around items-center p-2 pb-4 shadow-t-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'chats' && !currentUser) {
                onOpenAuth();
                return;
              }
              if (tab.id === 'tips') {
                onViewChange('community');
                setTimeout(() => {
                  document.getElementById('right-sidebar-tips')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                return;
              }
              onViewChange(tab.id as AppView);
            }}
            className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-bamboo-700 transition-colors"
          >
            <div className="relative">
              <Icon className="w-6 h-6" />
              {tab.id === 'chats' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
