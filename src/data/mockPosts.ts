import { Post, Comment } from '../types';

export const INITIAL_COMMUNITY_POSTS: Omit<Post, 'id' | 'createdAt'>[] = [
  {
    authorId: "system_hariprasad",
    authorName: "Hariprasad K.",
    authorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    authorLevel: "Guru",
    title: "Morning Meditation - Raga Bhairav on E Bass Bansuri",
    description: "Waking up to the serene waves of Raga Bhairav. Practicing the slow Andolan (oscillations) on Komal Re and Komal Dha. Playing on a standard E Bass flute from Punam Flutes. Let me know what you think of the breath transitions!",
    category: "Performance",
    raga: "Bhairav",
    videoUrl: "https://www.youtube.com/embed/5U9N5Xor9tY", // A high-quality public Bansuri video (or similar)
    likes: ["user1", "user2"],
    likeCount: 2,
    commentsCount: 3
  },
  {
    authorId: "system_ananya",
    authorName: "Ananya Sharma",
    authorPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    authorLevel: "Advanced",
    title: "Essential Tips for Long Breath Control on E Bass",
    description: "Struggling with sustaining notes on your Bass flutes? Here is a mini-tutorial. 1) Diaphragmatic breathing is key - your chest shouldn't move, only your belly should expand. 2) Practice Alankars in slow tempo (4 beats per note). 3) Keep your embouchure relaxed. Don't blow too hard on the lower register. Drop any questions below!",
    category: "Tutorial",
    likes: ["user3"],
    likeCount: 1,
    commentsCount: 2
  },
  {
    authorId: "system_rahul",
    authorName: "Rahul Verma",
    authorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    authorLevel: "Intermediate",
    title: "Review of Subhash Thakur's C Natural Medium Flute",
    description: "Just received my custom C Natural medium from Subhash Ji. The tuning is absolutely spot-on (A440 Hz verified). The upper octave (Taar Saptak) is surprisingly easy to blow and doesn't sound shrill. It's highly responsive for fast taans. Definitely a 5/5 for Indian classical and light music!",
    category: "Review",
    likes: ["user1", "user4", "user5"],
    likeCount: 3,
    commentsCount: 1
  },
  {
    authorId: "system_vikram",
    authorName: "Vikram Sen",
    authorPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    authorLevel: "Beginner",
    title: "How to transition from 6-hole to 7-hole playing?",
    description: "Hi community! I recently bought an A Natural bass flute which has 7 holes. I am used to 6 holes where I grip with the pads of my fingers. With 7 holes, the pinky finger feels very short and strained. Should I switch to the 'cross-fingering' grip or look into the 'classical' fingertip grip? Any advice or YouTube links would be highly appreciated!",
    category: "Question",
    likes: [],
    likeCount: 0,
    commentsCount: 4
  },
  {
    authorId: "system_meera",
    authorName: "Meera Iyer",
    authorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    authorLevel: "Advanced",
    title: "Deep Dive into Raga Bhimpalasi - Explaining the Afternoon Mood",
    description: "Let's talk about Bhimpalasi! It is an afternoon raga. Note how the omission of Re and Dha in Aaroh creates that special tension of yearning, which is beautifully resolved in the Avroh. When playing on bansuri, the half-hole blowing on Komal Ga needs to be extremely precise. Let's discuss your favorite compositions in Bhimpalasi!",
    category: "Raga Discussion",
    raga: "Bhimpalasi",
    videoUrl: "https://www.youtube.com/embed/zH3F8rR_Zrs",
    likes: ["user2", "user3", "user4"],
    likeCount: 3,
    commentsCount: 2
  }
];

export const MOCK_COMMENTS: Record<string, Omit<Comment, 'id' | 'createdAt'>[]> = {
  // Comments for Raga Bhairav post
  "morning-meditation": [
    {
      postId: "morning-meditation",
      authorId: "system_ananya",
      authorName: "Ananya Sharma",
      authorPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      text: "Outstanding tone, Hariprasad Ji! The meend (glide) from Komal Re to Sa was incredibly smooth. Which tuner app do you use?"
    },
    {
      postId: "morning-meditation",
      authorId: "system_hariprasad",
      authorName: "Hariprasad K.",
      authorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      text: "Thank you Ananya! I use the Tanpura Droid app combined with iShala for practice. Highly recommend it."
    },
    {
      postId: "morning-meditation",
      authorId: "system_vikram",
      authorName: "Vikram Sen",
      authorPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      text: "Wow! As a beginner, hearing this sound inspires me to practice every day. Breath control is magical."
    }
  ],
  // Comments for breath control
  "essential-breath-tips": [
    {
      postId: "essential-breath-tips",
      authorId: "system_vikram",
      authorName: "Vikram Sen",
      authorPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      text: "Thank you for the tip on diaphragmatic breathing! I noticed a huge difference today when I kept my chest steady."
    },
    {
      postId: "essential-breath-tips",
      authorId: "system_rahul",
      authorName: "Rahul Verma",
      authorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      text: "Slow tempo Alankars (especially Mandra Saptak) have been a game-changer for my lung capacity. Great write-up!"
    }
  ],
  // Comments for review
  "shakur-c-natural-review": [
    {
      postId: "shakur-c-natural-review",
      authorId: "system_hariprasad",
      authorName: "Hariprasad K.",
      authorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      text: "Subhash Thakur flutes are legendary. I have been playing his E bass and A bass for 5 years. True concert quality!"
    }
  ],
  // Comments for 6-to-7 hole question
  "six-to-seven-hole-question": [
    {
      postId: "six-to-seven-hole-question",
      authorId: "system_meera",
      authorName: "Meera Iyer",
      authorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      text: "Vikram, don't strain! For the 7th hole, many players use the pinky pad or even slide their fingers down. Try stretching exercises off-flute. It gets easier in 2-3 weeks."
    },
    {
      postId: "six-to-seven-hole-question",
      authorId: "system_ananya",
      authorName: "Ananya Sharma",
      authorPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      text: "If you're using classical fingertip style, it can be tougher on long bass flutes. I highly recommend shifting to the 'pipers grip' (using finger pads) if your hands are small/medium."
    },
    {
      postId: "six-to-seven-hole-question",
      authorId: "system_vikram",
      authorName: "Vikram Sen",
      authorPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      text: "Thank you both! I will give the pipers grip a solid try. The stretch is definitely the hard part."
    },
    {
      postId: "six-to-seven-hole-question",
      authorId: "system_rahul",
      authorName: "Rahul Verma",
      authorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      text: "Also, you don't always need to close the 7th hole! It's mainly for Teevra Madhyam or Komal Ni depending on base tuning. Take it easy at first."
    }
  ],
  // Comments for Bhimpalasi discussion
  "bhimpalasi-deep-dive": [
    {
      postId: "bhimpalasi-deep-dive",
      authorId: "system_hariprasad",
      authorName: "Hariprasad K.",
      authorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      text: "Excellent observation on Komal Ga. The half-hole coverage requires extreme control over your blowing angle to hit the perfect shruti."
    },
    {
      postId: "bhimpalasi-deep-dive",
      authorId: "system_meera",
      authorName: "Meera Iyer",
      authorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      text: "So true Hariprasad Ji. Shifting the head posture slightly helps adjust the pitch of Komal Ga on the fly."
    }
  ]
};
