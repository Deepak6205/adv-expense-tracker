import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfilePage from "./ProfilePage";
import Navbar from "../components/Navbar";
import ExpenseTracker from "../components/ExpenseTracker";

const Dashboard = () => {
  const { currentUser, logout, sendVerificationEmail } = useAuth();
  const [showProfilePage, setShowProfilePage] = useState(false);

  if (showProfilePage) {
    return (
      <>
        <Navbar />
        <ProfilePage onProfileUpdated={() => setShowProfilePage(false)} />
      </>
    );
  }

  const isProfileIncomplete =
    !currentUser?.displayName || !currentUser?.photoURL;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      {/* Top Right Section */}
      <div className="absolute top-4 right-6 flex items-center gap-4">
        {!isProfileIncomplete && (
          <div className="flex items-center gap-3">
            {currentUser.photoURL && (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full shadow-md"
              />
            )}
            <span className="font-semibold text-gray-800">
              Welcome {currentUser.displayName}!
            </span>
            {currentUser.emailVerified && (
              <span className="text-green-600 text-sm font-medium">
                (Verified)
              </span>
            )}
          </div>
        )}

        {!currentUser.emailVerified && (
          <button
            onClick={sendVerificationEmail}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-sm"
          >
            Verify Email
          </button>
        )}
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </div>

      {/* Center Content */}
      <div className="flex flex-1 justify-center items-center">
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
          <ExpenseTracker />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
