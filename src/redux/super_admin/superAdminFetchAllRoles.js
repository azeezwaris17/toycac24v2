// superAdminGetAllAdminsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  roles: [],
  loading: false,
  error: null,
};

export const fetchRoles = createAsyncThunk(
  "super_admin/fetchRoles",
  async () => {
    try {
      const response = await axios.get(
        "/api/super_admin/admins/fetch_admin_roles"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const superAdminFetchAllRoles = createSlice({
  name: "superAdminFetchAllRoles",
  initialState,
  reducers: {
    setRoleData(state, action) {
      state.roles = action.payload; // Simply set the roles array to the payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setRoleData } = superAdminFetchAllRoles.actions;

export default superAdminFetchAllRoles.reducer;
