import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async ({ page = 1, limit = 8 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/books/get-all-books?page=${page}&limit=${limit}`
      );
      
      return {
        books: response.data.data.books,           // 🟡 FIX: response nesting
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
