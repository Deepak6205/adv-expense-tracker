// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  token: null,
  userId: null,
  user: null, // firebase user object or user info
  loading: true, // used while we check auth state on app start
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token || null;
      state.userId = action.payload.userId || null;
      state.user = action.payload.user || null;
      state.loading = false;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.userId = null;
      state.user = null;
      state.loading = false;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.userId = action.payload?.uid || null;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, setUser, setToken, setLoading } = authSlice.actions;
export default authSlice.reducer;
