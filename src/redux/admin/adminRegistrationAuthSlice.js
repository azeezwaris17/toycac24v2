// Import necessary libraries
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  admin: null, // Holds admin data once created
  loading: false, // Indicates if API request is in progress
  error: null, // Holds error message if API request fails
};

// Define the async thunk for creating super admin account
export const createAdminAccount = createAsyncThunk(
  "auth/admin/create_account",
  async (adminAccountData) => {
    try {
      // Send POST request to create super admin account
      const response = await axios.post(
        "/api/admin/create_account",
        adminAccountData
      );
      return response.data; // Return data upon successful creation
    } catch (error) {
      // Extract status code and message from the error response
      const { status, data } = error.response;
      return { success: false, error: { status, data } }; // Return error response data
    }
  }
);

// Create the auth slice
const adminRegistrationAuthSlice = createSlice({
  name: "adminRegistrationAuth", // Name of the slice
  initialState, // Initial state defined above
  reducers: {}, // No additional reducers defined
  extraReducers: (builder) => {
    builder
      .addCase(createAdminAccount.pending, (state) => {
        // Action dispatched when creation is pending
        state.loading = true; // Set loading state to true
        state.error = null; // Clear any previous error messages
      })
      .addCase(createAdminAccount.fulfilled, (state, action) => {
        state.loading = false;
        // Check if creation was successful
        if (action.payload.success) {
          // Handle successful creation
          state.admin = action.payload; // Store admin data returned by the API
        } else {
          // Handle unsuccessful creation
          state.error = action.payload.error; // Set error to the entire payload
        }
      })
      .addCase(createAdminAccount.rejected, (state, action) => {
        // Action dispatched when creation is rejected (failed)
        state.loading = false; // Set loading state to false
        state.error = action.error.message; // Store the error message returned by the API
      });
  },
});

export default adminRegistrationAuthSlice.reducer; // Export the reducer function
