import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser, getMe } from "./authThunks";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    role: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.role = null;

      state.successMessage = null;
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {});
    },
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, payload) => {
        state.loading = false;
        state.successMessage = payload.message;
      })
      .addCase(registerUser.rejected, (state, payload) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.role = action.payload.data.role;
        state.successMessage = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.role = action.payload.user.role;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.role = null;
        state.error = action.payload || "Not authenticated";
      });
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
