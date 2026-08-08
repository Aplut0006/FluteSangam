import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  memoryLocalCache
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);

const dbId = firebaseConfig.firestoreDatabaseId || '(default)';

let firestoreDb: any;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, dbId);
} catch (e) {
  // Fallback to memory cache if IndexedDB / multi-tab storage is restricted in iframe
  firestoreDb = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    localCache: memoryLocalCache()
  }, dbId);
}

export const db = firestoreDb;

let authInstance: any = null;
export function getAuthInstance() {
  if (!authInstance) {
    authInstance = getAuth(app);
  }
  return authInstance;
}

// Proxy object for auth so that getAuth(app) is executed lazily when auth properties/methods are accessed, preventing synchronous auth iframe creation on page load
export const auth: ReturnType<typeof getAuth> = new Proxy({} as any, {
  get(_target, prop) {
    const instance = getAuthInstance();
    const val = (instance as any)[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  }
});

