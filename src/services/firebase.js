import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const missingFirebaseConfigKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

let authInstance;

if (hasFirebaseConfig) {
  const app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);
}

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  if (!authInstance) {
    throw new Error('Firebase client configuration is missing');
  }

  return signInWithPopup(authInstance, googleProvider);
};

const signOutFirebase = async () => {
  if (authInstance) {
    await signOut(authInstance);
  }
};

export {
  authInstance,
  hasFirebaseConfig,
  missingFirebaseConfigKeys,
  signInWithGoogle,
  signOutFirebase,
};