import { clearCart } from "./cartSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const { token, userId } = state.auth;

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
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


export const clearCartThunk = createAsyncThunk(
  "cart/clearCartThunk",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart/remove/${userId}`);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    }
  }
);
