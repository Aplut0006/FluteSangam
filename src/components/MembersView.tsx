import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { subscribeToAllUsers } from '../lib/db';
import { Search, Users } from 'lucide-react';

interface MembersViewProps {
  onUserProfileClick: (userId: string) => void;
}

export default function MembersView({ onUserProfileClick }: MembersViewProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToAllUsers((loadedUsers) => {
      setUsers(loadedUsers);
    });
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-bamboo-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            Community Members
          </h2>
          <span className="text-xs font-semibold text-bamboo-700 bg-bamboo-50 border border-bamboo-200/60 px-2.5 py-0.5 rounded-full sm:hidden">
            {filteredUsers.length}
          </span>
        </div>
        
        <div className="relative flex items-center bg-white px-3.5 py-2.5 rounded-xl border border-bamboo-200 shadow-2xs focus-within:ring-2 focus-within:ring-bamboo-600 focus-within:border-transparent w-full sm:w-72 transition-all">
          <Search className="w-4 h-4 text-gray-400 shrink-0 mr-2" />
          <input
            type="text"
            placeholder="Search member or @username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-gray-800 focus:outline-none placeholder-gray-400 w-full min-w-0"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-gray-400 hover:text-gray-600 px-1 font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-bamboo-200 p-6 space-y-2">
          <p className="text-sm font-semibold text-gray-700">No members found matching &quot;{searchQuery}&quot;</p>
          <p className="text-xs text-gray-500">Try searching for a different name or username.</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs font-bold text-bamboo-700 hover:underline cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUsers.map(user => (
            <button
              key={user.uid}
              onClick={() => onUserProfileClick(user.uid)}
              className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer text-left"
            >
              <img
                src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-bamboo-100"
              />
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{user.displayName}</p>
                <p className="text-[11px] text-gray-500 font-mono">@{user.username}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
