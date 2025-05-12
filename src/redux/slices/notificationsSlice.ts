import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for notification-related entities
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  category: "system" | "user" | "collaboration" | "task" | "message";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLink?: string;
  relatedEntityId?: string;
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Create the notifications slice
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Fetch notifications
    fetchNotificationsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(
        (notification) => !notification.read
      ).length;
      state.loading = false;
    },
    fetchNotificationsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Add new notification
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },

    // Mark notification as read
    markNotificationAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },

    // Mark all notifications as read
    markAllNotificationsAsRead(state) {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },

    // Remove specific notification
    removeNotification(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );

      // Adjust unread count if removed notification was unread
      if (notification && !notification.read) {
        state.unreadCount -= 1;
      }
    },

    // Clear all notifications
    clearAllNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

// Export actions and reducer
export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearAllNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
