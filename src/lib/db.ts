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
  or,
  limit,
  writeBatch,
  collectionGroup,
  deleteField
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { deleteUser } from 'firebase/auth';
import { Post, Comment, UserProfile, AppNotification } from '../types';
import { INITIAL_COMMUNITY_POSTS, MOCK_COMMENTS, INITIAL_MOCK_USERS, CARTOON_AVATARS } from '../data/mockPosts';

// Seeding and user synchronization function
export async function syncMissingUsersToFirestore(): Promise<void> {
  // Do NOT auto-create user documents for deleted users or missing post authors in Firestore.
  return;
}

export async function seedDatabaseIfEmpty() {
  try {
    // 1. Sync missing members into Firestore
    await syncMissingUsersToFirestore();

    // 2. Seed posts if empty
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
      } else {
        // Ensure legacy seeded post for Hariprasad K has videoUrl removed if it exists in Firestore
        try {
          const morningPostRef = doc(db, 'posts', 'morning-meditation');
          const morningSnap = await getDoc(morningPostRef);
          if (morningSnap.exists() && morningSnap.data().videoUrl) {
            await updateDoc(morningPostRef, { videoUrl: deleteField() });
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (postErr) {
      console.warn("Could not check/seed posts collection:", postErr);
    }
  } catch (error) {
    console.warn("Database seeding notice:", error);
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
export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  if (!email || !email.trim()) return null;
  const cleanEmail = email.trim().toLowerCase();
  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('email', '==', cleanEmail));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as UserProfile;
    }
    // Fallback: search with original casing
    const snapExact = await getDocs(query(usersCol, where('email', '==', email.trim())));
    if (!snapExact.empty) {
      return snapExact.docs[0].data() as UserProfile;
    }
  } catch (error) {
    console.warn("Error looking up profile by email:", error);
  }
  return null;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }

    // Fallback: Check if current auth user's email already has a profile in Firestore (e.g. Google vs Email/Password)
    const currentUserEmail = auth.currentUser?.email;
    if (currentUserEmail) {
      const profileByEmail = await getUserProfileByEmail(currentUserEmail);
      if (profileByEmail) {
        // Return the existing profile directly without creating a second document in Firestore!
        return profileByEmail;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function createUserProfile(uid: string, profile: Omit<UserProfile, 'uid' | 'joinedAt'>): Promise<UserProfile | null> {
  try {
    // 1. Check if profile already exists by email under any UID to avoid extra duplicate user documents in Firestore
    if (profile.email) {
      const existingByEmail = await getUserProfileByEmail(profile.email);
      if (existingByEmail) {
        if (existingByEmail.isDeleted || existingByEmail.status === 'deleted') {
          return existingByEmail;
        }
        // Update the single existing profile document in Firestore
        const existingDocRef = doc(db, 'users', existingByEmail.uid);
        const mergedByEmail: UserProfile = {
          ...existingByEmail,
          displayName: (profile.displayName && profile.displayName !== 'Musician') ? profile.displayName : existingByEmail.displayName,
          photoURL: (profile.photoURL && !profile.photoURL.includes('dicebear')) ? profile.photoURL : existingByEmail.photoURL,
          bio: (profile.bio && profile.bio !== 'Bansuri Sadhaka & Indian classical music enthusiast.') ? profile.bio : existingByEmail.bio,
        };
        await setDoc(existingDocRef, cleanUndefined(mergedByEmail), { merge: true });
        return mergedByEmail;
      }
    }

    // 2. Check if document exists for this exact UID
    const docRef = doc(db, 'users', uid);
    const existingSnap = await getDoc(docRef);
    if (existingSnap.exists()) {
      const existingData = existingSnap.data() as UserProfile;
      if (existingData.isDeleted || existingData.status === 'deleted') {
        return existingData;
      }
      const mergedProfile: UserProfile = {
        ...profile,
        ...existingData,
        uid: existingData.uid || uid,
        joinedAt: existingData.joinedAt || Timestamp.now()
      };
      await setDoc(docRef, cleanUndefined(mergedProfile), { merge: true });
      return mergedProfile;
    }

    // 3. Create brand new single profile
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
    if (updates.phoneNumber) {
      const taken = await isPhoneTaken(updates.phoneNumber, uid);
      if (taken) throw new Error("Phone number is already taken by another member.");
    }

    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, cleanUndefined(updates));

    // Also update their posts and comments if name, username, or photo changed
    if (updates.displayName !== undefined || updates.username !== undefined || updates.photoURL !== undefined) {
      const postUpdates: any = {};
      if (updates.displayName !== undefined) postUpdates.authorName = updates.displayName;
      if (updates.username !== undefined) postUpdates.authorUsername = updates.username;
      if (updates.photoURL !== undefined) postUpdates.authorPhoto = updates.photoURL;

      const ops: any[] = [];
      
      // Update Posts
      const postsCol = collection(db, 'posts');
      const postsQ = query(postsCol, where('authorId', '==', uid));
      const postsSnapshot = await getDocs(postsQ);
      
      postsSnapshot.forEach((postDoc) => {
        ops.push(postDoc.ref);
      });

      // Update Comments
      try {
        const commentsGroup = collectionGroup(db, 'comments');
        const commentsQ = query(commentsGroup, where('authorId', '==', uid));
        const commentsSnapshot = await getDocs(commentsQ);
        
        commentsSnapshot.forEach((commentDoc) => {
          ops.push(commentDoc.ref);
        });
      } catch (err) {
        console.warn("collectionGroup query for comments failed, falling back to manual search", err);
        const allPostsSnapshot = await getDocs(collection(db, 'posts'));
        for (const postDoc of allPostsSnapshot.docs) {
          const postCommentsQ = query(collection(db, `posts/${postDoc.id}/comments`), where('authorId', '==', uid));
          const postCommentsSnap = await getDocs(postCommentsQ);
          postCommentsSnap.forEach((commentDoc) => {
            ops.push(commentDoc.ref);
          });
        }
      }

      // Execute in chunks of 500
      for (let i = 0; i < ops.length; i += 500) {
        const batch = writeBatch(db);
        const chunk = ops.slice(i, i + 500);
        chunk.forEach(ref => {
          batch.update(ref, postUpdates);
        });
        await batch.commit();
      }
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
}

export async function markUserAsDeletedInFirestore(uid: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
      isDeleted: true,
      status: 'deleted',
      deletedAt: Timestamp.now()
    }, { merge: true });
    console.log(`User ${uid} successfully marked as deleted in Firestore!`);
  } catch (error) {
    console.error("Error marking user as deleted in Firestore:", error);
  }
}

