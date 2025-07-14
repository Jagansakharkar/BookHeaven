import { createSlice } from "@reduxjs/toolkit";
import { fetchCart, clearCartThunk } from "./cartThunks";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
    message: ""
  },
  reducers: {
    updateQuantity: (state, action) => {
      const { bookid, quantity } = action.payload;
      const item = state.cartItems.find(item => item.bookid === bookid);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.bookid !== action.payload); 
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.cartItems || [];
        state.message = action.payload.message;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];

      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
