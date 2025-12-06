import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk(
  "category/fetchCategory",
  async (_, thunkAPI) => {
    try {
      console.log(import.meta.env.VITE_BACKEND_URL);
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/category`
      );
      return {
        categories: response.data.data,
        message: response.data.message || ""
      };
    } catch (error) {
      console.log("err", error);

      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
