import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAlertBooks = createAsyncThunk(
  'books/fetchAlertBooks',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState()
      const { token, userId } = state.auth
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/inventory/books-alert`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      return {
        lowStockBooks: response.data.lowStockBooks,
        outOfStock: response.data.outOfStock,
        message: response.data.message || ""

      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
)