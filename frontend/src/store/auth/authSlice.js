import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authThunks";

// Load persisted state from localStorage
const token = localStorage.getItem("token");
const userId = localStorage.getItem("id");
const role = localStorage.getItem("role");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: !!token,
    role: role || 'user',
    userId: userId || null,
    token: token || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.role = null;
      state.userId = null;
      state.token = null;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("role");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userId = payload.userId;
        state.token = payload.token;
        state.role = payload.role;

        // Store to localStorage
        localStorage.setItem("token", payload.token);
        localStorage.setItem("id", payload.userId);
        localStorage.setItem("role", payload.role);
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isLoggedIn = true;
        console.log("log for slice",payload)
        state.userId = payload.userId;
        state.token = payload.token;
        state.role = payload.role;

        // Store to localStorage
        localStorage.setItem("token", payload.token);
        localStorage.setItem("id", payload.userId);
        localStorage.setItem("role", payload.role);
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
