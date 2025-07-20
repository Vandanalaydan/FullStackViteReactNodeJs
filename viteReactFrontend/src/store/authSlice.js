// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
 
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
