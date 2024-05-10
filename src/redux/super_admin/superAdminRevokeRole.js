import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  admins: [],
  loading: false,
  error: null,
};

export const revokeRole = createAsyncThunk(
  "super_admin/revokeRole",
  async (adminId) => {
    try {
      const response = await axios.put(`/api/super_admin/admins/revoke_role/${adminId}`);
      return response.data.admin; // Return only the updated admin data
    } catch (error) {
      console.error("Error revoking role from admin:", error);
      throw error;
    }
  }
);


const superAdminRevokeRole = createSlice({
  name: "superAdminRevokeRole",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(revokeRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revokeRole.fulfilled, (state, action) => {
        state.loading = false;
        // Find the index of the admin in the state by adminId
        const index = state.admins.findIndex((admin) => admin._id === action.payload._id);
        if (index !== -1) {
          // If found, update the admin at that index
          state.admins[index] = action.payload;
        }
      })
      .addCase(revokeRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default superAdminRevokeRole.reducer;
