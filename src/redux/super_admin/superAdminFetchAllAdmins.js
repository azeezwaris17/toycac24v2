// superAdminGetAllAdminsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  admins: [],
  loading: false,
  error: null,
};

export const fetchAdmins = createAsyncThunk(
  "super_admin/fetchAdmins",
  async () => {
    try {
      const response = await axios.get(
        "/api/super_admin/admins/get_all_registered_admins"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const superAdminFetchAllAdmins = createSlice({
  name: "superAdminFetchAllAdmins",
  initialState,
  reducers: {
    setAdminsData(state, action) {
      state.admins = action.payload; // Simply set the admins array to the payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setAdminsData } = superAdminFetchAllAdmins.actions;

export default superAdminFetchAllAdmins.reducer;
