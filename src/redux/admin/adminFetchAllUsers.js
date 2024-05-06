import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  try {
    const response = await axios.get(
      "/api/admin/users/get_all_registered_users"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});

const adminFetchAllUsers = createSlice({
  name: "adminFetchAllUsers",
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

export const { setUsersData } = adminFetchAllUsers.actions;

export default adminFetchAllUsers.reducer;
