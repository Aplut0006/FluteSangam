import React, { useState, useEffect, useRef } from 'react';
import { AppNotification, UserProfile } from '../types';
import { subscribeToNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../lib/db';
import { Bell, Heart, MessageSquare, CheckCheck, Sparkles, X } from 'lucide-react';

interface NotificationsDropdownProps {
  currentUser: UserProfile;
  onSelectPost: (postId: string) => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  if (diffInSecs < 60) return 'Just now';
  const diffInMins = Math.floor(diffInSecs / 60);
  if (diffInMins < 60) return `${diffInMins}m ago`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationsDropdown({ currentUser, onSelectPost }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToNotifications(currentUser.uid, (data) => {
      setNotifications(data);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
    setIsOpen(false);
    onSelectPost(notification.postId);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(currentUser.uid);
  };

  return (
    <div className="relative" ref={dropdownRef} id="notifications-dropdown-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-600 hover:text-bamboo-800 hover:bg-bamboo-50 transition cursor-pointer flex items-center justify-center"
        title="Notifications"
        id="notifications-bell-btn"
      >
        <Bell className="w-5 h-5 text-gray-700 hover:text-bamboo-800 transition" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] font-black h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white border border-bamboo-100 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right animate-fadeIn"
          id="notifications-popover"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-bamboo-800 to-bamboo-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-300" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="bg-amber-500 text-bamboo-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-semibold text-bamboo-100 hover:text-white flex items-center gap-1 transition cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-bamboo-200 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of notifications */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100/80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 bg-bamboo-50 rounded-full flex items-center justify-center text-bamboo-600 mx-auto">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-xs font-semibold text-gray-700">No notifications yet</p>
                <p className="text-[11px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                  When other musicians like or comment on your posts, you'll see instant updates here!
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`w-full text-left p-3.5 transition flex items-start gap-3 hover:bg-bamboo-50/60 cursor-pointer ${
                    !item.read ? 'bg-amber-50/40' : 'bg-white'
                  }`}
                >
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={item.senderPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                      alt={item.senderName}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute -bottom-1 -right-1 p-0.5 rounded-full border border-white ${
                      item.type === 'like' ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {item.type === 'like' ? (
                        <Heart className="w-2.5 h-2.5 fill-current" />
                      ) : (
                        <MessageSquare className="w-2.5 h-2.5 fill-current" />
                      )}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-800 leading-snug">
                      <strong className="font-bold text-gray-900">{item.senderName}</strong>{' '}
                      {item.type === 'like' ? (
                        <span>liked your post <span className="font-medium text-bamboo-800">"{item.postTitle}"</span></span>
                      ) : (
                        <span>commented on <span className="font-medium text-bamboo-800">"{item.postTitle}"</span></span>
                      )}
                    </p>

                    {item.type === 'comment' && item.commentText && (
                      <p className="text-[11px] text-gray-500 truncate mt-1 italic bg-gray-50/80 px-2 py-1 rounded-md border border-gray-100">
                        "{item.commentText}"
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
