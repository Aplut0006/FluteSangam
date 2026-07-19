import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  arrayUnion, 
  arrayRemove, 
  increment,
  Timestamp,
  where,
  or
} from 'firebase/firestore';
import { db } from './firebase';
import { Post, Comment, UserProfile } from '../types';
import { INITIAL_COMMUNITY_POSTS, MOCK_COMMENTS } from '../data/mockPosts';

// Seeding function
export async function seedDatabaseIfEmpty() {
  try {
    const postsCol = collection(db, 'posts');
    const q = query(postsCol);
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("Firestore database is empty. Seeding initial posts...");
      
      const ids = [
        "morning-meditation",
        "essential-breath-tips",
        "shakur-c-natural-review",
        "six-to-seven-hole-question",
        "bhimpalasi-deep-dive"
      ];
      
      for (let i = 0; i < INITIAL_COMMUNITY_POSTS.length; i++) {
        const mockPost = INITIAL_COMMUNITY_POSTS[i];
        const docId = ids[i];
        
        // Create the post document
        const postRef = doc(db, 'posts', docId);
        await setDoc(postRef, {
          ...mockPost,
          id: docId,
          createdAt: Timestamp.now()
        });
        
        // Seed comments for this post if they exist
        const comments = MOCK_COMMENTS[docId] || [];
        const commentsColRef = collection(db, 'posts', docId, 'comments');
        
        for (let j = 0; j < comments.length; j++) {
          const comment = comments[j];
          await addDoc(commentsColRef, {
            ...comment,
            createdAt: Timestamp.now()
          });
        }
      }
      console.log("Database seeded successfully!");
    }
  } catch (error) {
    console.error("Error seeding database: ", error);
  }
}

// Helper to sanitize undefined values before passing payloads to Firestore
function cleanUndefined<T extends Record<string, any>>(obj: T): T {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
}

// User Profile management
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function createUserProfile(uid: string, profile: Omit<UserProfile, 'uid' | 'joinedAt'>): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const completeProfile: UserProfile = {
      ...profile,
      uid,
      joinedAt: Timestamp.now()
    };
    await setDoc(docRef, cleanUndefined(completeProfile));
    return completeProfile;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return null;
  }
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, cleanUndefined(updates));
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
}

// Posts subscription (Real-time updates!)
export function subscribeToPosts(callback: (posts: Post[]) => void) {
  const postsCol = collection(db, 'posts');
  // Order by createdAt descending
  const q = query(postsCol, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const posts: Post[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
      } as Post);
    });
    callback(posts);
  }, (error) => {
    console.error("Error subscribing to posts:", error);
  });
}

// Add a post
export async function addPost(post: Omit<Post, 'id' | 'likes' | 'likeCount' | 'commentsCount' | 'createdAt'>): Promise<string | null> {
  try {
    const postsCol = collection(db, 'posts');
    const newPostDoc = {
      ...post,
      likes: [],
      likeCount: 0,
      commentsCount: 0,
      createdAt: Timestamp.now()
    };
    const docRef = await addDoc(postsCol, cleanUndefined(newPostDoc));
    return docRef.id;
  } catch (error) {
    console.error("Error adding post:", error);
    return null;
  }
}

// Delete a post
export async function deletePost(postId: string): Promise<void> {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

// Like or unlike a post
export async function toggleLikePost(postId: string, userId: string, hasLiked: boolean): Promise<void> {
  try {
    const postRef = doc(db, 'posts', postId);
    if (hasLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
        likeCount: increment(-1)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        likeCount: increment(1)
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
}

// Comments functions
export function subscribeToComments(postId: string, callback: (comments: Comment[]) => void) {
  const commentsCol = collection(db, 'posts', postId, 'comments');
  const q = query(commentsCol, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const comments: Comment[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        postId,
        authorId: data.authorId,
        authorName: data.authorName,
        authorPhoto: data.authorPhoto,
        text: data.text,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        likes: data.likes || [],
        dislikes: data.dislikes || [],
        imageUrl: data.imageUrl
      });
    });
    callback(comments);
  }, (error) => {
    console.error("Error subscribing to comments:", error);
  });
}

