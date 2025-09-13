import React from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { isLoggedIn } = useSelector((s) => s.auth);

  return (
    <nav className="flex justify-items-start items-center gap-8 px-8 py-4 bg-white shadow">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-blue-600">MyWebLink</h1>
      </div>
      <div className="flex gap-6 items-center text-gray-700">
        <span className="cursor-pointer">Home</span>
        <span className="cursor-pointer">Products</span>
        <span className="cursor-pointer">About Us</span>
        {isLoggedIn && (
          <span className="text-sm text-green-600">Signed In</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
