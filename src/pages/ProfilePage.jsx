import React from "react";
import Navbar from "../components/Navbar";
import ProfileForm from "../components/ProfileForm";

const ProfilePage = ({ onProfileUpdated }) => {
  return (
    <div>
      <ProfileForm onUpdateSuccess={onProfileUpdated} />
    </div>
  );
};

export default ProfilePage;
