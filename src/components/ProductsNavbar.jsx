import React, { useState } from "react";
import { useSelector } from "react-redux";
import Cart from "../pages/Cart";

const ProductsNavbar = () => {
  const [openCart, setOpenCart] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { user } = useSelector((state) => state.auth);

  if (!user?.emailVerified) return null; 

  return (
    <div className="relative">
      
      <nav className="flex justify-between items-center p-4 bg-blue-600 text-white shadow z-20 relative">
        <h1 className="text-xl font-bold">Happy Shopping</h1>
        <button
          onClick={() => setOpenCart(!openCart)}
          className="relative bg-green-500 px-4 py-2 rounded"
        >
          Cart
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </button>
      </nav>

      
      <div
        className={`fixed top-[150px] right-0 h-full w-1/2 bg-white shadow-lg transform transition-transform duration-300  ${
          openCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Cart />
      </div>
    </div>
  );
};

export default ProductsNavbar;
