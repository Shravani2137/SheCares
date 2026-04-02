import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBj_HBQnVtKxqX3r6oolluuPKigOAusHl4",
  authDomain: "shecares-369c3.firebaseapp.com",
  projectId: "shecares-369c3",
  storageBucket: "shecares-369c3.firebasestorage.app",
  messagingSenderId: "695516340495",
  appId: "1:695516340495:web:76239d92ada0224eb69e7a"
};

const app = initializeApp(firebaseConfig);

// ✅ THIS IS IMPORTANT
export const db = getFirestore(app);
export const auth = getAuth(app);