export async function deleteUserAccount(uid: string): Promise<void> {
  // 1. Mark user profile in Firestore as deleted
  await markUserAsDeletedInFirestore(uid);

  // 2. Remove user account from Firebase Authentication
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.uid === uid) {
    try {
      await deleteUser(currentUser);
      console.log(`User ${uid} deleted from Firebase Authentication.`);
    } catch (authErr) {
      console.warn("Firebase Auth deleteUser error:", authErr);
      throw authErr;
    }
  }
}

// Posts subscription (Real-time updates!)
export function subscribeToPosts(callback: (posts: Post[]) => void) {
  const postsCol = collection(db, 'posts');
  // Order by createdAt descending
  const q = query(postsCol, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const posts: Post[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      let videoUrl = data.videoUrl;
      if (docSnap.id === 'morning-meditation' || data.authorName === 'Hariprasad K.' || data.authorId === 'system_hariprasad') {
        videoUrl = undefined;
      }
      posts.push({
        ...data,
        videoUrl,
        id: docSnap.id,
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

// Edit a post
export async function editPost(
  postId: string, 
  updates: Partial<Omit<Post, 'id' | 'likes' | 'likeCount' | 'commentsCount' | 'createdAt'>>
): Promise<void> {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, cleanUndefined(updates));
  } catch (error) {
    console.error("Error editing post:", error);
    throw error;
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

// Get a single post
export async function getPost(postId: string): Promise<Post | null> {
  try {
    const postRef = doc(db, 'posts', postId);
    const snap = await getDoc(postRef);
    if (snap.exists()) {
      const data = snap.data();
      let videoUrl = data.videoUrl;
      if (snap.id === 'morning-meditation' || data.authorName === 'Hariprasad K.' || data.authorId === 'system_hariprasad') {
        videoUrl = undefined;
      }
      return {
        ...data,
        videoUrl,
        id: snap.id,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
      } as Post;
    }
    return null;
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  }
}

// Notifications functions
export async function addNotification(notification: Omit<AppNotification, 'id' | 'createdAt'>): Promise<void> {
  try {
    const notifCol = collection(db, 'notifications');
    await addDoc(notifCol, cleanUndefined({
      ...notification,
      read: false,
      createdAt: Timestamp.now()
    }));
  } catch (error) {
    console.error("Error adding notification:", error);
  }
}

export function subscribeToNotifications(userId: string, callback: (notifications: AppNotification[]) => void) {
  const notifCol = collection(db, 'notifications');
  const q = query(notifCol, where('recipientId', '==', userId));
  
  return onSnapshot(q, (snapshot) => {
    const notifications: AppNotification[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      notifications.push({
        id: docSnap.id,
        recipientId: data.recipientId,
        senderId: data.senderId,
        senderName: data.senderName,
        senderPhoto: data.senderPhoto,
        type: data.type,
        postId: data.postId,
        postTitle: data.postTitle,
        commentText: data.commentText,
        read: data.read || false,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
      });
    });
    // Sort descending by createdAt
    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    callback(notifications);
  }, (error) => {
    console.error("Error subscribing to notifications:", error);
  });
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const notifCol = collection(db, 'notifications');
    const q = query(notifCol, where('recipientId', '==', userId), where('read', '==', false));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      batch.update(docSnap.ref, { read: true });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
}

// Like or unlike a post
export async function toggleLikePost(
  postId: string, 
  userId: string, 
  hasLiked: boolean,
  postAuthorId?: string,
  postTitle?: string,
  senderUser?: { displayName: string; photoURL: string }
): Promise<void> {
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

      // Send notification to post author if not self
      let targetAuthorId = postAuthorId;
      let targetTitle = postTitle;

      if (!targetAuthorId || !targetTitle) {
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const data = postSnap.data();
          targetAuthorId = data.authorId;
          targetTitle = data.title;
        }
      }

      if (targetAuthorId && targetAuthorId !== userId) {
        let senderName = senderUser?.displayName;
        let senderPhoto = senderUser?.photoURL;
        if (!senderName) {
          const uProfile = await getUserProfile(userId);
          senderName = uProfile?.displayName || 'A fellow flutist';
          senderPhoto = uProfile?.photoURL || '';
        }
        await addNotification({
          recipientId: targetAuthorId,
          senderId: userId,
          senderName: senderName || 'A fellow flutist',
          senderPhoto: senderPhoto || '',
          type: 'like',
          postId,
          postTitle: targetTitle || 'your post',
          read: false
        });
      }
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
        authorUsername: data.authorUsername,
        text: data.text,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        likes: data.likes || [],
        dislikes: data.dislikes || [],
        imageUrl: data.imageUrl,
        parentId: data.parentId,
        replyToName: data.replyToName,
        replyToText: data.replyToText
      });
    });
    callback(comments);
  }, (error) => {
    console.error("Error subscribing to comments:", error);
  });
}

