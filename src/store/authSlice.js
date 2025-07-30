import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userId: null,
  email: null,
  plan: null,
  remainingSearches: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      Object.assign(state, action.payload);
    },
    logout(state) {
      Object.assign(state, initialState);
    },
    setRemainingSearch(state, action) {
      state.remainingSearches = action.payload;
    },
  },
});

export const { login, logout, setRemainingSearch } = authSlice.actions;
export default authSlice.reducer;
