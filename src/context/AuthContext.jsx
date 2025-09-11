import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { updateProfile } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = async () => {
    localStorage.removeItem("token");
    await signOut(auth);
    setCurrentUser(null);
  };

  const updateUserProfile = async (name, photoURL) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      setCurrentUser({ ...auth.currentUser });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();

          // Fetch latest profile data from Firebase
          const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${
              import.meta.env.VITE_FIREBASE_API_KEY
            }`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: token }),
            }
          );

          const data = await res.json();
          if (data.users && data.users.length > 0) {
            const latestUser = data.users[0];
            user.displayName = latestUser.displayName || "";
            user.photoURL = latestUser.photoUrl || "";
          }

          localStorage.setItem("token", token);
          setCurrentUser(user);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateUserProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
