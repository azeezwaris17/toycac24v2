// superAdminApproveAdminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  admins: [],
  loading: false,
  error: null,
};

export const approveAdmin = createAsyncThunk(
  "super_admin/approveAdmin",
  async (adminId) => {
    try {
      const response = await axios.put(`/api/super_admin/admins/${adminId}`);
      return response.data;
    } catch (error) {
      console.error("approveAdmin error:", error);
      throw error; // Rethrow the error to be handled in the Redux action
    }
  }
);

const superAdminApproveAdminSlice = createSlice({
  name: "superAdminApproveAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(approveAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Also, assuming action.payload contains the approved admin
        state.admins.push(action.payload);
      })
      .addCase(approveAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default superAdminApproveAdminSlice.reducer;
