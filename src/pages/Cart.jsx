// src/components/Cart.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, decreaseQuantity, removeFromCart, clearCart } from "../redux/cartSlice";

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (items.length === 0)
    return <p className="p-4 text-gray-500 text-center">Your cart is empty</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50 transition"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">
                ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(addToCart(item))}
                className="bg-purple-900 text-white px-2 py-1 rounded hover:bg-purple-800"
              >
                +
              </button>
              <button
                onClick={() => dispatch(decreaseQuantity(item.id))}
                className="bg-red-900 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                -
              </button>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="bg-black text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between items-center">
        <p className="font-semibold text-lg">Total: ₹{totalPrice}</p>
        <button
          onClick={() => dispatch(clearCart())}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
