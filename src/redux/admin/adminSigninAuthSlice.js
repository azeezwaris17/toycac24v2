// Import necessary libraries
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the async thunk for super admin signin
export const signinAdminAccount = createAsyncThunk(
  "admin/signin",
  async (formData) => {
    try {
      const response = await axios.post("/api/admin/signin", formData);
      return response.data; // Return the entire response data
    } catch (error) {
      // Check if error.response exists before extracting data
      if (error.response) {
        const { status, data } = error.response;
        return { success: false, error: { status, data } }; // Return error response data
      } else {
        // If no response, return generic error
        return {
          success: false,
          error: { status: 500, data: "Internal Server Error" },
        };
      }
    }
  }
);

// Create the super admin signin auth slice
const adminSigninAuthSlice = createSlice({
  name: "adminSigninAuth",
  initialState: {
    loading: false,
    error: null,
    admin: null, // Holds admin data once signed in
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signinAdminAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinAdminAccount.fulfilled, (state, action) => {
        state.loading = false;
        // Check if signin was successful
        if (action.payload.success) {
          // Handle successful signin
          state.admin = action.payload; // Store super admin data returned by the API
        } else {
          // Handle unsuccessful signin
          state.error = action.payload.error; // Set error to the entire payload
        }
      })
      .addCase(signinAdminAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error; // Set error to the entire payload
      });
  },
});

export default adminSigninAuthSlice.reducer; // Export the reducer function
