import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, DirectMessage } from '../types';
import { 
  subscribeToAllUserMessages, 
  subscribeToAllUsers,
  sendDirectMessage, 
  deleteDirectMessage, 
  editDirectMessage, 
  blockUser, 
  unblockUser,
  getDirectChatId,
  markChatMessagesAsRead
} from '../lib/db';
import { 
  Search, 
  MessageSquare, 
  Send, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  Image as ImageIcon, 
  X, 
  Ban, 
  ChevronLeft, 
  Sparkles,
  User,
  Check,
  CheckCheck,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatSectionProps {
  currentUser: UserProfile;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
  // Callback when starting chat with a specific user from external trigger (e.g. from feed)
  initialTargetUser?: {
    uid: string;
    displayName: string;
    username?: string;
    photoURL?: string;
  } | null;
  onClearInitialTargetUser?: () => void;
  onOpenImage?: (imageUrl: string) => void;
}

interface ChatGroup {
  chatId: string;
  otherUser: UserProfile | { uid: string; displayName: string; username?: string; photoURL?: string };
  lastMessage: DirectMessage;
  unreadCount: number;
}

export default function ChatSection({ 
  currentUser, 
  onProfileUpdated,
  initialTargetUser,
  onClearInitialTargetUser,
  onOpenImage
}: ChatSectionProps) {
  const [allMessages, setAllMessages] = useState<DirectMessage[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [chatSearch, setChatSearch] = useState('');
  
  // Selected active chat details
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTargetUser, setActiveTargetUser] = useState<{
    uid: string;
    displayName: string;
    username?: string;
    photoURL?: string;
  } | null>(null);

  // Chat message input states
  const [inputText, setInputText] = useState('');
  const [chatImageUrl, setChatImageUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Editing and deleting message states
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [deletingMsgId, setDeletingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  const isBlocked = activeTargetUser ? (currentUser.blockedUsers?.includes(activeTargetUser.uid) || false) : false;

  // 1. Subscribe to all user profiles
  useEffect(() => {
    const unsubscribe = subscribeToAllUsers((users) => {
      setAllUsers(users);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to all direct messages involving the current user
  useEffect(() => {
    const unsubscribe = subscribeToAllUserMessages(currentUser.uid, (msgs) => {
      // Sort messages ascending by creation date
      const sortedMsgs = [...msgs].sort((a, b) => {
        const timeA = a.createdAt?.getTime?.() || new Date(a.createdAt).getTime() || 0;
        const timeB = b.createdAt?.getTime?.() || new Date(b.createdAt).getTime() || 0;
        return timeA - timeB;
      });
      setAllMessages(sortedMsgs);
    });
    return () => unsubscribe();
  }, [currentUser.uid]);

  // 3. Mark messages as read when active chat changes or new messages arrive in the active chat
  useEffect(() => {
    if (activeChatId && currentUser) {
      markChatMessagesAsRead(activeChatId, currentUser.uid);
    }
  }, [activeChatId, allMessages.length, currentUser]);

  // 4. Handle initial external target user from post card clicks
  useEffect(() => {
    if (initialTargetUser) {
      const generatedChatId = getDirectChatId(currentUser.uid, initialTargetUser.uid);
      setActiveChatId(generatedChatId);
      setActiveTargetUser(initialTargetUser);
      // Mark read instantly
      markChatMessagesAsRead(generatedChatId, currentUser.uid);
      // Clear the trigger
      if (onClearInitialTargetUser) {
        onClearInitialTargetUser();
      }
    }
  }, [initialTargetUser, currentUser.uid]);

  // 5. Scroll to bottom of message stream
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatId, allMessages.length, chatImageUrl]);

  // 6. Group messages into conversational threads
  const chatGroups: ChatGroup[] = React.useMemo(() => {
    const groupsMap: { [chatId: string]: DirectMessage[] } = {};
    allMessages.forEach((msg) => {
      if (!groupsMap[msg.chatId]) {
        groupsMap[msg.chatId] = [];
      }
      groupsMap[msg.chatId].push(msg);
    });

    const groupsList: ChatGroup[] = [];

    Object.keys(groupsMap).forEach((chatId) => {
      const msgs = groupsMap[chatId];
      if (msgs.length === 0) return;

      const lastMsg = msgs[msgs.length - 1];

      // Find the other user
      const otherUserId = lastMsg.senderId === currentUser.uid ? lastMsg.receiverId : lastMsg.senderId;
      const foundProfile = allUsers.find(u => u.uid === otherUserId);

      const otherUser = foundProfile || {
        uid: otherUserId,
        displayName: "Flute Sadhaka",
        username: "sadhaka",
        photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      };

      // Unread messages count for this current user receiver
      const unreadCount = msgs.filter(m => m.receiverId === currentUser.uid && !m.read).length;

      groupsList.push({
        chatId,
        otherUser,
        lastMessage: lastMsg,
        unreadCount
      });
    });

    // Sort chat threads by latest message timestamp descending
    return groupsList.sort((a, b) => {
      const timeA = a.lastMessage.createdAt?.getTime?.() || new Date(a.lastMessage.createdAt).getTime() || 0;
      const timeB = b.lastMessage.createdAt?.getTime?.() || new Date(b.lastMessage.createdAt).getTime() || 0;
      return timeB - timeA;
    });
  }, [allMessages, allUsers, currentUser.uid]);

  // Filter threads by search query
  const filteredChatGroups = chatGroups.filter((group) => {
    const name = group.otherUser.displayName.toLowerCase();
    const uname = (group.otherUser.username || '').toLowerCase();
    const query = chatSearch.toLowerCase();
    return name.includes(query) || uname.includes(query);
  });

  // Filtered direct messages for currently selected chat
  const currentChatMessages = React.useMemo(() => {
    if (!activeChatId) return [];
    return allMessages.filter(m => m.chatId === activeChatId);
  }, [allMessages, activeChatId]);

  // Handle image processing for attachments
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select/drop a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size must be under 5MB.");
      return;
    }
    setErrorMsg('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setChatImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Toggle blocking / unblocking users
  const handleToggleBlock = async () => {
    if (!activeTargetUser) return;
    try {
      if (isBlocked) {
        await unblockUser(currentUser.uid, activeTargetUser.uid);
        const updatedProfile = {
          ...currentUser,
          blockedUsers: (currentUser.blockedUsers || []).filter(uid => uid !== activeTargetUser.uid)
        };
        onProfileUpdated(updatedProfile);
      } else {
        await blockUser(currentUser.uid, activeTargetUser.uid);
        const updatedProfile = {
          ...currentUser,
          blockedUsers: [...(currentUser.blockedUsers || []), activeTargetUser.uid]
        };
        onProfileUpdated(updatedProfile);
      }
    } catch (err: any) {
      console.error("Block toggle error:", err);
      setErrorMsg(err.message || "Failed to change block status.");
    }
  };

  // Submit direct message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTargetUser || !activeChatId) return;
    if (isBlocked) {
      setErrorMsg("You cannot send messages to blocked flutists.");
      return;
    }
    if (!inputText.trim() && !chatImageUrl) return;

    setLoading(true);
    setErrorMsg('');
    try {
      await sendDirectMessage(
        activeChatId,
        currentUser.uid,
        activeTargetUser.uid,
        inputText.trim(),
        chatImageUrl || undefined
      );
      setInputText('');
      setChatImageUrl('');
    } catch (err: any) {
      console.error("Send DM error:", err);
      setErrorMsg(err.message || "Could not deliver message.");
    } finally {
      setLoading(false);
    }
  };

  // Submit edits on a message
  const handleSaveEdit = async (msgId: string) => {
    if (!editingText.trim()) return;
    try {
      await editDirectMessage(msgId, editingText.trim());
      setEditingMsgId(null);
      setEditingText('');
    } catch (err) {
      console.error("Edit DM error:", err);
    }
  };

  // Confirm delete message
  const handleDeleteConfirm = async (msgId: string) => {
    try {
      await deleteDirectMessage(msgId);
      setDeletingMsgId(null);
    } catch (err) {
      console.error("Delete DM error:", err);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-bamboo-100/60 overflow-hidden shadow-sm h-[72vh] flex flex-col md:flex-row" id="chat-dashboard-container">
      
      {/* Left Chat Contacts / Threads Column */}
      <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col h-full shrink-0 ${activeChatId ? 'hidden md:flex' : 'flex'}`} id="chat-sidebar-list">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100 bg-white/50 shrink-0">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-display font-bold text-bamboo-800 text-sm flex items-center gap-1.5">
              <MessageSquare className="w-4.5 h-4.5 text-amber-600" />
              Direct Conversations
            </h3>
            <span className="text-[10px] bg-bamboo-50 text-bamboo-700 font-bold px-2 py-0.5 rounded-full border border-bamboo-100/40">
              {chatGroups.length} Active
            </span>
          </div>

          {/* Search conversations */}
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200/50 focus-within:ring-2 focus-within:ring-bamboo-600 focus-within:border-transparent transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Filter by name or @username..."
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-700 focus:outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* List of Chat Threads */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50/60 p-2 space-y-1" id="chat-threads-list">
          {filteredChatGroups.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2.5 px-4">
              <div className="p-3 bg-bamboo-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-bamboo-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">No chats found</p>
                <p className="text-[10px] text-gray-400 leading-normal max-w-[200px] mx-auto mt-1">
                  Start a new direct message by clicking on any flutist's profile avatar on a post in the community feed!
                </p>
              </div>
            </div>
          ) : (
            filteredChatGroups.map((group) => {
              const isSelected = activeChatId === group.chatId;
              const isUnread = group.unreadCount > 0;
              const lastMsgText = group.lastMessage.imageUrl ? "📷 Image Attached" : group.lastMessage.text;

              return (
                <button
                  key={group.chatId}
                  onClick={() => {
                    setActiveChatId(group.chatId);
                    setActiveTargetUser(group.otherUser);
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-start gap-3 relative cursor-pointer ${
                    isSelected 
                      ? "bg-bamboo-50 border border-bamboo-100/50 shadow-3xs text-bamboo-950" 
                      : isUnread 
                        ? "bg-amber-50/60 hover:bg-gray-50 border border-amber-100/50" 
                        : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  {/* Indicator for unread / message highlight */}
                  {isUnread && (
                    <span className="absolute top-3.5 right-3.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                    </span>
                  )}

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={group.otherUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                      alt={group.otherUser.displayName}
                      className={`w-10 h-10 rounded-full object-cover bg-white border ${
                        isUnread ? 'border-yellow-400 ring-2 ring-yellow-200/50' : 'border-gray-200'
                      }`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    {isUnread && (
                      <span className="absolute -bottom-1.5 -right-1 bg-yellow-500 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                        {group.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Details snippet */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs truncate block ${isUnread ? 'font-extrabold text-gray-900' : 'font-semibold text-gray-800'}`}>
                        {group.otherUser.displayName}
                      </span>
                      <span className="text-[9px] text-gray-400 shrink-0">
                        {group.lastMessage.createdAt ? new Date(group.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <p className="text-[10px] text-bamboo-700 font-mono leading-none">
                      @{group.otherUser.username || group.otherUser.displayName.toLowerCase().replace(/[^a-z0-9_]/g, '')}
                    </p>

                    <p className={`text-[11px] truncate mt-1 ${isUnread ? 'font-bold text-amber-900' : 'text-gray-500'}`}>
                      {group.lastMessage.senderId === currentUser.uid ? 'You: ' : ''}{lastMsgText}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Conversational Stream Column */}
      <div className={`flex-1 flex flex-col h-full bg-white relative ${!activeChatId ? 'hidden md:flex items-center justify-center text-center p-8 text-gray-400' : 'flex'}`} id="chat-main-panel">
        
        {/* 1. Empty State when no conversation is selected */}
        {!activeChatId ? (
          <div className="space-y-4 max-w-sm flex flex-col items-center">
            <div className="p-5 bg-bamboo-50 rounded-full text-bamboo-600 shadow-3xs flex items-center justify-center">
              <MessageSquare className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-700">Your Sadhana Sanctuary Mailbox</h4>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-xs">
                Exchange knowledge, request reviews on raw compositions, or talk with fellow Bansuri sadhakas around the world.
              </p>
            </div>
            <p className="text-[11px] text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-100 font-semibold">
              Select any active chat thread to view messages
            </p>
          </div>
        ) : (
          /* 2. Conversational Content View */
          <>
            {/* Active Header */}
            <div className="px-5 py-3.5 bg-bamboo-800 text-white flex items-center justify-between border-b border-bamboo-700/50 shrink-0" id="chat-stream-header">
              <div className="flex items-center space-x-3 min-w-0">
                {/* Back button for mobile view */}
                <button
                  onClick={() => {
                    setActiveChatId(null);
                    setActiveTargetUser(null);
                  }}
                  className="p-1 hover:bg-bamboo-700/50 rounded-lg transition mr-1 md:hidden text-white"
                  title="Back to Chats List"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <img 
                  src={activeTargetUser?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
                  alt={activeTargetUser?.displayName} 
                  className="w-10 h-10 rounded-full object-cover border border-bamboo-400 bg-white shrink-0 shadow-3xs"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm leading-tight truncate">{activeTargetUser?.displayName}</h3>
                  <p className="text-[11px] text-bamboo-200 font-mono leading-none mt-0.5">
                    @{activeTargetUser?.username || activeTargetUser?.displayName?.toLowerCase().replace(/[^a-z0-9_]/g, '')}
                  </p>
                </div>
              </div>

              {/* Header block toggle */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={handleToggleBlock}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all flex items-center gap-1 shadow-3xs border ${
                    isBlocked 
                      ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                      : "bg-bamboo-700/50 hover:bg-bamboo-700/80 text-white border-bamboo-600/40"
                  }`}
                  title={isBlocked ? "Unblock this user" : "Block this user"}
                  id="active-chat-block-btn"
                >
                  <Ban className="w-3 h-3" />
                  <span>{isBlocked ? "Blocked" : "Block"}</span>
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 relative"
              id="active-chat-message-stream"
            >
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-center space-x-2 sticky top-0 z-10 shadow-xs">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                  <button onClick={() => setErrorMsg('')} className="ml-auto text-red-400 hover:text-red-600 font-bold">×</button>
                </div>
              )}

              {isBlocked && (
                <div className="p-4 text-center bg-red-50 border border-red-100 text-red-700 rounded-xl space-y-1 my-2">
                  <Ban className="w-5 h-5 mx-auto text-red-500" />
                  <p className="text-xs font-bold">You have blocked this flutist</p>
                  <p className="text-[10px] text-gray-500">Unblock them to resume sending and receiving direct messages.</p>
                </div>
              )}

              {currentChatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 space-y-3">
                  <div className="p-4 bg-bamboo-50 rounded-full text-bamboo-600">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700">Start the Sadhana Dialogue</p>
                    <p className="text-[10px] text-gray-400 max-w-xs mt-1 leading-normal">
                      Every connection starts with a simple breath. Ask about their Bansuri models, practice timings, or cover techniques!
                    </p>
                  </div>
                </div>
              ) : (
                currentChatMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.uid;
                  const isEditing = editingMsgId === msg.id;
                  const isDeleting = deletingMsgId === msg.id;

                  return (
                    <div 
                      key={msg.id} 
                      className={`flex items-start gap-2.5 max-w-[85%] group/msg ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      {/* Avatar for stream */}
                      <img
                        src={isMe ? currentUser.photoURL : (activeTargetUser?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")}
                        alt={isMe ? "You" : activeTargetUser?.displayName}
                        className="w-7 h-7 rounded-full object-cover border border-gray-100 shadow-3xs shrink-0 mt-0.5 bg-white"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />

                      {/* Bubble wrapper */}
                      <div className="relative">
                        {isDeleting ? (
                          <div className="bg-red-50 border border-red-100 rounded-2xl p-3 text-center space-y-2 min-w-[200px] shadow-xs">
                            <p className="text-[11px] font-semibold text-red-700">Delete this message?</p>
                            <div className="flex justify-center gap-1.5">
                              <button
                                onClick={() => setDeletingMsgId(null)}
                                className="px-2 py-0.5 bg-white text-[10px] text-gray-600 rounded-md border border-gray-200 font-semibold"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(msg.id)}
                                className="px-2 py-0.5 bg-red-600 text-white text-[10px] rounded-md font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className={`p-3 rounded-2xl relative ${
                              isMe 
                                ? 'bg-bamboo-700 text-white rounded-tr-xs' 
                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-xs'
                            } shadow-3xs`}
                          >
                            {isEditing ? (
                              <div className="space-y-2 min-w-[200px]">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="w-full p-2 text-xs text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-bamboo-600"
                                  rows={2}
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingMsgId(null);
                                      setEditingText('');
                                    }}
                                    className="px-2 py-0.5 text-[10px] text-gray-500 hover:bg-gray-100 rounded transition font-medium bg-white border border-gray-100"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSaveEdit(msg.id)}
                                    className="px-2.5 py-0.5 text-[10px] bg-bamboo-800 text-white hover:bg-bamboo-900 rounded transition font-bold"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                
                                {msg.imageUrl && (
                                  <div 
                                    className="mt-2 rounded-lg overflow-hidden max-h-48 border border-black/5 bg-gray-50 cursor-pointer"
                                    onClick={() => onOpenImage?.(msg.imageUrl!)}
                                  >
                                    <img 
                                      src={msg.imageUrl} 
                                      alt="Message Attachment" 
                                      className="max-h-48 w-full object-cover"
                                      referrerPolicy="no-referrer"
                                      loading="lazy"
                                    />
                                  </div>
                                )}

                                {/* Timestamp & Status Indicator */}
                                <div className={`flex items-center gap-1.5 text-[8px] mt-1.5 justify-end ${isMe ? 'text-bamboo-200' : 'text-gray-400'}`}>
                                  <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                  {msg.editedAt && <span>• Edited</span>}
                                  {isMe && (
                                    <span>
                                      {msg.read ? (
                                        <CheckCheck className="w-3 h-3 text-yellow-300 inline" />
                                      ) : (
                                        <Check className="w-3 h-3 text-bamboo-300 inline" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Hover Actions (Edit/Delete) */}
                            {isMe && !isEditing && (
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-150 flex items-center space-x-1 bg-white border border-gray-100 p-1 rounded-lg shadow-sm">
                                <button
                                  onClick={() => {
                                    setEditingMsgId(msg.id);
                                    setEditingText(msg.text);
                                  }}
                                  className="p-1 hover:bg-gray-100 text-gray-500 hover:text-bamboo-700 rounded transition"
                                  title="Edit message"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeletingMsgId(msg.id);
                                  }}
                                  className="p-1 hover:bg-gray-100 text-gray-400 hover:text-red-600 rounded transition"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Attached Image Preview bar */}
            {chatImageUrl && (
              <div className="px-4 py-2 border-t border-gray-100 bg-white flex items-center justify-start shrink-0">
                <div className="relative border border-gray-200 rounded-lg p-1 bg-gray-50 shadow-3xs flex items-center space-x-2">
                  <img 
                    src={chatImageUrl} 
                    alt="Attachment Preview" 
                    className="h-12 w-12 object-cover rounded"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="text-[10px] text-gray-400 font-semibold pr-4">Image Attachment Included</div>
                  <button
                    type="button"
                    onClick={() => setChatImageUrl('')}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white p-0.5 rounded-full transition shadow-xs cursor-pointer"
                    title="Remove Image"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Input Form Box */}
            <div className="p-4 border-t border-gray-100 bg-white shrink-0" id="chat-input-form-box">
              <form
                onSubmit={handleSendMessage}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`flex items-center space-x-2 p-1 rounded-xl transition-all ${
                  dragActive ? "bg-bamboo-50/50 border border-dashed border-bamboo-500" : ""
                }`}
              >
                <div className="flex-1 flex items-center space-x-2 bg-gray-50/70 px-3.5 py-2.5 rounded-xl border border-gray-200/60 focus-within:ring-2 focus-within:ring-bamboo-600 focus-within:border-transparent min-w-0 transition-all">
                  <input
                    type="text"
                    placeholder={dragActive ? "Drop image file here..." : isBlocked ? "Unblock this flutist to write..." : "Type your direct message..."}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={loading || isBlocked}
                    className="flex-1 bg-transparent text-xs text-gray-700 focus:outline-none placeholder-gray-400 min-w-0"
                  />

                  {/* Attachment button */}
                  <button
                    type="button"
                    onClick={() => document.getElementById('chat-dashboard-image-input')?.click()}
                    disabled={loading || isBlocked}
                    className="text-gray-400 hover:text-bamboo-700 transition shrink-0 p-0.5 disabled:opacity-50 cursor-pointer"
                    title="Attach image (Drag & Drop also supported)"
                  >
                    <ImageIcon className="w-4.5 h-4.5" />
                  </button>
                  <input 
                    type="file"
                    id="chat-dashboard-image-input"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={loading || isBlocked}
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={loading || isBlocked || (!inputText.trim() && !chatImageUrl)}
                    className="text-bamboo-700 hover:text-bamboo-800 disabled:text-gray-300 transition shrink-0 cursor-pointer"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
