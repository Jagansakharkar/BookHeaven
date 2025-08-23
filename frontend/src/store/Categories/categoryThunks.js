// src/store/categories/categoryThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk(
  "category/fetchCategory",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const { token } = state.auth;

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      return {
        categories: response.data.data,
        message: response.data.message || ""
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
