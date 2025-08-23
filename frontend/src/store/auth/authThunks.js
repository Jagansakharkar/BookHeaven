import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Register User Thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/api/auth/sign-up`,
        userData,
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, userId, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("id", userId);
      localStorage.setItem('role', role)

      return {
        token,
        userId,
        role
      }
    } catch (error) {
      // Use error.response if available, otherwise generic message
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login User Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        credentials,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      const { token, userId, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("id", userId);
      localStorage.setItem("role", role);

      return { token: token, userId: userId, role: role };
    } catch (error) {
      const message = error.message || error.data?.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
