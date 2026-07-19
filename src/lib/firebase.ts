import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0699287191",
  appId: "1:320805562933:web:84662ac3806b63ea031f7c",
  apiKey: "AIzaSyA2N-RGtzr0j7RFL7O7i6c5ioj1UkuajAE",
  authDomain: "gen-lang-client-0699287191.firebaseapp.com",
  storageBucket: "gen-lang-client-0699287191.firebasestorage.app",
  messagingSenderId: "320805562933"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
// Pass the specific firestoreDatabaseId "ai-studio-1ddb0191-a147-4a93-8968-cf11ac1d554d"
export const db = getFirestore(app, "ai-studio-1ddb0191-a147-4a93-8968-cf11ac1d554d");
