export type AppView = 'community' | 'chats' | 'post-detail' | 'user-profile' | 'learn_intro' | 'learn_basics' | 'learn_alankaras' | 'learn_raagas' | 'community_members' | 'practice_now';

export interface UserProfile {
  uid: string;
  displayName: string;
  username: string; // unique username
  email: string;
  photoURL: string;
  bio: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Guru';
  bansuriType: string; // e.g. "E Bass", "G Medium", "C Natural"
  location: string;
  joinedAt: any; // Firebase Timestamp or ISO String
  phoneNumber?: string;
  blockedUsers?: string[]; // UIDs of users this user has blocked
}

export interface DirectMessage {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  createdAt: any;
  editedAt?: any;
  read?: boolean; // track unread state for real-time highlights
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  authorUsername?: string; // unique username of comment author
  text: string;
  createdAt: any;
  likes?: string[];      // UIDs of users who liked
  dislikes?: string[];   // UIDs of users who disliked
  imageUrl?: string;     // Base64 or external image URL
  parentId?: string;
  replyToName?: string;
  replyToText?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  authorLevel: string;
  authorUsername?: string; // unique username of post author
  title: string;
  description: string;
  category: 'Performance' | 'Tutorial' | 'Raga Discussion' | 'Review' | 'Question';
  raga?: string; // e.g. "Yaman", "Bhairav", "Bhimpalasi"
  videoUrl?: string; // YouTube URL or audio/video simulation
  likes: string[]; // list of user UIDs who liked
  likeCount: number;
  commentsCount: number;
  createdAt: any;
  imageUrl?: string;     // Base64 or external image URL
}

export interface RagaDetail {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  aaroh: string; // ascending notes
  avroh: string; // descending notes
  vadi: string; // principal note
  samvadi: string; // second most important note
  pakad: string; // characteristic catchphrase
  time: string; // time of day
  mood: string; // sentiment/emotion
  description: string;
}
