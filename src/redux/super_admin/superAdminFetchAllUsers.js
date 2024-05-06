import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "super_admin/fetchUsers",
  async () => {
    try {
      const response = await axios.get(
        "/api/super_admin/users/get_all_registered_users"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const superAdminFetchAllUsers = createSlice({
  name: "superAdminFetchAllUsers",
  initialState,
  reducers: {
    setUsersData(state, action) {
      state.users = action.payload; // Simply set the users array to the payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUsersData } = superAdminFetchAllUsers.actions;

export default superAdminFetchAllUsers.reducer;
