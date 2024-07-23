import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// verify email  action
export const verifyEmail = createAsyncThunk(
  "user/verifyEmail",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/user/verify-email", {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Reset password action
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/user/reset-password", {
        email,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userResetPasswordSlice = createSlice({
  name: "userResetPassword",
  initialState: {
    user: null,
    status: "idle",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder


      // verify email to reset password
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
      })

      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export default userResetPasswordSlice.reducer;
