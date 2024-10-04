// services/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // No getReactNativePersistence here
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCCEwzc-o9SxH5IFGbkTW7xZ_R4MrOj18I",
  authDomain: "cartracker-100d5.firebaseapp.com",
  projectId: "cartracker-100d5",
  storageBucket: "cartracker-100d5.appspot.com",
  messagingSenderId: "177215918007",
  appId: "1:177215918007:android:b5f79fa993506ffbfc2232"
};

// Initialize Firebase only once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use existing app
}

// Initialize Firebase Auth (without getReactNativePersistence)
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
