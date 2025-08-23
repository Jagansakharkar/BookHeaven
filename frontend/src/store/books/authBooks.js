import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async ({ page = 1, limit = 12 }, thunkAPI) => {

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/books`,
        { params: { page, limit } }
      );

      return {
        books: response.data.data.books,
        currentPage: response.data.data.currentPage,
        totalPages: response.data.data.totalPages,
        totalBooks: response.data.data.totalBooks
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);
