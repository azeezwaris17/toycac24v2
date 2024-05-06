// Import necessary libraries
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  superAdmin: null, // Holds super admin data once created
  loading: false, // Indicates if API request is in progress
  error: null, // Holds error message if API request fails
};

// Define the async thunk for super admin signin
export const signinSuperAdminAccount = createAsyncThunk(
  "superAdmin/signin",
  async (formData) => {
    try {
      const response = await axios.post("/api/super_admin/signin", formData);
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
const superAdminSigninAuthSlice = createSlice({
  name: "superAdminSigninAuth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signinSuperAdminAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinSuperAdminAccount.fulfilled, (state, action) => {
        state.loading = false;
        // Check if signin was successful
        if (action.payload.success) {
          // Handle successful signin
          state.superAdmin = action.payload; // Store super admin data returned by the API
        } else {
          // Handle unsuccessful signin
          state.error = action.payload.error; // Set error to the entire payload
        }
      })
      .addCase(signinSuperAdminAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error; // Set error to the entire payload
      });
  },
});

export default superAdminSigninAuthSlice.reducer; // Export the reducer function
