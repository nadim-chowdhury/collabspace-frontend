import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for collaborator-related entities
export interface Collaborator {
  id: string;
  userId: string;
  username: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  joinedAt: string;
  status: "active" | "pending" | "invited" | "blocked";
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
    invite: boolean;
  };
}

export interface CollaboratorsState {
  collaborators: Collaborator[];
  invitations: Collaborator[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CollaboratorsState = {
  collaborators: [],
  invitations: [],
  loading: false,
  error: null,
};

// Create the collaborators slice
const collaboratorsSlice = createSlice({
  name: "collaborators",
  initialState,
  reducers: {
    // Fetch collaborators
    fetchCollaboratorsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCollaboratorsSuccess(state, action: PayloadAction<Collaborator[]>) {
      state.collaborators = action.payload;
      state.loading = false;
    },
    fetchCollaboratorsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Add collaborator
    addCollaborator(state, action: PayloadAction<Collaborator>) {
      state.collaborators.push(action.payload);
    },

    // Update collaborator
    updateCollaborator(state, action: PayloadAction<Collaborator>) {
      const index = state.collaborators.findIndex(
        (collab) => collab.id === action.payload.id
      );
      if (index !== -1) {
        state.collaborators[index] = action.payload;
      }
    },

    // Remove collaborator
    removeCollaborator(state, action: PayloadAction<string>) {
      state.collaborators = state.collaborators.filter(
        (collab) => collab.id !== action.payload
      );
    },

    // Manage invitations
    sendInvitation(state, action: PayloadAction<Collaborator>) {
      state.invitations.push(action.payload);
    },

    cancelInvitation(state, action: PayloadAction<string>) {
      state.invitations = state.invitations.filter(
        (invite) => invite.id !== action.payload
      );
    },

    // Change collaborator role
    changeCollaboratorRole(
      state,
      action: PayloadAction<{ id: string; role: Collaborator["role"] }>
    ) {
      const collaborator = state.collaborators.find(
        (collab) => collab.id === action.payload.id
      );
      if (collaborator) {
        collaborator.role = action.payload.role;
      }
    },
  },
});

// Export actions and reducer
export const {
  fetchCollaboratorsStart,
  fetchCollaboratorsSuccess,
  fetchCollaboratorsFailure,
  addCollaborator,
  updateCollaborator,
  removeCollaborator,
  sendInvitation,
  cancelInvitation,
  changeCollaboratorRole,
} = collaboratorsSlice.actions;

export default collaboratorsSlice.reducer;
