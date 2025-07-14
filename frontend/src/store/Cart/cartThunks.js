import { clearCart } from "./cartSlice"; 
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const { token, userid } = state.auth;

      const response = await axios.get("http://localhost:3000/api/cart/get-user-cart", {
        headers: {
          userid,
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data.data)
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
      await axios.delete("http://localhost:3000/api/user/cart/clear"); // ✅ Full URL preferred in dev
      dispatch(clearCart()); // ✅ Clears state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    }
  }
);
