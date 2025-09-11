import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ProfilePage from "./ProfilePage";
import { auth } from "../services/firebase"; // ✅ corrected path

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [userDetails, setUserDetails] = useState(currentUser);

  useEffect(() => {
    const fetchLatestUser = async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload(); // 🔄 refresh from Firebase
        setUserDetails(auth.currentUser);
      }
    };
    fetchLatestUser();
  }, [showProfilePage, currentUser]);

  if (showProfilePage) {
    return <ProfilePage onProfileUpdated={() => setShowProfilePage(false)} />;
  }

  const isProfileIncomplete =
    !userDetails?.displayName || !userDetails?.photoURL;

  return (
    <div className="flex flex-col justify-center items-center h-screen">
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
          <h1 className="text-2xl font-bold">
            Welcome {userDetails.displayName}! 🎉
          </h1>
          {userDetails.photoURL && (
            <img
              src={userDetails.photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-md"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
