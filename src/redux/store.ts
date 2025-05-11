import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import boardReducer from "./slices/boardSlice";
import chatReducer from "./slices/chatSlice";
import docReducer from "./slices/docSlice";
import themeReducer from "./slices/themeSlice";
import videoReducer from "./slices/videoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    chat: chatReducer,
    doc: docReducer,
    theme: themeReducer,
    video: videoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
