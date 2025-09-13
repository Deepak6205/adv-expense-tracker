
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { auth } from "../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(" Password reset link sent! Check your inbox.");
    } catch (err) {
      setError("Failed to send reset email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100">
      <Navbar />
      <div className="flex flex-1 justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">Reset Your Password</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="email" placeholder="Enter your registered email" className="border border-gray-300 focus:border-blue-500 p-3 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg disabled:opacity-50">
              {loading ? "Sending..." : "Send Link"}
            </button>
          </form>

          {message && <p className="text-green-600 text-sm font-medium text-center mt-4">{message}</p>}
          {error && <p className="text-red-500 text-sm font-medium text-center mt-4">{error}</p>}

          <div className="mt-6 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-800">← Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
