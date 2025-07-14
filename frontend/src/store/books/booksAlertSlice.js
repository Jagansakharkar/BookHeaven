import { createSlice } from "@reduxjs/toolkit";
import { fetchAlertBooks } from './booksAlertThunks';

const bookAlertSlice = createSlice({
  name: "bookalert",
  initialState: {
    lowStockBooks: [],
    outofStockBooks: [],
    loading: false,
    error: null,
    message: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlertBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlertBooks.fulfilled, (state, action) => {
        state.lowStockBooks = action.payload.lowStockBooks;
        state.outofStockBooks = action.payload.outOfStock;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAlertBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = "Error occurred";
        state.message = action.payload.message || "Failed to fetch alert books";
      });
  }
});

export default bookAlertSlice.reducer;

