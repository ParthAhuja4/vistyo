import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allVideos: [],
  searchQuery: "",
  id: "",
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideosDispatch: (state, action) => {
      state.allVideos = action.payload.allVideos;
      state.searchQuery = action.payload.searchQuery;
      state.id = action.payload.id;
    },
    clearVideos: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setVideosDispatch, clearVideos } = videoSlice.actions;
export default videoSlice.reducer;
