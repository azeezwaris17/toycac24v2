// superAdminApproveAdminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  admins: [],
  loading: false,
  error: null,
};

export const assignRole = createAsyncThunk(
  "super_admin/assignRole",
  async ({ adminId, roleId }) => {
    try {
      const response = await axios.put(
        `/api/super_admin/admins/assign_role/${adminId}`,
        { roleId } // Send roleId in the request body
      );
      return response.data;
    } catch (error) {
      console.error("Error assigning role to admin:", error);
      throw error; // Rethrow the error to be handled in the Redux action
    }
  }
);

const superAdminAssignRole = createSlice({
  name: "superAdminAssignRole",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(assignRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Modify the payload handling in the assignRole reducer
.addCase(assignRole.fulfilled, (state, action) => {
  state.loading = false;
  // Check the structure of payload and update state accordingly
  if (action.payload && action.payload.admin) {
    const updatedAdmin = action.payload.admin;
    state.admins = state.admins.map(admin =>
      admin._id === updatedAdmin._id ? updatedAdmin : admin
    );
  }
})
      .addCase(assignRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default superAdminAssignRole.reducer;
