import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Expense Tracker</h1>
      <div className="space-x-4">
        <Link to="/signup" className="hover:underline">Signup</Link>
        <Link to="/login" className="hover:underline">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
