import { createSlice } from "@reduxjs/toolkit";

const docSlice = createSlice({
  name: "doc",
  initialState: { content: "" },
  reducers: {
    setContent(state, action) {
      state.content = action.payload;
    },
  },
});

export const { setContent } = docSlice.actions;
export default docSlice.reducer;
