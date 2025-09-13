import React from "react";
import { useSelector } from "react-redux";

const ProductsNavbar = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { user } = useSelector((state) => state.auth);

  if (!user?.emailVerified) return null; // only for verified users

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white shadow">
      <h1 className="text-xl font-bold">Happy Shopping</h1>
      <button className="relative bg-green-500 px-4 py-2 rounded">
        Cart
        {totalQty > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalQty}
          </span>
        )}
      </button>
    </nav>
  );
};

export default ProductsNavbar;
