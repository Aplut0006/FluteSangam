import React, { useState, useEffect } from 'react';
import { Post, Comment, UserProfile } from '../types';
import { toggleLikePost, subscribeToComments, subscribeToLatestComments } from '../lib/db';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Music, 
  Sparkles, 
  Video,
  ArrowRight,
  Edit2,
  MessageCircle
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenShare: (post: Post) => void;
  onStartChat?: (targetUser: { uid: string; displayName: string; username?: string; photoURL?: string }) => void;
  onPostClick: (post: Post, focusComment?: boolean) => void;
  onUserProfileClick?: (userId: string) => void;
  onEditPost?: (post: Post) => void;
  onOpenImage?: (imageUrl: string) => void;
}

export default function PostCard({ 
  post: initialPost, 
  currentUser, 
  onOpenAuth, 
  onOpenShare, 
  onStartChat,
  onPostClick,
  onUserProfileClick,
  onEditPost,
  onOpenImage
}: PostCardProps) {
  const [post, setPost] = useState<Post>(initialPost);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [latestComments, setLatestComments] = useState<Comment[]>([]);

  // Sync state if initialPost changes
  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  // Real-time comments count sync
  useEffect(() => {
    const unsubscribe = subscribeToComments(post.id, (loadedComments) => {
      setCommentsCount(loadedComments.length);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [post.id]);

  // Real-time latest 2 comments
  useEffect(() => {
    const unsubscribe = subscribeToLatestComments(post.id, 2, (loadedComments) => {
      setLatestComments(loadedComments);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [post.id]);

  const hasLiked = currentUser ? post.likes.includes(currentUser.uid) : false;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the post detail view when liking
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    try {
      await toggleLikePost(post.id, currentUser.uid, hasLiked);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

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

  const isLongDescription = post.description.length > 150 || post.description.split('\n').length > 3;

  const getTruncatedText = () => {
    const lines = post.description.split('\n');
    if (lines.length > 3) {
      const truncatedLines = lines.slice(0, 3).join('\n');
      if (truncatedLines.length > 150) {
        return truncatedLines.slice(0, 150) + '...';
      }
      return truncatedLines + '...';
    }
    if (post.description.length > 150) {
      return post.description.slice(0, 150) + '...';
    }
    return post.description;
  };

  return (
    <div 
      onClick={() => onPostClick(post)}
      className="frosted-panel rounded-2xl overflow-hidden hover:border-bamboo-300/80 hover:shadow-md transition-all duration-250 bg-white border border-bamboo-100/50 p-5 cursor-pointer flex flex-col space-y-4 group"
      id={`post-card-${post.id}`}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onUserProfileClick) {
                onUserProfileClick(post.authorId);
              }
            }}
            className="shrink-0 transition-opacity hover:opacity-85 cursor-pointer"
            title={`View @${post.authorUsername || post.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '')} profile`}
          >
            <img
              src={post.authorPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
              alt={post.authorName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-bamboo-100/60 bg-white"
              loading="lazy"
            />
          </button>
          <div>
            <div className="flex items-center space-x-1.5 flex-wrap">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onUserProfileClick) {
                    onUserProfileClick(post.authorId);
                  }
                }}
                className="font-bold text-gray-900 text-sm leading-none transition-colors text-left hover:text-bamboo-700 hover:underline cursor-pointer"
              >
                {post.authorName}
              </button>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold tracking-wide uppercase border ${getLevelBadge(post.authorLevel)}`}>
                {post.authorLevel}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 mt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onUserProfileClick) {
                    onUserProfileClick(post.authorId);
                  }
                }}
                className="text-[11px] text-bamboo-700 font-mono font-medium hover:text-bamboo-800 hover:underline cursor-pointer text-left"
              >
                @{post.authorUsername || post.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '')}
              </button>
            </div>
          </div>
        </div>

        {/* Categories / Badges */}
        <div className="flex items-center space-x-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${getCategoryTag(post.category)}`}>
            {post.category}
          </span>
          {post.raga && (
            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-100 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <Music className="w-3 h-3 text-amber-600" />
              {post.raga}
            </span>
          )}
        </div>
      </div>

      {/* Title & Description preview */}
      <div className="space-y-1.5">
        <h3 className="font-display font-extrabold text-gray-900 text-base md:text-lg group-hover:text-bamboo-800 transition">
          {post.title}
        </h3>
        <p className="text-gray-600 text-xs leading-relaxed whitespace-pre-line break-words">
          {getTruncatedText()}
        </p>
        {isLongDescription && (
          <span className="text-[11px] font-bold text-bamboo-700 flex items-center gap-0.5 group-hover:translate-x-1 transition duration-150 mt-1">
            Read full post <ArrowRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {/* Media elements if present (shows a visual tag/thumbnail) */}
      {(post.imageUrl || post.videoUrl) && (
        <div className="flex items-center gap-2 text-gray-500 bg-gray-50/50 p-2 rounded-xl border border-gray-100 text-[10px] font-semibold">
          {post.imageUrl && (
            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-100">
              🖼️ Photo attachment
            </span>
          )}
          {post.videoUrl && (
            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-100">
              <Video className="w-3 h-3 text-amber-600" /> Performance clip
            </span>
          )}
        </div>
      )}

      {/* Latest Comments Preview */}
      {latestComments.length > 0 && (
        <div 
          onClick={(e) => {
            // Let the card click open details, but we should not block it
          }}
          className="bg-gray-50/50 rounded-xl p-3 border border-gray-100/60 space-y-2 text-xs"
        >
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span>{commentsCount > 2 ? "Recent Comments" : "Comments"}</span>
            {commentsCount > 2 && (
              <span className="text-bamboo-600 font-semibold font-sans normal-case hover:underline">
                View all {commentsCount}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {latestComments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onUserProfileClick) {
                      onUserProfileClick(comment.authorId);
                    }
                  }}
                  className="shrink-0 transition-opacity hover:opacity-85"
                >
                  <img
                    src={comment.authorPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                    alt={comment.authorName}
                    className="w-5 h-5 rounded-full object-cover border border-gray-200"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-1.5 flex-wrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onUserProfileClick) {
                          onUserProfileClick(comment.authorId);
                        }
                      }}
                      className="font-bold text-gray-900 hover:text-bamboo-700 hover:underline text-left text-[11px]"
                    >
                      {comment.authorName}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onUserProfileClick) {
                          onUserProfileClick(comment.authorId);
                        }
                      }}
                      className="text-[10px] text-bamboo-700 font-mono font-medium hover:text-bamboo-800 hover:underline text-left"
                    >
                      @{comment.authorUsername || comment.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'sadhaka'}
                    </button>
                  </div>
                  {comment.replyToName && (
                    <div className="text-[9px] text-gray-500 my-0.5 flex flex-col bg-white/50 w-fit max-w-[200px] px-1.5 py-0.5 rounded border border-gray-100 border-l-2 border-l-bamboo-400">
                      <span className="flex items-center gap-1 font-medium text-bamboo-700">
                        <MessageCircle className="w-2 h-2" />
                        Replying to {comment.replyToName}
                      </span>
                      {comment.replyToText && (
                        <span className="truncate italic text-gray-400 pl-3 max-w-[180px]">
                          "{comment.replyToText}"
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-gray-600 text-[11px] leading-tight truncate mt-0.5 break-all">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons footer bar */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs mt-1">
        <div className="flex items-center space-x-4">
          {/* Likes */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1.5 font-bold transition ${
              hasLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart className={`w-4.5 h-4.5 ${hasLiked ? "fill-current text-red-500" : ""}`} />
            <span>{post.likeCount}</span>
          </button>

          {/* Comments count */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPostClick(post, true);
            }}
            className="flex items-center space-x-1.5 text-gray-500 font-bold hover:text-bamboo-700 transition cursor-pointer"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>{commentsCount}</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* If current user is post author, show edit option */}
          {currentUser && currentUser.uid === post.authorId && onEditPost && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditPost(post);
              }}
              className="flex items-center space-x-1 font-semibold text-gray-500 hover:text-bamboo-700 transition cursor-pointer"
              title="Edit Post"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenShare(post);
            }}
            className="flex items-center space-x-1.5 font-semibold text-gray-500 hover:text-bamboo-700 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
