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
    authorUsername: "meera_ragas",
    authorPhoto: CARTOON_AVATARS[8],
    authorLevel: "Advanced",
    title: "Deep Dive into Raga Bhimpalasi - Explaining the Afternoon Mood",
    description: "Let's talk about Bhimpalasi! It is an afternoon raga from the Kafi Thaat. Note how the omission of Re and Dha in Aaroh (.Ni Sa ga Ma Pa ni Sa') creates that special tension of yearning, which is beautifully resolved in the Avroh (Sa' ni Dha Pa Ma ga Re Sa). When playing on bansuri, the half-hole blowing on Komal Ga (ga) and Komal Ni (ni) needs to be extremely steady, especially when taking a slow Meend from Ma to ga. What are your favorite bandishes or film songs based on Raga Bhimpalasi?",
    category: "Raga Discussion",
    raga: "Bhimpalasi",
    videoUrl: "https://www.youtube.com/embed/zH3F8rR_Zrs",
    likes: ["user2", "user3", "user4"],
    likeCount: 14,
    commentsCount: 4
  },
  {
    authorId: "QiYijIRmpBMwLLAJ11M6ybELRU43",
    authorName: "Lalitha Siriki",
    authorUsername: "lalithasiriki",
    authorPhoto: CARTOON_AVATARS[6],
    authorLevel: "Beginner",
    title: "Tips for Getting a Clean Pa and Higher Sa' Without Airy Hiss on C Medium Flute",
    description: "I have been practicing on a C Natural Medium bansuri for the past two months. My middle octave Sa, Re, Ga, and Ma sound clear now, but whenever I close all six holes or blow slightly harder for Pa and Taar Saptak Sa', the note either cracks or sounds very airy. How do you adjust your lower lip coverage and airstream angle when transitioning from Ma to Pa?",
    category: "Question",
    raga: "General Practice",
    likes: ["system_meera", "If9vdMd4x7cO23ATq7a4vrbX1SK2"],
    likeCount: 9,
    commentsCount: 5
  },
  {
    authorId: "If9vdMd4x7cO23ATq7a4vrbX1SK2",
    authorName: "Kalyan Paul",
    authorUsername: "kalyanpaul",
    authorPhoto: CARTOON_AVATARS[5],
    authorLevel: "Intermediate",
    title: "Morning Kharaj Sadhana Routine: 20 Minutes of Mandra Saptak .Pa and .Dha",
    description: "Sharing my structured 20-minute morning riyaz routine that completely transformed my tone depth on E Bass bansuri. Start with 5 minutes of sustained Middle Sa against a Tanpura drone (Pa-Sa tuning), then descend slowly to Mandra .Ni, .Dha, and .Pa holding each breath for 12–15 seconds without wavering in pitch. Focusing on relaxed abdominal support instead of throat tension makes the lower register resonate warmly.",
    category: "Tutorial",
    raga: "Bilawal",
    likes: ["system_meera", "QiYijIRmpBMwLLAJ11M6ybELRU43", "Fu1khm6v9bbA4Jq6O10ctiXCoVG2"],
    likeCount: 18,
    commentsCount: 6
  },
  {
    authorId: "Fu1khm6v9bbA4Jq6O10ctiXCoVG2",
    authorName: "Basagouda",
    authorUsername: "basagouda",
    authorPhoto: CARTOON_AVATARS[4],
    authorLevel: "Intermediate",
    title: "Practicing Raag Yaman Aalap & Tivra Ma Finger Control on G Base Bansuri",
    description: "Working on slow-tempo (Vilambit) Aalap phrases in Raag Yaman tonight. Beginning with .Ni Re Ga, Ma# Dha Ni Sa' and focusing on the delicate transition between Shuddha Ga and Tivra Ma (fully open 3rd hole). Using the online Tanpura drone at G tonic really helps lock in the Gandhar (Ga) and Nishad (Ni) intonation!",
    category: "Performance",
    raga: "Yaman",
    likes: ["system_meera", "If9vdMd4x7cO23ATq7a4vrbX1SK2"],
    likeCount: 11,
    commentsCount: 3
  },
  {
    authorId: "system_meera",
    authorName: "Meera Iyer",
    authorUsername: "meera_ragas",
    authorPhoto: CARTOON_AVATARS[8],
    authorLevel: "Advanced",
    title: "How to Practice Pyramid Alankars for Smooth Finger Independence",
    description: "Many learners rush through basic Sa Re Ga Ma paltas at high speed before their fingers are synchronized. Try practicing pyramid alankars (Sa, Sa Re Sa, Sa Re Ga Re Sa, Sa Re Ga Ma Ga Re Sa) at 60 BPM in Ekgun, then 120 BPM in Dugun. Listen closely for any 'blips' when lifting the ring finger between Dha and Ni—keeping your fingers within 1 cm of the tone holes is key.",
    category: "Tutorial",
    raga: "Bhoopali",
    likes: ["QiYijIRmpBMwLLAJ11M6ybELRU43", "If9vdMd4x7cO23ATq7a4vrbX1SK2", "Fu1khm6v9bbA4Jq6O10ctiXCoVG2"],
    likeCount: 22,
    commentsCount: 7
  },
  {
    authorId: "If9vdMd4x7cO23ATq7a4vrbX1SK2",
    authorName: "Kalyan Paul",
    authorUsername: "kalyanpaul",
    authorPhoto: CARTOON_AVATARS[5],
    authorLevel: "Intermediate",
    title: "Transitioning from C Medium to E Bass Bansuri: Finger Stretch & Grip Adjustments",
    description: "After 8 months on a C Medium flute, I recently picked up my first E Bass bansuri (30 inches). At first, sealing the 3rd and 6th holes with the ring fingers felt like a huge stretch! Switching to the authentic Piper's Grip—resting the flute holes on the middle phalanx of the ring and middle fingers rather than the fingertips—solved the air leaks within a week.",
    category: "Review",
    raga: "Hamsadhwani",
    likes: ["system_meera", "Fu1khm6v9bbA4Jq6O10ctiXCoVG2"],
    likeCount: 15,
    commentsCount: 4
  }
];

export const STATIC_INITIAL_POSTS: Post[] = INITIAL_COMMUNITY_POSTS.map((item, index) => {
  const ids = [
    "bhimpalasi-deep-dive",
    "clean-pa-and-higher-sa-tips",
    "morning-kharaj-sadhana-routine",
    "raag-yaman-aalap-tivra-ma",
    "pyramid-alankars-finger-independence",
    "transitioning-c-medium-to-e-bass"
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
