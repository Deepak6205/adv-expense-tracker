
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { login } from "../redux/authSlice";

const AuthCard = () => {
  const dispatch = useDispatch();
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        const token = await user.getIdToken();

       
        await updateProfile(user, { displayName: user.email.split("@")[0] });

        dispatch(
          login({
            token,
            userId: user.uid,
            user: {
              uid: user.uid,
              displayName: user.displayName || user.email.split("@")[0],
              photoURL: user.photoURL,
              email: user.email,
              emailVerified: user.emailVerified,
            },
          })
        );
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        const token = await user.getIdToken();

        dispatch(
          login({
            token,
            userId: user.uid,
            user: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
              email: user.email,
              emailVerified: user.emailVerified,
            },
          })
        );
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          {isSignup ? "Create an Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 focus:border-blue-500 p-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-300 focus:border-blue-500 p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignup && (
            <input
              type="password"
              placeholder="Confirm your password"
              className="border border-gray-300 focus:border-blue-500 p-3 rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {!isSignup && (
          <div className="text-center">
            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot Password?
            </a>
          </div>
        )}

        <div className="mt-6 text-center">
          <button onClick={() => setIsSignup(!isSignup)} className="text-blue-600 hover:text-blue-800">
            {isSignup ? "Already have an account? Login" : "Don’t have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
