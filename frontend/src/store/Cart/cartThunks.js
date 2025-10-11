import { clearCart } from "./cartSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      });
      return {
        cartItems: response.data.data.books,
        message: response.data.message || ""
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


/* The commented out code block is defining an asynchronous thunk function named `clearCartThunk`. This
thunk function is intended to clear the cart by sending a DELETE request to the backend API endpoint
`${import.meta.env.VITE_BACKEND_URL}/api/cart/remove`. */
export const clearCartThunk = createAsyncThunk(
  "cart/clearCartThunk",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart/remove`);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    }
  }
);
