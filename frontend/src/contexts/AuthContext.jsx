import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useLocalAuth, setUseLocalAuth] = useState(false);

  useEffect(() => {
    // Initialize auth - try Firebase first, fall back to localStorage
    const initAuth = async () => {
      try {
        // Try to set up Firebase auth listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          setUseLocalAuth(false);
          setLoading(false);
        });
        return unsubscribe;
      } catch (error) {
        console.warn("Firebase Auth not ready, using localStorage");
        setUseLocalAuth(true);
        
        // Load from localStorage
        try {
          const saved = localStorage.getItem("currentUser");
          if (saved) {
            setCurrentUser(JSON.parse(saved));
          }
        } catch (e) {
          console.warn("Could not load user from localStorage:", e);
        }
        
        setLoading(false);
      }
    };

    const unsubscribe = initAuth();
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  function signup(email, password, userData) {
    if (useLocalAuth) {
      // localStorage-based signup for development
      const user = {
        uid: Date.now().toString(),
        email: email,
        ...userData,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user);
      
      // Still save to Firestore if possible
      try {
        setDoc(doc(db, "users", user.uid), user);
      } catch (e) {
        console.warn("Could not save to Firestore:", e.message);
      }
      
      return Promise.resolve();
    }

    // Real Firebase Auth
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        await setDoc(doc(db, "users", result.user.uid), {
          email: email,
          ...userData,
          createdAt: new Date()
        });
        return result;
      });
  }

  function login(email, password) {
    if (useLocalAuth) {
      // localStorage-based login for development
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.email === email && password.length > 0) {
          setCurrentUser(user);
          return Promise.resolve();
        }
      }
      return Promise.reject(new Error("Invalid email or password"));
    }

    // Real Firebase Auth
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    if (useLocalAuth) {
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      return Promise.resolve();
    }

    return signOut(auth);
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    useLocalAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}