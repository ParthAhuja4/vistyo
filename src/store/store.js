import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import rolesReducer from "./roleSlice.js";
import videoReducer from "./videoSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: rolesReducer,
    video: videoReducer,
  },
});

export default store;
