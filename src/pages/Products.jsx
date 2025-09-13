// src/pages/Products.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Cart from "./Cart";


const PRODUCTS = [
  { id: 1, name: "Apple", price: 100 },
  { id: 2, name: "Banana", price: 40 },
  { id: 3, name: "Orange", price: 60 },
];

const Products = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [showCart, setShowCart] = useState(false);

  if (!user?.emailVerified) {
    return <p className="p-6 text-red-500">Only verified users can access products.</p>;
  }

  return (
    <div className=" bg-gray-50 p-6">
      {/* Navbar inside products */}
      <div className="flex justify-between items-center mb-6 bg-white shadow-md rounded-lg px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">Happy Shopping</h1>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          🛒 Cart
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </button>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="mb-6 bg-white shadow-md rounded-lg p-4">
          <Cart />
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
          >
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-4">Price: ₹{product.price}</p>
            <button
              onClick={() => dispatch(addToCart(product))}
              className="bg-purple-800 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
