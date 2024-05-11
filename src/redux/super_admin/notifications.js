// redux/super_admin/notifications.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async () => {
    try {
      const response = await axios.get("/api/super_admin/notifications/notifications");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const sendNotification = createAsyncThunk(
  "notification/sendNotification",
  async ({ recipient, recipientType, message }) => {
    try {
      let payload = { message };

      // If recipientType is provided, add it to the payload
      if (recipientType) {
        payload = { ...payload, recipientType };
      } else {
        // If recipientType is not provided, assume recipient is a specific user/admin ID
        payload = { ...payload, recipient };
      }

      const response = await axios.post("/api/super_admin/notifications/notifications", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);


const notifications = createSlice({
  name: "superAdminNotifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications.push(action.payload);
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default notifications.reducer;
