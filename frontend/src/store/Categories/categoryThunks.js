// src/store/categories/categoryThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk(
  "category/fetchCategory",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const { token, userid } = state.auth;

      const response = await axios.get('http://localhost:3000/api/category/get-all-categories', {
        headers: {
          Authorization: `Bearer ${token}`,
          userid
        }
      });
      console.log(response.data.data)
      return {
        categories: response.data.data,
        message: response.data.message || ""
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
