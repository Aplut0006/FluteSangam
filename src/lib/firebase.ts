import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0699287191",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:320805562933:web:84662ac3806b63ea031f7c",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA2N-RGtzr0j7RFL7O7i6c5ioj1UkuajAE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0699287191.firebaseapp.com",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0699287191.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "320805562933"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
// Pass the specific firestoreDatabaseId
const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-1ddb0191-a147-4a93-8968-cf11ac1d554d";
export const db = getFirestore(app, dbId);
