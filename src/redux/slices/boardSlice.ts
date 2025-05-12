import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for board-related entities
export interface BoardMember {
  id: string;
  username: string;
  role: "owner" | "admin" | "member" | "viewer";
}

export interface BoardTask {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "done";
  assignedTo?: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  members: BoardMember[];
  tasks: BoardTask[];
  createdAt: string;
  updatedAt: string;
}

// Define the board state interface
export interface BoardState {
  currentBoard: Board | null;
  boards: Board[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: BoardState = {
  currentBoard: null,
  boards: [],
  loading: false,
  error: null,
};

// Create the board slice
const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    // Fetch boards
    fetchBoardsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBoardsSuccess(state, action: PayloadAction<Board[]>) {
      state.boards = action.payload;
      state.loading = false;
    },
    fetchBoardsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Set current board
    setCurrentBoard(state, action: PayloadAction<Board>) {
      state.currentBoard = action.payload;
    },

    // Add new board
    addBoard(state, action: PayloadAction<Board>) {
      state.boards.push(action.payload);
    },

    // Update existing board
    updateBoard(state, action: PayloadAction<Board>) {
      const index = state.boards.findIndex(
        (board) => board.id === action.payload.id
      );
      if (index !== -1) {
        state.boards[index] = action.payload;

        // Update current board if it's the same board
        if (state.currentBoard?.id === action.payload.id) {
          state.currentBoard = action.payload;
        }
      }
    },

    // Remove board
    removeBoard(state, action: PayloadAction<string>) {
      state.boards = state.boards.filter(
        (board) => board.id !== action.payload
      );

      // Clear current board if removed
      if (state.currentBoard?.id === action.payload) {
        state.currentBoard = null;
      }
    },

    // Add task to current board
    addTask(state, action: PayloadAction<BoardTask>) {
      if (state.currentBoard) {
        state.currentBoard.tasks.push(action.payload);
      }
    },

    // Update task in current board
    updateTask(state, action: PayloadAction<BoardTask>) {
      if (state.currentBoard) {
        const taskIndex = state.currentBoard.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (taskIndex !== -1) {
          state.currentBoard.tasks[taskIndex] = action.payload;
        }
      }
    },

    // Remove task from current board
    removeTask(state, action: PayloadAction<string>) {
      if (state.currentBoard) {
        state.currentBoard.tasks = state.currentBoard.tasks.filter(
          (task) => task.id !== action.payload
        );
      }
    },
  },
});

// Export actions and reducer
export const {
  fetchBoardsStart,
  fetchBoardsSuccess,
  fetchBoardsFailure,
  setCurrentBoard,
  addBoard,
  updateBoard,
  removeBoard,
  addTask,
  updateTask,
  removeTask,
} = boardSlice.actions;

export default boardSlice.reducer;
