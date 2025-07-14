// src/store/categories/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchCategories } from './categoryThunks';

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
    message: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories = [];
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default categorySlice.reducer;
