// Import necessary libraries
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  superAdmin: null, // Holds super admin data once created
  loading: false, // Indicates if API request is in progress
  error: null, // Holds error message if API request fails
};

// Define the async thunk for creating super admin account
export const createSuperAdminAccount = createAsyncThunk(
  "auth/super_admin/create_account",
  async (superAdminAccountData) => {
    try {
      // Send POST request to create super admin account
      const response = await axios.post(
        "/api/super_admin/create_account",
        superAdminAccountData
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
const superAdminRegistrationAuthSlice = createSlice({
  name: "superAdminRegistrationAuth", // Name of the slice
  initialState, // Initial state defined above
  reducers: {}, // No additional reducers defined
  extraReducers: (builder) => {
    builder
      .addCase(createSuperAdminAccount.pending, (state) => {
        // Action dispatched when creation is pending
        state.loading = true; // Set loading state to true
        state.error = null; // Clear any previous error messages
      })
      .addCase(createSuperAdminAccount.fulfilled, (state, action) => {
        state.loading = false;
        // Check if creation was successful
        if (action.payload.success) {
          // Handle successful creation
          state.superAdmin = action.payload; // Store super admin data returned by the API
        } else {
          // Handle unsuccessful creation
          state.error = action.payload.error; // Set error to the entire payload
        }
      })
      .addCase(createSuperAdminAccount.rejected, (state, action) => {
        // Action dispatched when creation is rejected (failed)
        state.loading = false; // Set loading state to false
        state.error = action.error.message; // Store the error message returned by the API
      });
  },
});

export default superAdminRegistrationAuthSlice.reducer; // Export the reducer function
