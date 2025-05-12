import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for chat-related entities
export interface ChatUser {
  id: string;
  username: string;
  avatar?: string;
  online: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file";
  status: "sent" | "delivered" | "read" | "failed";
  attachments?: {
    url: string;
    type: string;
    name: string;
  }[];
}

export interface ChatConversation {
  id: string;
  participants: string[];
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export interface ChatState {
  conversations: ChatConversation[];
  currentConversationId: string | null;
  users: ChatUser[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  users: [],
  loading: false,
  error: null,
};

// Create the chat slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Fetch conversations
    fetchConversationsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchConversationsSuccess(
      state,
      action: PayloadAction<ChatConversation[]>
    ) {
      state.conversations = action.payload;
      state.loading = false;
    },
    fetchConversationsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Set current conversation
    setCurrentConversation(state, action: PayloadAction<string>) {
      state.currentConversationId = action.payload;
    },

    // Add new conversation
    addConversation(state, action: PayloadAction<ChatConversation>) {
      state.conversations.push(action.payload);
    },

    // Add message to conversation
    addMessage(
      state,
      action: PayloadAction<{ conversationId: string; message: ChatMessage }>
    ) {
      const conversation = state.conversations.find(
        (conv) => conv.id === action.payload.conversationId
      );
      if (conversation) {
        conversation.messages.push(action.payload.message);
        conversation.lastMessage = action.payload.message;
        conversation.unreadCount += 1;
      }
    },

    // Mark conversation as read
    markConversationRead(state, action: PayloadAction<string>) {
      const conversation = state.conversations.find(
        (conv) => conv.id === action.payload
      );
      if (conversation) {
        conversation.unreadCount = 0;

        // Update message statuses to 'read'
        conversation.messages.forEach((message) => {
          if (message.status !== "read") {
            message.status = "read";
          }
        });
      }
    },

    // Update user online status
    updateUserStatus(
      state,
      action: PayloadAction<{ userId: string; online: boolean }>
    ) {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user) {
        user.online = action.payload.online;
      }
    },

    // Remove conversation
    removeConversation(state, action: PayloadAction<string>) {
      state.conversations = state.conversations.filter(
        (conv) => conv.id !== action.payload
      );

      // Clear current conversation if it was the removed one
      if (state.currentConversationId === action.payload) {
        state.currentConversationId = null;
      }
    },
  },
});

// Export actions and reducer
export const {
  fetchConversationsStart,
  fetchConversationsSuccess,
  fetchConversationsFailure,
  setCurrentConversation,
  addConversation,
  addMessage,
  markConversationRead,
  updateUserStatus,
  removeConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
