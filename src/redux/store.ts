import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import boardReducer from "./slices/boardSlice";
import calendarReducer from "./slices/calendarSlice";
import chatReducer from "./slices/chatSlice";
import collaboratorsReducer from "./slices/collaboratorsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import searchReducer from "./slices/searchSlice";
import themeReducer from "./slices/themeSlice";
import videoReducer from "./slices/videoSlice";
import whiteboardReducer from "./slices/whiteboardSlice";
import uiReducer from "./slices/uiSlice";
import docReducer from "./slices/docs/docSlice";
import docEditorReducer from "./slices/docs/docEditorSlice";
import docHistoryReducer from "./slices/docs/docHistorySlice";
import docPermissionReducer from "./slices/docs/docPermissionSlice";

import { apiMiddleware } from "./middleware/api";
import logger from "./middleware/logger";
import socketMiddleware from "./middleware/socket";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    calendar: calendarReducer,
    chat: chatReducer,
    collaborators: collaboratorsReducer,
    notifications: notificationsReducer,
    search: searchReducer,
    theme: themeReducer,
    video: videoReducer,
    whiteboard: whiteboardReducer,
    ui: uiReducer,
    doc: docReducer,
    docEditor: docEditorReducer,
    docHistory: docHistoryReducer,
    docPermission: docPermissionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddleware, socketMiddleware(), logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
