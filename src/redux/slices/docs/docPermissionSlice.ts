import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for document permissions
export interface DocPermission {
  userId: string;
  role: "owner" | "editor" | "viewer";
}

export interface DocPermissionState {
  permissions: DocPermission[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DocPermissionState = {
  permissions: [],
  loading: false,
  error: null,
};

// Create the slice
const docPermissionSlice = createSlice({
  name: "docPermission",
  initialState,
  reducers: {
    // Action to set document permissions
    setDocPermissions: (state, action: PayloadAction<DocPermission[]>) => {
      state.permissions = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Action to add a new permission
    addDocPermission: (state, action: PayloadAction<DocPermission>) => {
      const existingPermissionIndex = state.permissions.findIndex(
        (p) => p.userId === action.payload.userId
      );

      if (existingPermissionIndex !== -1) {
        // Update existing permission
        state.permissions[existingPermissionIndex] = action.payload;
      } else {
        // Add new permission
        state.permissions.push(action.payload);
      }
    },

    // Action to remove a permission
    removeDocPermission: (state, action: PayloadAction<string>) => {
      state.permissions = state.permissions.filter(
        (p) => p.userId !== action.payload
      );
    },

    // Action to start loading
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Action to set error
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Action to clear permissions
    clearDocPermissions: (state) => {
      state.permissions = [];
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions
export const {
  setDocPermissions,
  addDocPermission,
  removeDocPermission,
  startLoading,
  setError,
  clearDocPermissions,
} = docPermissionSlice.actions;

// Export reducer
export default docPermissionSlice.reducer;
