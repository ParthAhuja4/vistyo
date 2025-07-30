import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeRole: {},
  roles: [],
  roleKeywords: [],
  channelIds: [],
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRoles(state, action) {
      state.roles = action.payload;
    },
    setActiveRole(state, action) {
      state.activeRole = action.payload;
    },
    setRoleKeywords(state, action) {
      state.roleKeywords = action.payload;
    },
    setChannelIds: (state, action) => {
      state.channelIds = action.payload;
    },
  },
});

export const { setRoles, setActiveRole, setRoleKeywords, setChannelIds } =
  roleSlice.actions;
export default roleSlice.reducer;
