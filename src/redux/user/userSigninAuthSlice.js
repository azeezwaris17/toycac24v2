// Import necessary libraries
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the async thunk for user signin
export const signinUserAccount = createAsyncThunk(
  "auth/signinUserAccount",
  async (formData) => {
    try {
      // Send POST request to signin user
      const response = await axios.post("/api/user/signin", formData);
      return response.data; // Return data upon successful signin
    } catch (error) {
      // Extract status code and message from the error response
      const { status, data } = error.response;
      return { success: false, error: { status, data: data.message } }; // Return error response data
    }
  }
);

// Define the initial state
const initialState = {
  user: null, // Holds user data once logged in
  loading: false, // Indicates if API request is in progress
  error: null, // Holds error message if API request fails
};

// Create the auth slice
const userSigninAuthSlice = createSlice({
  name: "userSigninAuth", // Name of the slice
  initialState, // Initial state defined above
  reducers: {}, // No additional reducers defined
  extraReducers: (builder) => {
    builder
      .addCase(signinUserAccount.pending, (state) => {
        // Action dispatched when signin is pending
        state.loading = true; // Set loading state to true
        state.error = null; // Clear any previous error messages
      })
      .addCase(signinUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        // Check if signin was successful
        if (action.payload.success) {
          // Handle successful signin
          state.user = action.payload; // Update user state with payload data
        } else {
          // Handle unsuccessful signin
          state.error = action.payload.error; // Set error to the error message
        }
      })
      .addCase(signinUserAccount.rejected, (state, action) => {
        // Action dispatched when signin is rejected (failed)
        state.loading = false; // Set loading state to false
        state.error = action.payload.error; // Set error to the error message
      });
  },
});

export default userSigninAuthSlice.reducer; // Export the reducer function
