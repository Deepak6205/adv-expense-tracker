import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AuthCard = ({ onLoginSuccess }) => {
  const { signup, login } = useAuth();
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      try {
        await signup(email, password);
        console.log("✅ User signed up successfully");
        setIsSignup(false);
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        await login(email, password);
        console.log("✅ User logged in successfully");
        onLoginSuccess();
      } catch (err) {
        setError("Invalid credentials!");
      }
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
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-300 focus:border-blue-500 p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isSignup && (
            <input
              type="password"
              placeholder="Confirm your password"
              className="border border-gray-300 focus:border-blue-500 p-3 rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don’t have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
