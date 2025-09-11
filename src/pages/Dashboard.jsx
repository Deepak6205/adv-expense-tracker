import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfilePage from "./ProfilePage";
import Navbar from "../components/Navbar";

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


      <div className="absolute top-4 right-6 flex gap-3">
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

      <div className="flex flex-col justify-center items-center flex-1 space-y-4">
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
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Welcome {currentUser.displayName}! 🎉
              {currentUser.emailVerified && (
                <span className="text-green-600 text-lg font-medium">
                  (Verified)
                </span>
              )}
            </h1>

            {currentUser.photoURL && (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full shadow-md"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
