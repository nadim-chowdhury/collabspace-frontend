import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for document history
export interface DocumentChange {
  id: string;
  type: "addition" | "deletion" | "modification";
  content: string;
  startIndex: number;
  endIndex: number;
  timestamp: string;
  userId: string;
  username: string;
}

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    username: string;
  };
  changes: DocumentChange[];
  snapshot?: string; // Optional full document snapshot
  fileUrl?: string; // Optional URL to full version file
}

export interface DocumentHistoryState {
  documentId: string | null;
  versions: DocumentVersion[];
  currentVersionIndex: number;
  maxVersions: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DocumentHistoryState = {
  documentId: null,
  versions: [],
  currentVersionIndex: -1,
  maxVersions: 50,
  loading: false,
  error: null,
};

// Create the document history slice
const docHistorySlice = createSlice({
  name: "docHistory",
  initialState,
  reducers: {
    // Initialize history for a document
    initializeDocumentHistory(
      state,
      action: PayloadAction<{
        documentId: string;
        initialVersion?: Omit<DocumentVersion, "id">;
      }>
    ) {
      state.documentId = action.payload.documentId;

      if (action.payload.initialVersion) {
        const newVersion: DocumentVersion = {
          id: `version-${Date.now()}`,
          ...action.payload.initialVersion,
        };

        state.versions = [newVersion];
        state.currentVersionIndex = 0;
      }
    },

    // Add new version
    addVersion(state, action: PayloadAction<Omit<DocumentVersion, "id">>) {
      // Ensure we don't exceed max versions
      if (state.versions.length >= state.maxVersions) {
        state.versions.shift(); // Remove oldest version
      }

      const newVersion: DocumentVersion = {
        id: `version-${Date.now()}`,
        ...action.payload,
      };

      state.versions.push(newVersion);
      state.currentVersionIndex = state.versions.length - 1;
    },

    // Restore to a specific version
    restoreVersion(state, action: PayloadAction<string>) {
      const versionIndex = state.versions.findIndex(
        (v) => v.id === action.payload
      );

      if (versionIndex !== -1) {
        state.currentVersionIndex = versionIndex;
      }
    },

    // Record document change
    recordChange(state, action: PayloadAction<Omit<DocumentChange, "id">>) {
      // If there are versions, add the change to the latest version
      if (state.versions.length > 0) {
        const latestVersion = state.versions[state.currentVersionIndex];

        const newChange: DocumentChange = {
          id: `change-${Date.now()}`,
          ...action.payload,
        };

        latestVersion.changes.push(newChange);
      }
    },

    // Set max versions
    setMaxVersions(state, action: PayloadAction<number>) {
      state.maxVersions = action.payload;

      // Trim versions if necessary
      if (state.versions.length > state.maxVersions) {
        state.versions = state.versions.slice(-state.maxVersions);
        state.currentVersionIndex = state.versions.length - 1;
      }
    },

    // Clear document history
    clearHistory(state) {
      state.versions = [];
      state.currentVersionIndex = -1;
    },

    // Start loading history
    fetchHistoryStart(state) {
      state.loading = true;
      state.error = null;
    },

    // Load history success
    fetchHistorySuccess(
      state,
      action: PayloadAction<{
        documentId: string;
        versions: DocumentVersion[];
      }>
    ) {
      state.documentId = action.payload.documentId;
      state.versions = action.payload.versions;
      state.currentVersionIndex = state.versions.length - 1;
      state.loading = false;
    },

    // Load history failure
    fetchHistoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  initializeDocumentHistory,
  addVersion,
  restoreVersion,
  recordChange,
  setMaxVersions,
  clearHistory,
  fetchHistoryStart,
  fetchHistorySuccess,
  fetchHistoryFailure,
} = docHistorySlice.actions;

export default docHistorySlice.reducer;
