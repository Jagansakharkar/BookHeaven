import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Register User Thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/sign-up",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, userid } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("id", userid);

      return {
        token,
        userid,
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
        "http://localhost:3000/api/auth/login",
        credentials,
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, userid, role } = response.data;
      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("id", userid);
      localStorage.setItem("role", role)

      // Return structured payload
      return {
        token,
        userid,
        role,
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