export function subscribeToLatestComments(postId: string, limitCount: number, callback: (comments: Comment[]) => void) {
  const commentsCol = collection(db, 'posts', postId, 'comments');
  const q = query(commentsCol, orderBy('createdAt', 'desc'), limit(limitCount));
  
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
        authorUsername: data.authorUsername,
        text: data.text,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        likes: data.likes || [],
        dislikes: data.dislikes || [],
        imageUrl: data.imageUrl,
        parentId: data.parentId,
        replyToName: data.replyToName,
        replyToText: data.replyToText
      });
    });
    // Reverse so they are displayed in ascending (chronological) order
    callback(comments.reverse());
  }, (error) => {
    console.error("Error subscribing to latest comments:", error);
  });
}

export async function addComment(
  postId: string, 
  comment: Omit<Comment, 'id' | 'createdAt'>,
  postAuthorId?: string,
  postTitle?: string
): Promise<void> {
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

    // Send notification to post author if not self
    let targetAuthorId = postAuthorId;
    let targetTitle = postTitle;

    if (!targetAuthorId || !targetTitle) {
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const data = postSnap.data();
        targetAuthorId = data.authorId;
        targetTitle = data.title;
      }
    }

    if (targetAuthorId && targetAuthorId !== comment.authorId) {
      await addNotification({
        recipientId: targetAuthorId,
        senderId: comment.authorId,
        senderName: comment.authorName || 'A fellow flutist',
        senderPhoto: comment.authorPhoto || '',
        type: 'comment',
        postId,
        postTitle: targetTitle || 'your post',
        commentText: comment.text ? comment.text.substring(0, 80) : 'left an attachment',
        read: false
      });
    }
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
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as UserProfile;
      if (!data.isDeleted && data.status !== 'deleted') {
        users.push({
          ...data,
          uid: docSnap.id
        });
      }
    });

    callback(users);
  }, (error) => {
    console.error("Error subscribing to all users:", error);
    callback([]);
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

// Saved Alankars Firestore Management (Cross-device sync)
export function subscribeToSavedAlankars(userId: string, callback: (alankars: any[]) => void) {
  if (!userId) {
    callback([]);
    return () => {};
  }
  const colRef = collection(db, 'users', userId, 'saved_alankars');

  return onSnapshot(colRef, (snapshot) => {
    const list: any[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        ...data,
        id: docSnap.id,
      });
    });
    // Sort descending by savedAt if present or date
    list.sort((a, b) => {
      const timeA = a.savedAt?.toMillis ? a.savedAt.toMillis() : (a.savedAt ? new Date(a.savedAt).getTime() : 0);
      const timeB = b.savedAt?.toMillis ? b.savedAt.toMillis() : (b.savedAt ? new Date(b.savedAt).getTime() : 0);
      return timeB - timeA;
    });
    callback(list);
  }, (error) => {
    console.error("Error subscribing to saved alankars:", error);
    callback([]);
  });
}