export async function addComment(postId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<void> {
  try {
    // Add comment to posts/{postId}/comments
    const commentsCol = collection(db, 'posts', postId, 'comments');
    await addDoc(commentsCol, cleanUndefined({
      ...comment,
      likes: [],
      dislikes: [],
      createdAt: Timestamp.now()
    }));
    
    // Increment commentsCount in posts/{postId}
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      commentsCount: increment(1)
    });
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

export async function editComment(postId: string, commentId: string, newText: string): Promise<void> {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    await updateDoc(commentRef, {
      text: newText
    });
  } catch (error) {
    console.error("Error editing comment:", error);
    throw error;
  }
}

export async function deleteComment(postId: string, commentId: string): Promise<void> {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    await deleteDoc(commentRef);
    
    // Decrement commentsCount in posts/{postId}
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      commentsCount: increment(-1)
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

export async function toggleLikeComment(postId: string, commentId: string, userId: string, hasLiked: boolean): Promise<void> {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    if (hasLiked) {
      await updateDoc(commentRef, {
        likes: arrayRemove(userId)
      });
    } else {
      await updateDoc(commentRef, {
        likes: arrayUnion(userId),
        dislikes: arrayRemove(userId)
      });
    }
  } catch (error) {
    console.error("Error toggling comment like:", error);
    throw error;
  }
}

export async function toggleDislikeComment(postId: string, commentId: string, userId: string, hasDisliked: boolean): Promise<void> {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    if (hasDisliked) {
      await updateDoc(commentRef, {
        dislikes: arrayRemove(userId)
      });
    } else {
      await updateDoc(commentRef, {
        dislikes: arrayUnion(userId),
        likes: arrayRemove(userId)
      });
    }
  } catch (error) {
    console.error("Error toggling comment dislike:", error);
    throw error;
  }
}

export async function isEmailTaken(email: string, excludeUid?: string): Promise<boolean> {
  try {
    if (!email || !email.trim()) return false;
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('email', '==', email.trim().toLowerCase()));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return false;
    if (excludeUid) {
      return snapshot.docs.some(doc => doc.id !== excludeUid);
    }
    return true;
  } catch (error) {
    console.error("Error checking isEmailTaken:", error);
    return false;
  }
}

export async function isPhoneTaken(phone: string, excludeUid?: string): Promise<boolean> {
  try {
    const cleanedPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanedPhone) return false;
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('phoneNumber', '==', cleanedPhone));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return false;
    if (excludeUid) {
      return snapshot.docs.some(doc => doc.id !== excludeUid);
    }
    return true;
  } catch (error) {
    console.error("Error checking isPhoneTaken:", error);
    return false;
  }
}

// Check if a username is taken
export async function isUsernameTaken(username: string, excludeUid?: string): Promise<boolean> {
  try {
    const cleaned = username.trim().toLowerCase();
    if (!cleaned) return false;
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('username', '==', cleaned));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return false;
    if (excludeUid) {
      return snapshot.docs.some(doc => doc.id !== excludeUid);
    }
    return true;
  } catch (error) {
    console.error("Error checking isUsernameTaken:", error);
    return false;
  }
}

// Generate a unique username on signup
export async function generateUniqueUsername(baseName: string): Promise<string> {
  let cleanName = baseName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (!cleanName) {
    cleanName = "bansuri_player";
  }
  
  let candidate = cleanName;
  let isTaken = await isUsernameTaken(candidate);
  let attempts = 0;
  while (isTaken && attempts < 15) {
    const randomSuffix = Math.floor(100 + Math.random() * 9000);
    candidate = `${cleanName}_${randomSuffix}`;
    isTaken = await isUsernameTaken(candidate);
    attempts++;
  }
  if (isTaken) {
    candidate = `${cleanName}_${Date.now().toString().slice(-4)}`;
  }
  return candidate;
}

// Subscribe to direct messages between users
export function subscribeToDirectMessages(chatId: string, callback: (messages: any[]) => void) {
  const dmCol = collection(db, 'direct_messages');
  const q = query(dmCol, where('chatId', '==', chatId), orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        editedAt: data.editedAt ? data.editedAt.toDate() : undefined
      });
    });
    callback(messages);
  }, (error) => {
    console.error("Error subscribing to direct messages:", error);
  });
}

