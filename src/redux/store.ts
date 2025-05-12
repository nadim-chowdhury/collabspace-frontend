import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import all reducers
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

// Import middleware
import { apiMiddleware } from "@/middlewares/api";
import logger from "@/middlewares/logger";
import socketMiddleware from "@/middlewares/socket";

// Persist configuration for key reducers
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated"],
};

const themePersistConfig = {
  key: "theme",
  storage,
  whitelist: ["mode", "primaryColor"],
};

// Root reducer configuration
const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  board: boardReducer,
  calendar: calendarReducer,
  chat: chatReducer,
  collaborators: collaboratorsReducer,
  notifications: notificationsReducer,
  search: searchReducer,
  theme: persistReducer(themePersistConfig, themeReducer),
  video: videoReducer,
  whiteboard: whiteboardReducer,
  ui: uiReducer,
  doc: docReducer,
  docEditor: docEditorReducer,
  docHistory: docHistoryReducer,
  docPermission: docPermissionReducer,
};

// Create store with enhanced configuration
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiMiddleware, socketMiddleware(), logger),

  // Enable Redux DevTools Extension
  devTools: process.env.NODE_ENV !== "production",
});

// Create persistor
export const persistor = persistStore(store);

// TypeScript types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for using Redux
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => selector(store.getState());
