import React from "react";
import Navbar from "../components/Navbar";
import ProfileForm from "../components/ProfileForm";

const ProfilePage = ({ onProfileUpdated }) => {
  return (
    <div>
      <Navbar />
      <ProfileForm onUpdateSuccess={onProfileUpdated} />
    </div>
  );
};

export default ProfilePage;
