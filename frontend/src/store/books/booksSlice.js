// store/books/booksSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchBooks } from './authBooks';

const initialState = {
  books: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    clearSearchResults(state) {
      state.searchResults = [];

    },
  },
  extraReducers: (builder) => {
    builder
      // existing fetchBooks cases...
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.totalPages=action.payload.totalPages,
        state.currentPage=action.payload.currentPage
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.books = [];
      });
  },
});

export const { setPage, clearSearchResults } = bookSlice.actions;
export default bookSlice.reducer;