// Send a direct message
export async function sendDirectMessage(
  chatId: string, 
  senderId: string, 
  receiverId: string, 
  text: string, 
  imageUrl?: string
): Promise<void> {
  try {
    const dmCol = collection(db, 'direct_messages');
    await addDoc(dmCol, cleanUndefined({
      chatId,
      senderId,
      receiverId,
      text,
      imageUrl,
      createdAt: Timestamp.now(),
      read: false // new message starts as unread
    }));
  } catch (error) {
    console.error("Error sending direct message:", error);
    throw error;
  }
}

// Subscribe to all direct messages involving a specific user (either as sender or receiver)
export function subscribeToAllUserMessages(userId: string, callback: (messages: any[]) => void) {
  const dmCol = collection(db, 'direct_messages');
  const q = query(
    dmCol,
    or(
      where('senderId', '==', userId),
      where('receiverId', '==', userId)
    )
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        editedAt: data.editedAt ? data.editedAt.toDate() : undefined,
        read: data.read ?? true // default true if not specified
      });
    });
    callback(messages);
  }, (error) => {
    console.error("Error subscribing to all user messages:", error);
  });
}

// Subscribe to unread messages for a specific receiver
export function subscribeToUnreadMessages(userId: string, callback: (messages: any[]) => void) {
  const dmCol = collection(db, 'direct_messages');
  const q = query(
    dmCol,
    where('receiverId', '==', userId),
    where('read', '==', false)
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        read: data.read ?? false
      });
    });
    callback(messages);
  }, (error) => {
    console.error("Error subscribing to unread messages:", error);
  });
}

// Subscribe to all user profiles in the database
export function subscribeToAllUsers(callback: (users: UserProfile[]) => void) {
  const usersCol = collection(db, 'users');
  return onSnapshot(usersCol, (snapshot) => {
    const users: UserProfile[] = [];
    snapshot.forEach((doc) => {
      users.push({
        ...doc.data(),
        uid: doc.id
      } as UserProfile);
    });
    callback(users);
  }, (error) => {
    console.error("Error subscribing to all users:", error);
  });
}

// Mark messages as read for a given chat and receiver
export async function markChatMessagesAsRead(chatId: string, userId: string): Promise<void> {
  try {
    const dmCol = collection(db, 'direct_messages');
    const q = query(
      dmCol, 
      where('chatId', '==', chatId), 
      where('receiverId', '==', userId), 
      where('read', '==', false)
    );
    const snapshot = await getDocs(q);
    
    // Update each document to read: true
    for (const docSnap of snapshot.docs) {
      await updateDoc(docSnap.ref, { read: true });
    }
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
}

// Delete a direct message
export async function deleteDirectMessage(messageId: string): Promise<void> {
  try {
    const dmRef = doc(db, 'direct_messages', messageId);
    await deleteDoc(dmRef);
  } catch (error) {
    console.error("Error deleting direct message:", error);
    throw error;
  }
}

// Edit a direct message
export async function editDirectMessage(messageId: string, text: string): Promise<void> {
  try {
    const dmRef = doc(db, 'direct_messages', messageId);
    await updateDoc(dmRef, {
      text,
      editedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error editing direct message:", error);
    throw error;
  }
}

// Block a user
export async function blockUser(currentUid: string, targetUid: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', currentUid);
    await updateDoc(userRef, {
      blockedUsers: arrayUnion(targetUid)
    });
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
}

// Unblock a user
export async function unblockUser(currentUid: string, targetUid: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', currentUid);
    await updateDoc(userRef, {
      blockedUsers: arrayRemove(targetUid)
    });
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw error;
  }
}

// Find user by username
export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  try {
    const cleaned = username.trim().toLowerCase();
    if (!cleaned) return null;
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('username', '==', cleaned));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as UserProfile;
  } catch (error) {
    console.error("Error in getUserByUsername:", error);
    return null;
  }
}

// Get deterministic chat ID between two user IDs
export function getDirectChatId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join('_');
}
