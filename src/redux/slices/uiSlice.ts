import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  commandPalette: {
    isOpen: false,
    query: "",
  },
  // Add other UI state here (modals, drawers, etc.)
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCommandPalette: (state) => {
      state.commandPalette.isOpen = true;
    },
    closeCommandPalette: (state) => {
      state.commandPalette.isOpen = false;
      state.commandPalette.query = "";
    },
    setCommandQuery: (state, action) => {
      state.commandPalette.query = action.payload;
    },
  },
});

export const { openCommandPalette, closeCommandPalette, setCommandQuery } =
  uiSlice.actions;
export default uiSlice.reducer;
