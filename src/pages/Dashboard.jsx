import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ProfilePage from "./ProfilePage";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [userDetails, setUserDetails] = useState(currentUser);

  useEffect(() => {
    setUserDetails(currentUser);
  }, [currentUser]);

  if (showProfilePage) {
    return (
      <>
        <Navbar />
        <ProfilePage onProfileUpdated={() => setShowProfilePage(false)} />
      </>
    );
  }

  const isProfileIncomplete = !userDetails?.displayName || !userDetails?.photoURL;

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar always at the top */}
      <Navbar />

      <div className="flex flex-col justify-center items-center flex-1">
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
            <h1 className="text-2xl font-bold">Welcome {userDetails.displayName}! 🎉</h1>
            {userDetails.photoURL && (
              <img
                src={userDetails.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full shadow-md"
              />
            )}
            <button
              onClick={logout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 mt-4"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
