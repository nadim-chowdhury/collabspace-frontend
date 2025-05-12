import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the user object
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: "admin" | "user" | "guest";
}

// Define the auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login reducer
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Logout reducer
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    // Update user profile
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Set authentication status
    setAuthentication(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  setAuthentication,
} = authSlice.actions;

export default authSlice.reducer;
