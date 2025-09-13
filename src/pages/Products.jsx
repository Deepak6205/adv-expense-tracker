import React, { useState } from "react";
import ProductsNavbar from "../components/ProductsNavbar";
import ProductsList from "../components/ProductsList";
import Cart from "./Cart";

const Products = () => {
  const [showCart, setShowCart] = useState(false);

  return (
    <div>
      <ProductsNavbar onCartClick={() => setShowCart(!showCart)} />
      <ProductsList />

      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg transform transition-transform duration-300 ${
          showCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Cart />
      </div>
    </div>
  );
};

export default Products;
