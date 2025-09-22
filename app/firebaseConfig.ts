// app/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "<AIzaSyANfL2pHlto-GYdXrLL-A7Y-S2AOZNEGk0>",
  authDomain: "front-page-mobile.firebaseapp.com",
  projectId: "front-page-mobile",
  storageBucket: "front-page-mobile.firebasestorage.app",
  messagingSenderId: "450766654552",
  appId: "1:450766654552:web:267a0bdb2daff603cbce2d",
  measurementId: "G-J8GGTSL4C9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };