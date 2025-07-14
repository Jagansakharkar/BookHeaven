import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authThunks";

// Load persisted state from localStorage
const token = localStorage.getItem("token");
const userid = localStorage.getItem("id");
const role = localStorage.getItem("role");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: !!token,
    role: role || null,
    userid: userid || null,
    token: token || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.role = null;
      state.userid = null;
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
        state.userid = payload.userid;
        state.token = payload.token;
        state.role = payload.role;

        // Store to localStorage
        localStorage.setItem("token", payload.token);
        localStorage.setItem("id", payload.userid);
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
        state.userid = payload.userid;
        state.token = payload.token;
        state.role = payload.role;

        // Store to localStorage
        localStorage.setItem("token", payload.token);
        localStorage.setItem("id", payload.userid);
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