export async function saveAlankarToFirestore(userId: string, alankar: any): Promise<void> {
  if (!userId || !alankar) return;
  try {
    const docId = alankar.id || `alankar_${alankar.mathSeed || Date.now()}`;
    const docRef = doc(db, 'users', userId, 'saved_alankars', docId);
    await setDoc(docRef, cleanUndefined({
      ...alankar,
      id: docId,
      savedAt: Timestamp.now()
    }), { merge: true });
  } catch (error) {
    console.error("Error saving alankar to Firestore:", error);
    throw error;
  }
}

export async function deleteSavedAlankarFromFirestore(userId: string, alankarId: string, mathSeed?: number): Promise<void> {
  if (!userId) return;
  try {
    const docRef = doc(db, 'users', userId, 'saved_alankars', alankarId);
    await deleteDoc(docRef);

    if (mathSeed) {
      const colRef = collection(db, 'users', userId, 'saved_alankars');
      const q = query(colRef, where('mathSeed', '==', mathSeed));
      const snap = await getDocs(q);
      snap.forEach((d) => {
        deleteDoc(d.ref).catch(() => {});
      });
    }
  } catch (error) {
    console.error("Error deleting saved alankar from Firestore:", error);
    throw error;
  }
}

export async function clearAllSavedAlankarsFromFirestore(userId: string): Promise<void> {
  if (!userId) return;
  try {
    const colRef = collection(db, 'users', userId, 'saved_alankars');
    const snap = await getDocs(colRef);
    const batch = writeBatch(db);
    snap.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error("Error clearing all saved alankars from Firestore:", error);
    throw error;
  }
}
