import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for whiteboard-related entities
export interface WhiteboardElement {
  id: string;
  type: "rectangle" | "circle" | "line" | "text" | "freehand" | "image";
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  strokeWidth: number;
  rotation?: number;
  zIndex: number;
  content?: string; // For text or image URL
  points?: { x: number; y: number }[]; // For freehand drawing
}

export interface WhiteboardLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: WhiteboardElement[];
}

export interface Whiteboard {
  id: string;
  title: string;
  layers: WhiteboardLayer[];
  currentLayerId?: string;
  backgroundColor: string;
  gridEnabled: boolean;
  gridSize: number;
}

export interface WhiteboardState {
  boards: Whiteboard[];
  currentBoardId: string | null;
  tools: {
    currentTool:
      | "select"
      | "rectangle"
      | "circle"
      | "line"
      | "text"
      | "freehand";
    currentColor: string;
    strokeWidth: number;
  };
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: WhiteboardState = {
  boards: [],
  currentBoardId: null,
  tools: {
    currentTool: "select",
    currentColor: "#000000",
    strokeWidth: 2,
  },
  loading: false,
  error: null,
};

// Create the whiteboard slice
const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    // Create a new whiteboard
    createWhiteboard(state, action: PayloadAction<Omit<Whiteboard, "id">>) {
      const newBoard: Whiteboard = {
        id: `board-${Date.now()}`,
        ...action.payload,
      };
      state.boards.push(newBoard);
      state.currentBoardId = newBoard.id;
    },

    // Set current whiteboard
    setCurrentBoard(state, action: PayloadAction<string>) {
      state.currentBoardId = action.payload;
    },

    // Update whiteboard properties
    updateWhiteboard(
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<Whiteboard, "id" | "layers">>;
      }>
    ) {
      const boardIndex = state.boards.findIndex(
        (board) => board.id === action.payload.id
      );
      if (boardIndex !== -1) {
        state.boards[boardIndex] = {
          ...state.boards[boardIndex],
          ...action.payload.updates,
        };
      }
    },

    // Add a new layer to current board
    addLayer(state, action: PayloadAction<Omit<WhiteboardLayer, "id">>) {
      const currentBoard = state.boards.find(
        (board) => board.id === state.currentBoardId
      );
      if (currentBoard) {
        const newLayer: WhiteboardLayer = {
          id: `layer-${Date.now()}`,
          ...action.payload,
        };
        currentBoard.layers.push(newLayer);
        currentBoard.currentLayerId = newLayer.id;
      }
    },

    // Update layer properties
    updateLayer(
      state,
      action: PayloadAction<{
        boardId: string;
        layerId: string;
        updates: Partial<WhiteboardLayer>;
      }>
    ) {
      const boardIndex = state.boards.findIndex(
        (board) => board.id === action.payload.boardId
      );
      if (boardIndex !== -1) {
        const layerIndex = state.boards[boardIndex].layers.findIndex(
          (layer) => layer.id === action.payload.layerId
        );
        if (layerIndex !== -1) {
          state.boards[boardIndex].layers[layerIndex] = {
            ...state.boards[boardIndex].layers[layerIndex],
            ...action.payload.updates,
          };
        }
      }
    },

    // Add element to current layer
    addElement(
      state,
      action: PayloadAction<{
        boardId: string;
        layerId: string;
        element: Omit<WhiteboardElement, "id">;
      }>
    ) {
      const boardIndex = state.boards.findIndex(
        (board) => board.id === action.payload.boardId
      );
      if (boardIndex !== -1) {
        const layerIndex = state.boards[boardIndex].layers.findIndex(
          (layer) => layer.id === action.payload.layerId
        );
        if (layerIndex !== -1) {
          const newElement: WhiteboardElement = {
            id: `element-${Date.now()}`,
            ...action.payload.element,
          };
          state.boards[boardIndex].layers[layerIndex].elements.push(newElement);
        }
      }
    },

    // Update element properties
    updateElement(
      state,
      action: PayloadAction<{
        boardId: string;
        layerId: string;
        elementId: string;
        updates: Partial<WhiteboardElement>;
      }>
    ) {
      const boardIndex = state.boards.findIndex(
        (board) => board.id === action.payload.boardId
      );
      if (boardIndex !== -1) {
        const layerIndex = state.boards[boardIndex].layers.findIndex(
          (layer) => layer.id === action.payload.layerId
        );
        if (layerIndex !== -1) {
          const elementIndex = state.boards[boardIndex].layers[
            layerIndex
          ].elements.findIndex(
            (element) => element.id === action.payload.elementId
          );
          if (elementIndex !== -1) {
            state.boards[boardIndex].layers[layerIndex].elements[elementIndex] =
              {
                ...state.boards[boardIndex].layers[layerIndex].elements[
                  elementIndex
                ],
                ...action.payload.updates,
              };
          }
        }
      }
    },

    // Remove element
    removeElement(
      state,
      action: PayloadAction<{
        boardId: string;
        layerId: string;
        elementId: string;
      }>
    ) {
      const boardIndex = state.boards.findIndex(
        (board) => board.id === action.payload.boardId
      );
      if (boardIndex !== -1) {
        const layerIndex = state.boards[boardIndex].layers.findIndex(
          (layer) => layer.id === action.payload.layerId
        );
        if (layerIndex !== -1) {
          state.boards[boardIndex].layers[layerIndex].elements = state.boards[
            boardIndex
          ].layers[layerIndex].elements.filter(
            (element) => element.id !== action.payload.elementId
          );
        }
      }
    },

    // Update current tool
    setCurrentTool(
      state,
      action: PayloadAction<WhiteboardState["tools"]["currentTool"]>
    ) {
      state.tools.currentTool = action.payload;
    },

    // Update drawing color
    setCurrentColor(state, action: PayloadAction<string>) {
      state.tools.currentColor = action.payload;
    },

    // Update stroke width
    setStrokeWidth(state, action: PayloadAction<number>) {
      state.tools.strokeWidth = action.payload;
    },

    // Remove whiteboard
    removeWhiteboard(state, action: PayloadAction<string>) {
      state.boards = state.boards.filter(
        (board) => board.id !== action.payload
      );

      // Reset current board if it was the removed one
      if (state.currentBoardId === action.payload) {
        state.currentBoardId =
          state.boards.length > 0 ? state.boards[0].id : null;
      }
    },
  },
});

// Export actions and reducer
export const {
  createWhiteboard,
  setCurrentBoard,
  updateWhiteboard,
  addLayer,
  updateLayer,
  addElement,
  updateElement,
  removeElement,
  setCurrentTool,
  setCurrentColor,
  setStrokeWidth,
  removeWhiteboard,
} = whiteboardSlice.actions;

export default whiteboardSlice.reducer;
