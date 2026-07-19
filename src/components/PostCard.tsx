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
  AlertCircle, 
  Video,
  ThumbsUp,
  ThumbsDown,
  Edit2,
  Trash2,
  Image as ImageIcon,
  X
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenShare: (post: Post) => void;
  onStartChat?: (targetUser: { uid: string; displayName: string; username?: string; photoURL?: string }) => void;
}

export default function PostCard({ post, currentUser, onOpenAuth, onOpenShare, onStartChat }: PostCardProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  
  // Local state for editing comments
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  
  // State for commenting with images
  const [commentImageUrl, setCommentImageUrl] = useState('');
  const [commentDragActive, setCommentDragActive] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Post Deletion states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  const executeDeletePost = async () => {
    setDeletingPost(true);
    try {
      await deletePost(post.id);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setDeletingPost(false);
      setShowDeleteConfirm(false);
    }
  };
  
  const hasLiked = currentUser ? post.likes.includes(currentUser.uid) : false;

  // Subscribe to comments
  useEffect(() => {
    let unsubscribe: () => void;
    if (showComments) {
      unsubscribe = subscribeToComments(post.id, (loadedComments) => {
        setComments(loadedComments);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [showComments, post.id]);

  const handleCommentImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setCommentError("Please select/drop a valid image file.");
      return;
    }
    if (file.size > 800 * 1024) {
      setCommentError("Image size must be under 800KB.");
      return;
    }
    setCommentError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setCommentImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCommentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCommentImageFile(file);
    }
  };

  const handleCommentDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setCommentDragActive(true);
    } else if (e.type === "dragleave") {
      setCommentDragActive(false);
    }
  };

  const handleCommentDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCommentDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCommentImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    await toggleLikePost(post.id, currentUser.uid, hasLiked);
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
        imageUrl: commentImageUrl || undefined
      });
      setCommentText('');
      setCommentImageUrl('');
      setCommentError('');
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoadingComment(false);
    }
  };

  // Level Badge Color Mapping
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

  // Category Tag Styling
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

  return (
    <div className="relative frosted-panel rounded-2xl overflow-hidden hover:border-bamboo-200/80 transition-all duration-200" id={`post-card-${post.id}`}>
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 flex items-center justify-center p-4" id={`delete-post-confirm-overlay-${post.id}`}>
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-center space-y-4 shadow-xl border border-red-100">
            <div className="mx-auto w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-900 text-sm">Delete This Post?</h4>
              <p className="text-[11px] text-gray-500 leading-normal">
                Are you sure you want to permanently delete your post "{post.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition"
                disabled={deletingPost}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDeletePost}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
                disabled={deletingPost}
              >
                {deletingPost ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
                return;
              }
              if (currentUser.uid !== post.authorId && onStartChat) {
                onStartChat({
                  uid: post.authorId,
                  displayName: post.authorName,
                  username: post.authorUsername || post.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka',
                  photoURL: post.authorPhoto
                });
              }
            }}
            disabled={currentUser?.uid === post.authorId}
            className={`text-left shrink-0 transition-opacity ${currentUser?.uid !== post.authorId ? 'hover:opacity-85 cursor-pointer' : 'cursor-default'}`}
            title={currentUser?.uid !== post.authorId ? `Chat with ${post.authorName}` : undefined}
          >
            <img
              src={post.authorPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
              alt={post.authorName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-bamboo-100/50 bg-white"
            />
          </button>
          <div>
            <div className="flex items-center space-x-1.5 flex-wrap">
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                    return;
                  }
                  if (currentUser.uid !== post.authorId && onStartChat) {
                    onStartChat({
                      uid: post.authorId,
                      displayName: post.authorName,
                      username: post.authorUsername || post.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka',
                      photoURL: post.authorPhoto
                    });
                  }
                }}
                disabled={currentUser?.uid === post.authorId}
                className={`font-semibold text-gray-800 text-sm leading-none transition-colors text-left ${
                  currentUser?.uid !== post.authorId ? 'hover:text-bamboo-700 hover:underline cursor-pointer' : 'cursor-default'
                }`}
                title={currentUser?.uid !== post.authorId ? `Chat with ${post.authorName}` : undefined}
              >
                {post.authorName}
              </button>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold tracking-wide uppercase border ${getLevelBadge(post.authorLevel)}`}>
                {post.authorLevel}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 mt-1">
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                    return;
                  }
                  if (currentUser.uid !== post.authorId && onStartChat) {
                    onStartChat({
                      uid: post.authorId,
                      displayName: post.authorName,
                      username: post.authorUsername || post.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka',
                      photoURL: post.authorPhoto
                    });
                  }
                }}
                disabled={currentUser?.uid === post.authorId}
                className={`text-[10px] text-bamboo-700 hover:underline font-mono ${
                  currentUser?.uid !== post.authorId ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                @{post.authorUsername || post.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka'}
              </button>
              <span className="text-gray-300 text-[10px]">•</span>
              <p className="text-[10px] text-gray-400 font-medium">Bansuri Enthusiast</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${getCategoryTag(post.category)}`}>
            {post.category}
          </span>
          {post.raga && (
            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <Music className="w-3 h-3 text-amber-600" />
              Raga {post.raga}
            </span>
          )}
          {currentUser && currentUser.uid === post.authorId && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition shrink-0 ml-1"
              title="Delete Post"
              id={`delete-post-btn-${post.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Post Body */}
      <div className="px-4 pb-3 space-y-2">
        <h3 className="font-display font-bold text-gray-900 leading-snug text-base">
          {post.title}
        </h3>
        <p className="text-gray-600 text-xs leading-relaxed whitespace-pre-wrap">
          {post.description}
        </p>
      </div>

      {/* Post Image Attachment */}
      {post.imageUrl && (
        <div className="px-4 pb-3">
          <div className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100/50 max-h-80 flex justify-center items-center shadow-3xs">
            <img
              src={post.imageUrl}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="max-h-80 w-full object-contain hover:scale-[1.01] transition-transform duration-300 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Embedded Video Player */}
      {post.videoUrl && (
        <div className="px-4 pb-3">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5 border border-gray-100">
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
        </div>
      )}

      {/* Action Buttons bar */}
      <div className="flex items-center justify-between border-t border-b border-white/20 px-4 py-2.5 bg-white/20 backdrop-blur-3xs">
        <div className="flex space-x-4">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1.5 text-xs font-semibold transition ${
              hasLiked 
                ? "text-red-500 scale-105" 
                : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
            <span>{post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}</span>
          </button>

          {/* Comment toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center space-x-1.5 text-xs font-semibold transition ${
              showComments 
                ? "text-bamboo-700" 
                : "text-gray-500 hover:text-bamboo-700"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}</span>
          </button>
        </div>

        {/* Share */}
        <button
          onClick={() => onOpenShare(post)}
          className="flex items-center space-x-1 text-xs font-semibold text-gray-500 hover:text-bamboo-700 transition"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Collapsible Comments Section */}
      {showComments && (
        <div className="bg-white/10 backdrop-blur-3xs px-4 py-4 space-y-4 border-b border-white/20 animate-slideDown" id={`post-comments-${post.id}`}>
          {/* Comments List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-center text-[11px] text-gray-400 py-2 italic">No comments yet. Start the conversation!</p>
            ) : (
              comments.map((comm) => {
                const isAuthor = currentUser?.uid === comm.authorId;
                const isEditing = editingCommentId === comm.id;
                const likesCount = comm.likes?.length || 0;
                const dislikesCount = comm.dislikes?.length || 0;
                const commLiked = currentUser ? comm.likes?.includes(currentUser.uid) : false;
                const commDisliked = currentUser ? comm.dislikes?.includes(currentUser.uid) : false;

                return (
                  <div key={comm.id} className="flex items-start space-x-2.5 text-xs group/comm">
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          onOpenAuth();
                          return;
                        }
                        if (currentUser.uid !== comm.authorId && onStartChat) {
                          onStartChat({
                            uid: comm.authorId,
                            displayName: comm.authorName,
                            username: comm.authorUsername || comm.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka',
                            photoURL: comm.authorPhoto
                          });
                        }
                      }}
                      disabled={currentUser?.uid === comm.authorId}
                      className={`shrink-0 transition-opacity ${currentUser?.uid !== comm.authorId ? 'hover:opacity-85 cursor-pointer' : 'cursor-default'}`}
                      title={currentUser?.uid !== comm.authorId ? `Chat with ${comm.authorName}` : undefined}
                    >
                      <img
                        src={comm.authorPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                        alt={comm.authorName}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover mt-0.5 border border-bamboo-100/30"
                      />
                    </button>
                    <div className="flex-1 bg-white p-2.5 rounded-xl border border-gray-100 shadow-3xs">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-baseline space-x-1.5 flex-wrap">
                          <button
                            onClick={() => {
                              if (!currentUser) {
                                onOpenAuth();
                                return;
                              }
                              if (currentUser.uid !== comm.authorId && onStartChat) {
                                onStartChat({
                                  uid: comm.authorId,
                                  displayName: comm.authorName,
                                  username: comm.authorUsername || comm.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka',
                                  photoURL: comm.authorPhoto
                                });
                              }
                            }}
                            disabled={currentUser?.uid === comm.authorId}
                            className={`font-semibold text-gray-800 text-left transition-colors ${
                              currentUser?.uid !== comm.authorId ? 'hover:text-bamboo-700 hover:underline cursor-pointer' : 'cursor-default'
                            }`}
                            title={currentUser?.uid !== comm.authorId ? `Chat with ${comm.authorName}` : undefined}
                          >
                            {comm.authorName}
                          </button>
                          
                          <button
                            onClick={() => {
                              if (!currentUser) {
                                onOpenAuth();
                                return;
                              }
                              if (currentUser.uid !== comm.authorId && onStartChat) {
                                onStartChat({
                                  uid: comm.authorId,
                                  displayName: comm.authorName,
                                  username: comm.authorUsername || comm.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka',
                                  photoURL: comm.authorPhoto
                                });
                              }
                            }}
                            disabled={currentUser?.uid === comm.authorId}
                            className={`text-[9px] text-bamboo-700 hover:underline font-mono ${
                              currentUser?.uid !== comm.authorId ? 'cursor-pointer' : 'cursor-default'
                            }`}
                          >
                            @{comm.authorUsername || comm.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka'}
                          </button>
                        </div>
                        
                        {/* Edit & Delete actions for authors */}
                        {isAuthor && !isEditing && (
                          <div className="flex items-center space-x-2 opacity-0 group-hover/comm:opacity-100 transition duration-150">
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
                              onClick={() => {
                                setCommentToDelete(comm.id);
                              }}
                              className="text-gray-400 hover:text-red-600 transition p-0.5"
                              title="Delete Comment"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-1.5 mt-1">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-bamboo-600 text-gray-700"
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
                          
                          {/* Likes & Dislikes Row */}
                          <div className="flex items-center space-x-3 text-[10px] text-gray-400 border-t border-gray-50 pt-1.5 mt-1">
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
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* New Comment form or Login Block */}
          {currentUser ? (
            <div className="space-y-2 w-full">
              {/* Comment image preview if attached */}
              {commentImageUrl && (
                <div className="relative inline-block border border-gray-200 rounded-lg p-1 bg-white shadow-3xs ml-9">
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
                    title="Remove Image"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}

              {commentError && (
                <p className="text-[10px] text-red-600 ml-9">{commentError}</p>
              )}

              <form 
                onSubmit={handleCommentSubmit}
                onDragEnter={handleCommentDrag}
                onDragOver={handleCommentDrag}
                onDragLeave={handleCommentDrag}
                onDrop={handleCommentDrop}
                className={`flex items-center space-x-2 transition-all p-1 rounded-xl ${
                  commentDragActive ? "bg-bamboo-50/50 border border-dashed border-bamboo-500" : ""
                }`}
              >
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-bamboo-100 shrink-0"
                />
                <div className="flex-1 flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200/80 focus-within:ring-2 focus-within:ring-bamboo-600 focus-within:border-transparent min-w-0">
                  <input
                    type="text"
                    placeholder={commentDragActive ? "Drop image here..." : "Add a comment on technique, raga details..."}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={loadingComment}
                    className="flex-1 bg-transparent text-xs text-gray-700 focus:outline-none placeholder-gray-400 min-w-0"
                  />
                  
                  {/* Image attachment icon button */}
                  <button
                    type="button"
                    onClick={() => document.getElementById(`comment-image-file-${post.id}`)?.click()}
                    className="text-gray-400 hover:text-bamboo-700 transition shrink-0 p-0.5"
                    title="Attach Image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <input 
                    type="file"
                    id={`comment-image-file-${post.id}`}
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
            <div className="p-3 bg-amber-50/80 border border-amber-200/60 rounded-xl text-center space-y-2">
              <p className="text-[11px] text-amber-900 leading-normal flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                You must sign up or create a profile to comment and interact!
              </p>
              <button
                onClick={onOpenAuth}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold tracking-wider rounded-lg uppercase transition shadow-3xs"
              >
                Sign Up & Comment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {commentToDelete && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-3xs flex items-center justify-center p-4 z-50 rounded-2xl animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-xl border border-gray-100 space-y-4 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-950 text-sm">Delete Comment</h4>
              <p className="text-xs text-gray-500 leading-normal">
                Are you sure you want to delete the comment?
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-1">
              <button
                onClick={() => setCommentToDelete(null)}
                className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 rounded-xl transition border border-gray-200"
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
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-xl transition shadow-sm shadow-red-200"
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
