import React, { useState, useEffect } from 'react';
import { Post, Comment, UserProfile } from '../types';
import { 
  toggleLikePost, 
  subscribeToComments, 
  addComment, 
  editComment, 
  deleteComment, 
  toggleLikeComment, 
  toggleDislikeComment,
  deletePost
} from '../lib/db';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Send, 
  Music, 
  Sparkles, 
  Video,
  ThumbsUp,
  ThumbsDown,
  Edit2,
  Trash2,
  Image as ImageIcon,
  X,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';

interface PostDetailViewProps {
  post: Post;
  currentUser: UserProfile | null;
  onBack: () => void;
  onOpenAuth: () => void;
  onOpenShare: (post: Post) => void;
  onStartChat?: (targetUser: { uid: string; displayName: string; username?: string; photoURL?: string }) => void;
  onUserProfileClick?: (userId: string) => void;
  onEditPost?: (post: Post) => void;
  autoFocusComment?: boolean;
}

export default function PostDetailView({ 
  post: initialPost, 
  currentUser, 
  onBack, 
  onOpenAuth, 
  onOpenShare, 
  onStartChat,
  onUserProfileClick,
  onEditPost,
  autoFocusComment = false
}: PostDetailViewProps) {
  const [post, setPost] = useState<Post>(initialPost);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [commentImageUrl, setCommentImageUrl] = useState('');
  const [commentError, setCommentError] = useState('');
  
  // Reply and input ref
  const [replyingTo, setReplyingTo] = useState<{ id: string, name: string, text: string } | null>(null);
  const commentInputRef = React.useRef<HTMLInputElement>(null);

  // Focus comment input on mount if autoFocusComment is true
  useEffect(() => {
    if (autoFocusComment) {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 100);
    }
  }, [autoFocusComment]);
  
  // Editing state for comments
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // Post deletion confirmation
  const [showPostDeleteConfirm, setShowPostDeleteConfirm] = useState(false);

  // Synchronize post with initialPost or any external updates
  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  // Subscribe to comments
  useEffect(() => {
    const unsubscribe = subscribeToComments(post.id, (loadedComments) => {
      setComments(loadedComments);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [post.id]);

  // Handle comment image selection
  const handleCommentImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setCommentError("Only image files are allowed.");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setCommentError("Image must be smaller than 1.5MB.");
      return;
    }
    setCommentError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCommentImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCommentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCommentImageFile(file);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!commentText.trim() && !commentImageUrl) return;

    setLoadingComment(true);
    try {
      await addComment(post.id, {
        postId: post.id,
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        authorPhoto: currentUser.photoURL,
        authorUsername: currentUser.username,
        text: commentText.trim(),
        imageUrl: commentImageUrl || undefined,
        parentId: replyingTo?.id,
        replyToName: replyingTo?.name,
        replyToText: replyingTo?.text
      });
      setCommentText('');
      setCommentImageUrl('');
      setCommentError('');
      setReplyingTo(null);
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    try {
      const isLikedAlready = post.likes.includes(currentUser.uid);
      await toggleLikePost(post.id, currentUser.uid, isLikedAlready);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id);
      onBack();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Badge functions
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

  const getCategoryTag = (category: string) => {
    switch (category) {
      case 'Performance':
        return "bg-purple-100 text-purple-700 font-bold";
      case 'Tutorial':
        return "bg-sky-100 text-sky-700 font-bold";
      case 'Raga Discussion':
        return "bg-amber-100 text-amber-700 font-bold";
      case 'Review':
        return "bg-emerald-100 text-emerald-700 font-bold";
      default:
        return "bg-gray-100 text-gray-700 font-bold";
    }
  };

  const hasLiked = currentUser ? post.likes.includes(currentUser.uid) : false;
  const isPostAuthor = currentUser?.uid === post.authorId;

  return (
    <div className="space-y-6" id="post-detail-page-view">
      {/* Back navigation button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-bamboo-800 hover:text-bamboo-900 bg-white/70 backdrop-blur-3xs border border-bamboo-100 px-4 py-2.5 rounded-xl transition cursor-pointer shadow-3xs hover:translate-x-[-2px] duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        {isPostAuthor && (
          <div className="flex items-center space-x-2">
            {onEditPost && (
              <button
                onClick={() => onEditPost(post)}
                className="inline-flex items-center space-x-1 text-xs font-bold text-bamboo-700 hover:text-bamboo-800 hover:bg-bamboo-50 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Post</span>
              </button>
            )}
            <button
              onClick={() => setShowPostDeleteConfirm(true)}
              className="inline-flex items-center space-x-1 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Post</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Post on Left, Sidebar Meta/Comments on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main Post Card details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="frosted-panel rounded-2xl overflow-hidden shadow-sm p-6 space-y-5 bg-white border border-bamboo-100/50">
            {/* Header with Author and Tags */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-3.5">
                <button
                  onClick={() => {
                    if (onUserProfileClick) {
                      onUserProfileClick(post.authorId);
                    }
                  }}
                  className="text-left shrink-0 transition-opacity hover:opacity-85 cursor-pointer"
                  title={`View profile of @${post.authorUsername || post.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka'}`}
                >
                  <img
                    src={post.authorPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                    alt={post.authorName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-bamboo-100 bg-white"
                  />
                </button>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <button
                      onClick={() => {
                        if (onUserProfileClick) {
                          onUserProfileClick(post.authorId);
                        }
                      }}
                      className="font-extrabold text-gray-950 text-sm md:text-base leading-none transition-colors text-left hover:text-bamboo-700 hover:underline cursor-pointer"
                    >
                      {post.authorName}
                    </button>
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold tracking-wide uppercase border ${getLevelBadge(post.authorLevel)}`}>
                      {post.authorLevel}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1.5 mt-1.5">
                    <button
                      onClick={() => {
                        if (onUserProfileClick) {
                          onUserProfileClick(post.authorId);
                        }
                      }}
                      className="text-[11px] text-bamboo-700 font-mono font-medium hover:text-bamboo-800 hover:underline cursor-pointer"
                    >
                      @{post.authorUsername || post.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka'}
                    </button>
                    <span className="text-gray-300 text-xs">•</span>
                    <p className="text-[11px] text-gray-400 font-medium">Bansuri Enthusiast</p>
                  </div>
                </div>
              </div>

              {/* Categorization chips */}
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full ${getCategoryTag(post.category)}`}>
                  {post.category}
                </span>
                {post.raga && (
                  <span className="text-[10px] sm:text-xs bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-amber-600" />
                    Raga {post.raga}
                  </span>
                )}
              </div>
            </div>

            {/* Post Title */}
            <h1 className="font-display font-extrabold text-gray-950 text-xl md:text-2.5xl leading-tight">
              {post.title}
            </h1>

            {/* Post Description */}
            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
              {post.description}
            </p>

            {/* High-res Image Attachment */}
            {post.imageUrl && (
              <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 max-h-[500px] flex justify-center items-center shadow-3xs">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[500px] w-full object-contain"
                />
              </div>
            )}

            {/* Embedded Responsive Video Frame */}
            {post.videoUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-gray-100 shadow-3xs">
                <iframe
                  src={post.videoUrl}
                  title={post.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 text-xs sm:text-sm font-semibold transition ${
                  hasLiked 
                    ? "text-red-500 scale-105" 
                    : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${hasLiked ? "fill-current text-red-500" : ""}`} />
                <span className="font-bold">{post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}</span>
              </button>

              <button
                onClick={() => onOpenShare(post)}
                className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-bamboo-700 transition"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-bold">Share Post</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Comments Board */}
        <div className="lg:col-span-4 space-y-6">
          <div className="frosted-panel rounded-2xl p-5 space-y-5 bg-white border border-bamboo-100/50 shadow-sm flex flex-col max-h-[85vh]">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h3 className="font-display font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <MessageCircle className="w-4.5 h-4.5 text-bamboo-700" />
                Discussion Board ({comments.length})
              </h3>
            </div>

            {/* Comments List Container */}
            {comments.length > 0 && (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[150px] max-h-[400px] lg:max-h-[50vh]">
                {comments.map((comm) => {
                  const isAuthor = currentUser?.uid === comm.authorId;
                  const isEditing = editingCommentId === comm.id;
                  const likesCount = comm.likes?.length || 0;
                  const dislikesCount = comm.dislikes?.length || 0;
                  const commLiked = currentUser ? comm.likes?.includes(currentUser.uid) : false;
                  const commDisliked = currentUser ? comm.dislikes?.includes(currentUser.uid) : false;

                  return (
                    <div key={comm.id} className="flex items-start space-x-2.5 text-xs group/comm animate-fadeIn">
                      <button
                        onClick={() => {
                          if (onUserProfileClick) {
                            onUserProfileClick(comm.authorId);
                          }
                        }}
                        className="shrink-0 transition-opacity hover:opacity-85 cursor-pointer"
                        title={`View profile of @${comm.authorUsername || comm.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka'}`}
                      >
                        <img
                          src={comm.authorPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                          alt={comm.authorName}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover mt-0.5 border border-bamboo-100"
                        />
                      </button>
                      <div className="flex-1 bg-gray-50/75 p-2.5 rounded-xl border border-gray-200/50">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-baseline space-x-1.5 flex-wrap">
                            <button
                              onClick={() => {
                                if (onUserProfileClick) {
                                  onUserProfileClick(comm.authorId);
                                }
                              }}
                              className="font-bold text-gray-900 transition-colors text-left hover:text-bamboo-700 hover:underline cursor-pointer"
                            >
                              {comm.authorName}
                            </button>
                            <button
                              onClick={() => {
                                if (onUserProfileClick) {
                                  onUserProfileClick(comm.authorId);
                                }
                              }}
                              className="text-[10px] text-bamboo-700 font-mono font-medium hover:text-bamboo-800 hover:underline cursor-pointer"
                            >
                              @{comm.authorUsername || comm.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka'}
                            </button>
                          </div>
                          
                          {isAuthor && !isEditing && (
                            <div className="flex items-center space-x-1.5 opacity-0 group-hover/comm:opacity-100 transition duration-150">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comm.id);
                                  setEditingText(comm.text);
                                }}
                                className="text-gray-400 hover:text-bamboo-700 transition p-0.5"
                                title="Edit Comment"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setCommentToDelete(comm.id)}
                                className="text-gray-400 hover:text-red-600 transition p-0.5"
                                title="Delete Comment"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {comm.replyToName && (
                          <div className="text-[10px] text-gray-500 mb-1 flex flex-col bg-white/50 w-fit max-w-full px-2 py-1 rounded border border-gray-100 border-l-2 border-l-bamboo-400">
                            <span className="flex items-center gap-1 font-medium text-bamboo-700">
                              <MessageCircle className="w-2.5 h-2.5" />
                              Replying to {comm.replyToName}
                            </span>
                            {comm.replyToText && (
                              <span className="truncate italic text-gray-400 pl-3.5">
                                "{comm.replyToText}"
                              </span>
                            )}
                          </div>
                        )}

                        {isEditing ? (
                          <div className="space-y-1.5 mt-1.5">
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-bamboo-600 text-gray-700 bg-white"
                              rows={2}
                            />
                            <div className="flex justify-end space-x-1.5">
                              <button
                                onClick={() => setEditingCommentId(null)}
                                className="px-2 py-0.5 text-[10px] text-gray-500 hover:bg-gray-100 rounded transition"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={async () => {
                                  if (!editingText.trim()) return;
                                  try {
                                    await editComment(post.id, comm.id, editingText.trim());
                                    setEditingCommentId(null);
                                  } catch (err) {
                                    console.error("Failed to edit comment:", err);
                                  }
                                }}
                                className="px-2.5 py-0.5 text-[10px] bg-bamboo-700 text-white hover:bg-bamboo-800 rounded font-semibold transition"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-600 leading-normal mb-1.5">{comm.text}</p>
                            {comm.imageUrl && (
                              <div className="mt-2 rounded-lg overflow-hidden border border-gray-100 max-h-40 flex items-center justify-start bg-gray-50/50">
                                <img 
                                  src={comm.imageUrl} 
                                  alt="Comment Attachment" 
                                  className="max-h-40 object-contain rounded-md"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-3 text-[10px] text-gray-400 border-t border-gray-100/50 pt-1.5 mt-1">
                              <button
                                onClick={async () => {
                                  if (!currentUser) {
                                    onOpenAuth();
                                    return;
                                  }
                                  try {
                                    await toggleLikeComment(post.id, comm.id, currentUser.uid, !!commLiked);
                                  } catch (err) {
                                    console.error("Like comment error:", err);
                                  }
                                }}
                                className={`flex items-center space-x-1 hover:text-bamboo-700 transition ${commLiked ? 'text-bamboo-700 font-bold' : ''}`}
                              >
                                <ThumbsUp className={`w-3 h-3 ${commLiked ? 'fill-bamboo-600 text-bamboo-600' : ''}`} />
                                <span>{likesCount}</span>
                              </button>

                              <button
                                onClick={async () => {
                                  if (!currentUser) {
                                    onOpenAuth();
                                    return;
                                  }
                                  try {
                                    await toggleDislikeComment(post.id, comm.id, currentUser.uid, !!commDisliked);
                                  } catch (err) {
                                    console.error("Dislike comment error:", err);
                                  }
                                }}
                                className={`flex items-center space-x-1 hover:text-red-700 transition ${commDisliked ? 'text-red-700 font-bold' : ''}`}
                              >
                                <ThumbsDown className={`w-3 h-3 ${commDisliked ? 'fill-red-500 text-red-500' : ''}`} />
                                <span>{dislikesCount}</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (!currentUser) {
                                    onOpenAuth();
                                    return;
                                  }
                                  setReplyingTo({ id: comm.id, name: comm.authorName, text: comm.text });
                                  setTimeout(() => {
                                    commentInputRef.current?.focus();
                                  }, 50);
                                }}
                                className="flex items-center space-x-1 hover:text-bamboo-700 transition"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>Reply</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Comment Composer at bottom */}
            {currentUser ? (
              <div className="space-y-2 pt-3 border-t border-gray-100">
                {commentImageUrl && (
                  <div className="relative inline-block border border-gray-200 rounded-lg p-1 bg-white shadow-3xs">
                    <img 
                      src={commentImageUrl} 
                      alt="Comment Preview" 
                      className="h-14 w-14 object-cover rounded"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setCommentImageUrl('')}
                      className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white p-0.5 rounded-full transition shadow-xs"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}

                {commentError && (
                  <p className="text-[10px] text-red-600">{commentError}</p>
                )}

                {replyingTo && (
                  <div className="flex items-center justify-between bg-bamboo-50 px-3 py-2 rounded-lg text-xs text-bamboo-800 border border-bamboo-100">
                    <div className="flex flex-col gap-0.5 max-w-[85%]">
                      <span className="flex items-center gap-1.5 font-bold">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Replying to {replyingTo.name}
                      </span>
                      <span className="text-[10px] text-bamboo-600 truncate italic">
                        "{replyingTo.text}"
                      </span>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="text-bamboo-500 hover:text-bamboo-800 transition p-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <form 
                  onSubmit={handleCommentSubmit}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-bamboo-100 shrink-0"
                  />
                  <div className="flex-1 flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-bamboo-600 focus-within:border-transparent min-w-0 transition">
                    <input
                      ref={commentInputRef}
                      type="text"
                      placeholder="Discuss bansuri technique, taans, tips..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      disabled={loadingComment}
                      className="flex-1 bg-transparent text-xs text-gray-700 focus:outline-none placeholder-gray-400 min-w-0"
                    />
                    
                    <button
                      type="button"
                      onClick={() => document.getElementById(`comment-image-file-detail-${post.id}`)?.click()}
                      className="text-gray-400 hover:text-bamboo-700 transition shrink-0 p-0.5"
                      title="Attach Image"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <input 
                      type="file"
                      id={`comment-image-file-detail-${post.id}`}
                      accept="image/*"
                      className="hidden"
                      onChange={handleCommentImageChange}
                    />

                    <button
                      type="submit"
                      disabled={loadingComment || (!commentText.trim() && !commentImageUrl)}
                      className="text-bamboo-700 hover:text-bamboo-800 disabled:text-gray-300 transition shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-3 bg-amber-50/80 border border-amber-200/60 rounded-xl text-center space-y-2 pt-3 border-t border-gray-100">
                <p className="text-[11px] text-amber-900 leading-normal flex items-center justify-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
                  Sign up or log in to join the discussion!
                </p>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold tracking-wider rounded-lg uppercase transition shadow-3xs cursor-pointer"
                >
                  Join Community
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Deletion Dialog Overlay */}
      {showPostDeleteConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl border border-red-100 animate-scaleUp">
            <div className="mx-auto w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-950 text-base">Delete Your Performance Post?</h4>
              <p className="text-xs text-gray-500 leading-normal">
                Are you sure you want to permanently delete "{post.title}"? This will remove all likes, comments, and recordings. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowPostDeleteConfirm(false)}
                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 rounded-xl transition border border-gray-200 cursor-pointer"
              >
                No, Keep It
              </button>
              <button
                onClick={handleDeletePost}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-xl transition shadow-sm shadow-red-200 cursor-pointer"
              >
                Yes, Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Deletion Overlay */}
      {commentToDelete && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-xl border border-gray-100 space-y-4 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-950 text-sm">Delete Comment</h4>
              <p className="text-xs text-gray-500 leading-normal">
                Are you sure you want to delete this comment?
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-1">
              <button
                onClick={() => setCommentToDelete(null)}
                className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 rounded-xl transition border border-gray-200 cursor-pointer"
              >
                No
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteComment(post.id, commentToDelete);
                    setCommentToDelete(null);
                  } catch (err: any) {
                    console.error("Failed to delete comment:", err);
                  }
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-xl transition shadow-sm shadow-red-200 cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
