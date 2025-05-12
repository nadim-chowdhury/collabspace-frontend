import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for document-related entities
export interface DocumentUser {
  id: string;
  username: string;
  email: string;
  role: "owner" | "editor" | "viewer";
}

export interface DocumentComment {
  id: string;
  content: string;
  authorId: string;
  timestamp: string;
  resolved: boolean;
  threadId?: string;
  position?: {
    pageNumber: number;
    x: number;
    y: number;
  };
}

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  fileUrl: string;
  changelog?: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  content: string;
  type: "text" | "markdown" | "rich" | "code";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canShare: boolean;
  };
  collaborators: DocumentUser[];
  comments: DocumentComment[];
  versions: DocumentVersion[];
  tags?: string[];
  status: "draft" | "in-review" | "published" | "archived";
}

export interface DocumentState {
  documents: Document[];
  currentDocumentId: string | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    status?: Document["status"];
    tags?: string[];
    createdBy?: string;
  };
}

// Initial state
const initialState: DocumentState = {
  documents: [],
  currentDocumentId: null,
  loading: false,
  error: null,
  searchQuery: "",
  filters: {},
};

// Create the document slice
const docSlice = createSlice({
  name: "doc",
  initialState,
  reducers: {
    // Fetch documents
    fetchDocumentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDocumentsSuccess(state, action: PayloadAction<Document[]>) {
      state.documents = action.payload;
      state.loading = false;
    },
    fetchDocumentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Create new document
    createDocument(
      state,
      action: PayloadAction<Omit<Document, "id" | "createdAt" | "updatedAt">>
    ) {
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...action.payload,
      };
      state.documents.push(newDocument);
      state.currentDocumentId = newDocument.id;
    },

    // Set current document
    setCurrentDocument(state, action: PayloadAction<string>) {
      state.currentDocumentId = action.payload;
    },

    // Update document
    updateDocument(
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<Document, "id" | "createdAt">>;
      }>
    ) {
      const documentIndex = state.documents.findIndex(
        (doc) => doc.id === action.payload.id
      );
      if (documentIndex !== -1) {
        state.documents[documentIndex] = {
          ...state.documents[documentIndex],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };

        // Update current document if it's the same document
        if (state.currentDocumentId === action.payload.id) {
          state.documents[documentIndex] = {
            ...state.documents[documentIndex],
            updatedAt: new Date().toISOString(),
          };
        }
      }
    },

    // Delete document
    deleteDocument(state, action: PayloadAction<string>) {
      state.documents = state.documents.filter(
        (doc) => doc.id !== action.payload
      );

      // Clear current document if deleted
      if (state.currentDocumentId === action.payload) {
        state.currentDocumentId = null;
      }
    },

    // Add comment
    addComment(
      state,
      action: PayloadAction<{
        documentId: string;
        comment: Omit<DocumentComment, "id" | "timestamp">;
      }>
    ) {
      const documentIndex = state.documents.findIndex(
        (doc) => doc.id === action.payload.documentId
      );
      if (documentIndex !== -1) {
        const newComment: DocumentComment = {
          id: `comment-${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...action.payload.comment,
        };
        state.documents[documentIndex].comments.push(newComment);
      }
    },

    // Update comment
    updateComment(
      state,
      action: PayloadAction<{
        documentId: string;
        commentId: string;
        updates: Partial<DocumentComment>;
      }>
    ) {
      const documentIndex = state.documents.findIndex(
        (doc) => doc.id === action.payload.documentId
      );
      if (documentIndex !== -1) {
        const commentIndex = state.documents[documentIndex].comments.findIndex(
          (comment) => comment.id === action.payload.commentId
        );
        if (commentIndex !== -1) {
          state.documents[documentIndex].comments[commentIndex] = {
            ...state.documents[documentIndex].comments[commentIndex],
            ...action.payload.updates,
          };
        }
      }
    },

    // Add document version
    addDocumentVersion(
      state,
      action: PayloadAction<{
        documentId: string;
        version: Omit<DocumentVersion, "id">;
      }>
    ) {
      const documentIndex = state.documents.findIndex(
        (doc) => doc.id === action.payload.documentId
      );
      if (documentIndex !== -1) {
        const newVersion: DocumentVersion = {
          id: `version-${Date.now()}`,
          ...action.payload.version,
        };
        state.documents[documentIndex].versions.push(newVersion);
      }
    },

    // Set search query
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    // Set document filters
    setDocumentFilters(state, action: PayloadAction<DocumentState["filters"]>) {
      state.filters = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  fetchDocumentsStart,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  createDocument,
  setCurrentDocument,
  updateDocument,
  deleteDocument,
  addComment,
  updateComment,
  addDocumentVersion,
  setSearchQuery,
  setDocumentFilters,
} = docSlice.actions;

export default docSlice.reducer;
