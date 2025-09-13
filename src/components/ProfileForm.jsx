// src/components/ProfileForm.jsx
import React, { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../services/firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const ProfileForm = ({ onUpdateSuccess }) => {
  const dispatch = useDispatch();
  const currentUser = auth.currentUser;
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || "");
      setPhotoURL(currentUser.photoURL || "");
    }
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!auth.currentUser) throw new Error("No authenticated user.");

      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      // update redux user
      dispatch(
        setUser({
          uid: auth.currentUser.uid,
          displayName: name,
          photoURL,
          email: auth.currentUser.email,
          emailVerified: auth.currentUser.emailVerified,
        })
      );

      alert("Profile updated successfully!");
      onUpdateSuccess();
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Update Profile</h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <input type="text" placeholder="Full Name" className="border p-3 rounded-lg" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Profile Photo URL" className="border p-3 rounded-lg" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Update</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
