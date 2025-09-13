import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../redux/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import Navbar from "../components/Navbar";
import ProfilePage from "./ProfilePage";
import ExpenseTracker from "../components/ExpenseTracker";
import Home from "./Home";
import About from "./About";
import Products from "./Products";
import { Routes, Route, Navigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [showProfilePage, setShowProfilePage] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutAction());
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (showProfilePage) {
    return (
      <>
        <Navbar />
        <ProfilePage onProfileUpdated={() => setShowProfilePage(false)} />
      </>
    );
  }

  const isProfileIncomplete = !user?.displayName || !user?.photoURL;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      {/* Top Right User Info and Actions */}
      <div className="absolute top-4 right-6 flex items-center gap-4">
        {!isProfileIncomplete && (
          <div className="flex items-center gap-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full shadow-md"
              />
            )}
            <span className="font-semibold text-gray-800">
              Welcome {user?.displayName} 😊
            </span>
            {user?.emailVerified && (
              <span className="text-green-600 text-sm font-medium">(Verified)</span>
            )}
          </div>
        )}

        {!user?.emailVerified && (
          <button
            onClick={async () => {
              try {
                await auth.currentUser?.sendEmailVerification?.();
                alert("Verification email sent!");
              } catch (err) {
                console.error("Failed to send verification:", err);
                alert("Failed to send verification email.");
              }
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-sm"
          >
            Verify Email
          </button>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 justify-center items-center w-full">
        {isProfileIncomplete ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Your profile is incomplete
            </h2>
            <button
              onClick={() => setShowProfilePage(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Complete Profile
            </button>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<ExpenseTracker />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            {/* Redirect unknown nested routes back to ExpenseTracker */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
