import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { updateProfile, sendEmailVerification } from "firebase/auth";
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

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload(); // 🔥 ensures emailVerified is always fresh
        const token = await user.getIdToken();
        localStorage.setItem("token", token);
        setCurrentUser({ ...user });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserProfile = async (name, photoURL) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: name, photoURL });
        setCurrentUser({ ...auth.currentUser });
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    }
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        await sendEmailVerification(auth.currentUser);
        alert("Verification email sent! Please check your inbox.");
      } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
      }
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateUserProfile,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
