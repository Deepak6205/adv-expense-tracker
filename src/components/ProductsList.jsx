import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.uid); // Get logged-in user ID

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast.error("Failed to fetch products!");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!userId) {
      toast.warning("Please login first!");
      return;
    }
    dispatch(addToCart({ userId, product }));
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading products...
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
        🛍️ Available Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-40 object-contain mb-4"
            />
            <h2 className="font-semibold text-lg text-center mb-2 line-clamp-2">
              {product.title}
            </h2>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
            <p className="text-indigo-950 font-bold text-lg mb-4">
              ₹{product.price}
            </p>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-fuchsia-950 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
