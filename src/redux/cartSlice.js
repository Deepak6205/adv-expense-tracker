import { createSlice } from "@reduxjs/toolkit";
import { db } from "../services/firebase";
import { ref, set } from "firebase/database";
import { toast } from "react-toastify";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload || [];
    },
    addToCart: (state, action) => {
      const { userId, product } = action.payload;

      const itemIndex = state.items.findIndex((item) => item.id === product.id);

      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

    
      const cartRef = ref(db, `carts/${userId}`);
      set(cartRef, state.items)
        .then(() => toast.success("Item added to cart!"))
        .catch(() => toast.error("Failed to add item!"));
    },
    decreaseQuantity: (state, action) => {
      const { userId, productId } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === productId);

      if (itemIndex >= 0) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }

      set(ref(db, `carts/${userId}`), state.items)
        .then(() => toast.info("Cart updated!"))
        .catch(() => toast.error("Failed to update cart!"));
    },
    removeFromCart: (state, action) => {
      const { userId, productId } = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);

      set(ref(db, `carts/${userId}`), state.items)
        .then(() => toast.info("Item removed from cart!"))
        .catch(() => toast.error("Failed to remove item!"));
    },
    clearCart: (state, action) => {
      const { userId } = action.payload;
      state.items = [];

      set(ref(db, `carts/${userId}`), state.items)
        .then(() => toast.info("Cart cleared!"))
        .catch(() => toast.error("Failed to clear cart!"));
    },
  },
});

export const { addToCart, decreaseQuantity, removeFromCart, clearCart, setCart } =
  cartSlice.actions;
export default cartSlice.reducer;
