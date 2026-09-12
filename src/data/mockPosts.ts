import { Post, Comment, UserProfile } from '../types';

export const CARTOON_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buddy",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Max",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Lily",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe"
];

export const INITIAL_MOCK_USERS: UserProfile[] = [
  {
    uid: "system_meera",
    displayName: "Meera Iyer",
    username: "meera_ragas",
    email: "meera@flutesangam.org",
    photoURL: CARTOON_AVATARS[8],
    bio: "Carnatic & Hindustani bamboo flute musician exploring afternoon & evening ragas.",
    level: "Advanced",
    bansuriType: "G Bass",
    location: "Chennai, India",
    joinedAt: new Date("2024-04-01")
  },
  {
    uid: "QiYijIRmpBMwLLAJ11M6ybELRU43",
    displayName: "Lalitha Siriki",
    username: "lalithasiriki",
    email: "lalithasiriki7@gmail.com",
    photoURL: CARTOON_AVATARS[6],
    bio: "N/A",
    level: "N/A",
    bansuriType: "N/A",
    location: "N/A",
    joinedAt: new Date("2024-02-15")
  },
  {
    uid: "If9vdMd4x7cO23ATq7a4vrbX1SK2",
    displayName: "Kalyan Paul",
    username: "kalyanpaul",
    email: "paulkalyan3@gmail.com",
    photoURL: CARTOON_AVATARS[5],
    bio: "N/A",
    level: "N/A",
    bansuriType: "N/A",
    location: "N/A",
    joinedAt: new Date("2024-03-01")
  },
  {
    uid: "Fu1khm6v9bbA4Jq6O10ctiXCoVG2",
    displayName: "Basagouda",
    username: "basagouda",
    email: "basagoudavk18@gmail.com",
    photoURL: CARTOON_AVATARS[4],
    bio: "N/A",
    level: "N/A",
    bansuriType: "N/A",
    location: "N/A",
    joinedAt: new Date("2024-03-12")
  }
];

export const INITIAL_COMMUNITY_POSTS: Omit<Post, 'id' | 'createdAt'>[] = [
  {
    authorId: "system_meera",
    authorName: "Meera Iyer",
    authorPhoto: CARTOON_AVATARS[8],
    authorLevel: "Advanced",
    title: "Deep Dive into Raga Bhimpalasi - Explaining the Afternoon Mood",
    description: "Let's talk about Bhimpalasi! It is an afternoon raga. Note how the omission of Re and Dha in Aaroh creates that special tension of yearning, which is beautifully resolved in the Avroh. When playing on bansuri, the half-hole blowing on Komal Ga needs to be extremely precise. Let's discuss your favorite compositions in Bhimpalasi!",
    category: "Raga Discussion",
    raga: "Bhimpalasi",
    videoUrl: "https://www.youtube.com/embed/zH3F8rR_Zrs",
    likes: ["user2", "user3", "user4"],
    likeCount: 3,
    commentsCount: 0
  }
];

export const STATIC_INITIAL_POSTS: Post[] = INITIAL_COMMUNITY_POSTS.map((item, index) => {
  const ids = [
    "bhimpalasi-deep-dive"
  ];
  return {
    id: ids[index] || `post-${index}`,
    createdAt: new Date(1722000000000 - index * 86400000),
    updatedAt: new Date(1722000000000 - index * 86400000),
    ...item
  };
});

export const MOCK_COMMENTS: Record<string, Omit<Comment, 'id' | 'createdAt'>[]> = {
  // Comments for Bhimpalasi discussion
  "bhimpalasi-deep-dive": []
};
