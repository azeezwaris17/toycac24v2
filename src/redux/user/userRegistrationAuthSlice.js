// Import necessary libraries
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  user: null, // Holds user data once registered
  loading: false, // Indicates if API request is in progress
  error: null, // Holds error message if API request fails
};

// Define the async thunk for user registration
export const registerUserAccount = createAsyncThunk(
  "auth/registerUserAccount",
  async (userData) => {
    try {
      // Send POST request to register user
      const response = await axios.post("/api/user/register", userData);
      return response.data; // Return data upon successful registration
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

// Create the auth slice
const userRegistrationAuthSlice = createSlice({
  name: "userRegistrationAuth", // Name of the slice
  initialState, // Initial state defined above
  reducers: {}, // No additional reducers defined
  extraReducers: (builder) => {
    builder
      .addCase(registerUserAccount.pending, (state) => {
        // Action dispatched when registration is pending
        state.loading = true; // Set loading state to true
        state.error = null; // Clear any previous error messages
      })
      .addCase(registerUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        // Check if registration was successful
        if (action.payload.success) {
          // Handle successful registration
          state.user = action.payload; // Store user data returned by the API
        } else {
          // Handle unsuccessful registration
          state.error = action.payload.error; // Set error to the entire payload
        }
      })
      .addCase(registerUserAccount.rejected, (state, action) => {
        // Action dispatched when registration is rejected (failed)
        state.loading = false; // Set loading state to false
        state.error = action.payload.error.data.message; // Store the error message returned by the API
      });
  },
});

export default userRegistrationAuthSlice.reducer; // Export the reducer function
