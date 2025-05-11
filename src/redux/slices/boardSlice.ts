import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
  name: "board",
  initialState: { columns: {} },
  reducers: {
    setColumns(state, action) {
      state.columns = action.payload;
    },
  },
});

export const { setColumns } = boardSlice.actions;
export default boardSlice.reducer;
