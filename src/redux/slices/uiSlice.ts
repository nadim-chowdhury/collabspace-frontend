import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define modal interface
export interface Modal {
  id: string;
  type: string;
  props?: Record<string, any>;
}

// Define sidebar interface
export interface Sidebar {
  id: string;
  isOpen: boolean;
  width?: number;
  position: "left" | "right";
}

// Define toast interface
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

// Define UI state interface
export interface UIState {
  modals: Modal[];
  sidebars: Sidebar[];
  toasts: Toast[];
  globalLoading: boolean;
  fullScreenMode: boolean;
  activeContextMenu: {
    id: string | null;
    x: number;
    y: number;
  };
  dragAndDrop: {
    isDragging: boolean;
    draggedItem: any;
  };
}

// Initial state
const initialState: UIState = {
  modals: [],
  sidebars: [],
  toasts: [],
  globalLoading: false,
  fullScreenMode: false,
  activeContextMenu: {
    id: null,
    x: 0,
    y: 0,
  },
  dragAndDrop: {
    isDragging: false,
    draggedItem: null,
  },
};

// Create the UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Modal management
    openModal(state, action: PayloadAction<Omit<Modal, "id">>) {
      const newModal: Modal = {
        id: `modal-${Date.now()}`,
        ...action.payload,
      };
      state.modals.push(newModal);
    },

    closeModal(state, action: PayloadAction<string>) {
      state.modals = state.modals.filter(
        (modal) => modal.id !== action.payload
      );
    },

    closeAllModals(state) {
      state.modals = [];
    },

    // Sidebar management
    openSidebar(state, action: PayloadAction<Omit<Sidebar, "id">>) {
      const newSidebar: Sidebar = {
        id: `sidebar-${Date.now()}`,
        ...action.payload,
      };
      state.sidebars.push(newSidebar);
    },

    closeSidebar(state, action: PayloadAction<string>) {
      state.sidebars = state.sidebars.filter(
        (sidebar) => sidebar.id !== action.payload
      );
    },

    toggleSidebar(state, action: PayloadAction<string>) {
      const sidebar = state.sidebars.find((s) => s.id === action.payload);
      if (sidebar) {
        sidebar.isOpen = !sidebar.isOpen;
      }
    },

    // Toast management
    addToast(state, action: PayloadAction<Omit<Toast, "id">>) {
      const newToast: Toast = {
        id: `toast-${Date.now()}`,
        ...action.payload,
        duration: action.payload.duration || 3000,
      };
      state.toasts.push(newToast);
    },

    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },

    // Global loading
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },

    // Full screen mode
    toggleFullScreenMode(state) {
      state.fullScreenMode = !state.fullScreenMode;
    },

    // Context menu
    openContextMenu(
      state,
      action: PayloadAction<{ id: string; x: number; y: number }>
    ) {
      state.activeContextMenu = {
        id: action.payload.id,
        x: action.payload.x,
        y: action.payload.y,
      };
    },

    closeContextMenu(state) {
      state.activeContextMenu = {
        id: null,
        x: 0,
        y: 0,
      };
    },

    // Drag and drop
    startDragging(state, action: PayloadAction<any>) {
      state.dragAndDrop = {
        isDragging: true,
        draggedItem: action.payload,
      };
    },

    stopDragging(state) {
      state.dragAndDrop = {
        isDragging: false,
        draggedItem: null,
      };
    },
  },
});

// Export actions and reducer
export const {
  // Modal actions
  openModal,
  closeModal,
  closeAllModals,

  // Sidebar actions
  openSidebar,
  closeSidebar,
  toggleSidebar,

  // Toast actions
  addToast,
  removeToast,

  // Global loading
  setGlobalLoading,

  // Full screen mode
  toggleFullScreenMode,

  // Context menu
  openContextMenu,
  closeContextMenu,

  // Drag and drop
  startDragging,
  stopDragging,
} = uiSlice.actions;

export default uiSlice.reducer;
