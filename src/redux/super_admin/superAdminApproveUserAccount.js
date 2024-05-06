import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const approveUser = createAsyncThunk(
  "super_admin/approveUser",
  async (userId) => {
    try {
      const response = await axios.put(`/api/super_admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("approveUser error:", error);
      throw error; // Rethrow the error to be handled in the Redux action
    }
  }
);

const superAdminApproveUserSlice = createSlice({
  name: "approveUser",
  initialState,
  reducers: {
    // Removed the approveUserSuccess reducer as it is not used
  },
  extraReducers: (builder) => {
    builder
      .addCase(approveUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        state.loading = false;
        // No need to set state.approvedUser here as it's not used
        // Also, assuming action.payload contains the approved user
        state.users.push(action.payload);
      })
      .addCase(approveUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default superAdminApproveUserSlice.reducer;
