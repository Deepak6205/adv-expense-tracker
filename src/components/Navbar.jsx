import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-start items-center gap-8 px-8 py-4 bg-white shadow">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-blue-600">MyWebLink</h1>
      </div>
      <div className="flex  gap-6 text-gray-700">
        <span className="cursor-pointer">Home</span>
        <span className="cursor-pointer">Products</span>
        <span className="cursor-pointer">About Us</span>
      </div>
    </nav>
  );
};

export default Navbar;
