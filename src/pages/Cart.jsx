import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";
import { toast } from "react-toastify";

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.user?.uid);
  const dispatch = useDispatch();

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleAdd = (item) => {
    dispatch(addToCart({ userId, product: item }));
    toast.success(`${item.title || item.name} added to cart!`);
  };

  const handleDecrease = (itemId) => {
    dispatch(decreaseQuantity({ userId, productId: itemId }));
    toast.info("Item quantity decreased");
  };

  const handleRemove = (itemId, itemName) => {
    dispatch(removeFromCart({ userId, productId: itemId }));
    toast.error(`${itemName} removed from cart`);
  };

  const handleClear = () => {
    dispatch(clearCart({ userId }));
    toast.info("Cart cleared!");
  };

  if (items.length === 0)
    return (
      <p className="p-6 text-gray-500 text-center italic">
        🛒 Your cart is empty
      </p>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
        Your Cart
      </h2>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.title || item.name}
                className="w-16 h-16 object-contain rounded-md border"
              />
              <div>
                <p className="font-semibold text-lg text-gray-800 line-clamp-1">
                  {item.title || item.name}
                </p>
                <p className="text-gray-600 text-sm">
                  ₹{item.price} × {item.quantity}{" "}
                  <span className="font-medium text-gray-800">
                    = ₹{item.price * item.quantity}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAdd(item)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg shadow hover:bg-green-700 transition"
              >
                +
              </button>
              <button
                onClick={() => handleDecrease(item.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition"
              >
                -
              </button>
              <button
                onClick={() => handleRemove(item.id, item.title || item.name)}
                className="bg-red-600 text-white px-3 py-1 rounded-lg shadow hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between items-center bg-gray-100 rounded-xl p-4 shadow-inner">
        <p className="font-bold text-lg text-gray-800">
          Total: <span className="text-blue-700">₹{totalPrice.toFixed(2)}</span>
        </p>
        <button
          onClick={handleClear}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
