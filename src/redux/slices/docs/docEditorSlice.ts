import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for document editor state
export interface EditorCursor {
  userId: string;
  username: string;
  position: number;
  color: string;
}

export interface EditorSelection {
  userId: string;
  start: number;
  end: number;
}

export interface DocumentEditorState {
  documentId: string | null;
  content: string;
  cursorPosition: number;
  cursors: EditorCursor[];
  selections: EditorSelection[];
  editMode: "edit" | "preview" | "split";
  fontSize: number;
  fontFamily: string;
  theme: "light" | "dark" | "solarized";
  autoSave: boolean;
  lastSavedContent: string;
  unsavedChanges: boolean;
  collaborativeEditing: boolean;
}

// Initial state
const initialState: DocumentEditorState = {
  documentId: null,
  content: "",
  cursorPosition: 0,
  cursors: [],
  selections: [],
  editMode: "edit",
  fontSize: 16,
  fontFamily: "Roboto Mono, monospace",
  theme: "light",
  autoSave: true,
  lastSavedContent: "",
  unsavedChanges: false,
  collaborativeEditing: false,
};

// Create the document editor slice
const docEditorSlice = createSlice({
  name: "docEditor",
  initialState,
  reducers: {
    // Open document for editing
    openDocument(
      state,
      action: PayloadAction<{
        documentId: string;
        content: string;
      }>
    ) {
      state.documentId = action.payload.documentId;
      state.content = action.payload.content;
      state.lastSavedContent = action.payload.content;
      state.unsavedChanges = false;
    },

    // Update document content
    updateContent(state, action: PayloadAction<string>) {
      state.content = action.payload;
      state.unsavedChanges = state.content !== state.lastSavedContent;
    },

    // Set cursor position
    setCursorPosition(state, action: PayloadAction<number>) {
      state.cursorPosition = action.payload;
    },

    // Add collaborative cursor
    addCollaborativeCursor(state, action: PayloadAction<EditorCursor>) {
      // Remove existing cursor for the same user
      state.cursors = state.cursors.filter(
        (cursor) => cursor.userId !== action.payload.userId
      );

      // Add new cursor
      state.cursors.push(action.payload);
    },

    // Remove collaborative cursor
    removeCollaborativeCursor(state, action: PayloadAction<string>) {
      state.cursors = state.cursors.filter(
        (cursor) => cursor.userId !== action.payload
      );
    },

    // Add collaborative selection
    addCollaborativeSelection(state, action: PayloadAction<EditorSelection>) {
      // Remove existing selection for the same user
      state.selections = state.selections.filter(
        (selection) => selection.userId !== action.payload.userId
      );

      // Add new selection
      state.selections.push(action.payload);
    },

    // Remove collaborative selection
    removeCollaborativeSelection(state, action: PayloadAction<string>) {
      state.selections = state.selections.filter(
        (selection) => selection.userId !== action.payload
      );
    },

    // Change edit mode
    setEditMode(state, action: PayloadAction<DocumentEditorState["editMode"]>) {
      state.editMode = action.payload;
    },

    // Update editor settings
    updateEditorSettings(
      state,
      action: PayloadAction<
        Partial<{
          fontSize: number;
          fontFamily: string;
          theme: DocumentEditorState["theme"];
          autoSave: boolean;
        }>
      >
    ) {
      return {
        ...state,
        ...action.payload,
      };
    },

    // Mark document as saved
    markAsSaved(state) {
      state.lastSavedContent = state.content;
      state.unsavedChanges = false;
    },

    // Toggle collaborative editing
    toggleCollaborativeEditing(state, action: PayloadAction<boolean>) {
      state.collaborativeEditing = action.payload;
    },

    // Reset editor state
    resetEditor() {
      return initialState;
    },
  },
});

// Export actions and reducer
export const {
  openDocument,
  updateContent,
  setCursorPosition,
  addCollaborativeCursor,
  removeCollaborativeCursor,
  addCollaborativeSelection,
  removeCollaborativeSelection,
  setEditMode,
  updateEditorSettings,
  markAsSaved,
  toggleCollaborativeEditing,
  resetEditor,
} = docEditorSlice.actions;

export default docEditorSlice.reducer;
