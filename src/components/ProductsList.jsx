import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const PRODUCTS = [
  { id: 1, name: "Apple", price: 100 },
  { id: 2, name: "Banana", price: 40 },
  { id: 3, name: "Orange", price: 60 },
];

const ProductsList = () => {
  const dispatch = useDispatch();

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Products</h1>
      <ul className="space-y-2">
        {PRODUCTS.map((product) => (
          <li key={product.id} className="flex justify-between items-center border p-2 rounded">
            <span>{product.name} - ₹{product.price}</span>
            <button
              onClick={() => dispatch(addToCart(product))}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
