import { createSlice } from "@reduxjs/toolkit";
import { fetchBooks } from "./authBooks";

const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    loading: false,
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    error: null,
  },
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    removeBook(state, action) {
      state.books = state.books.filter(book => book._id !== action.payload);
      state.totalBooks = state.totalBooks - 1;
      state.totalPages = Math.ceil(state.totalBooks / 8);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.totalBooks = action.payload.totalBooks;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, removeBook } = bookSlice.actions;
export default bookSlice.reducer;
