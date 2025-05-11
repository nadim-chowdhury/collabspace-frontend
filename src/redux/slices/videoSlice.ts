import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: { status: "idle" },
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setStatus } = videoSlice.actions;
export default videoSlice.reducer;
