import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  user: null, // Holds user data once registered
  loading: false, // Indicates if API request is in progress
  error: null, // Holds error message if API request fails
  // requestConfig: {
  //   method: "POST", // Default HTTP method
  //   // Add any other default properties you need
  // },
};

// export const setRequestConfig = createAction('auth/setRequestConfig', (config) => ({
//   payload: config,
// }));

export const registerUserAccount = createAsyncThunk(
  "auth/registerUserAccount",
  async ({ formDataToSend, requestConfig }) => {
    // const { method } = getState().auth.requestConfig || { method: "POST" };
    // console.log("Request method:", method);
    try {
      const response = await axios.request({
        url: "/api/user/register",
        method: requestConfig.method,
        data: formDataToSend,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        return { success: false, error: { status, data } };
      } else {
        return {
          success: false,
          error: { status: 500, data: "Internal Server Error" },
        };
      }
    }
  }
);

const userRegistrationAuthSlice = createSlice({
  name: "userRegistrationAuth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // .addCase(setRequestConfig, (state, action) => {
    //   state.loading = false;
    //   if (action.payload.success) {
    //     state.requestConfig = action.payload;
    //   } else {
    //     state.error = action.payload.error;
    //   }
     
    // })
      .addCase(registerUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = action.payload;
        } else {
          state.error = action.payload.error;
        }
      })
    
      .addCase(registerUserAccount.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.error && action.payload.error.data) {
          state.error = action.payload.error.data.message;
        } else if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = "Failed to register user.";
        }
      });
  },
});

export default userRegistrationAuthSlice.reducer;
