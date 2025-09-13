
import React from "react";
import ProfileForm from "../components/ProfileForm";

const ProfilePage = ({ onProfileUpdated }) => {
  return (
    <div>
      <ProfileForm onUpdateSuccess={onProfileUpdated} />
    </div>
  );
};

export default ProfilePage;
