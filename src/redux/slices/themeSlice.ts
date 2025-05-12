import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define color palette interface
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

// Define theme modes
export type ThemeMode = "light" | "dark" | "system";

// Define predefined color schemes
export const predefinedColorSchemes = {
  default: {
    light: {
      primary: "#3f51b5",
      secondary: "#f50057",
      accent: "#ff4081",
      background: "#ffffff",
      text: "#000000",
    },
    dark: {
      primary: "#3f51b5",
      secondary: "#f50057",
      accent: "#ff4081",
      background: "#121212",
      text: "#ffffff",
    },
  },
  ocean: {
    light: {
      primary: "#2196f3",
      secondary: "#00bcd4",
      accent: "#009688",
      background: "#f0f4f8",
      text: "#333333",
    },
    dark: {
      primary: "#2196f3",
      secondary: "#00bcd4",
      accent: "#009688",
      background: "#0a1929",
      text: "#ffffff",
    },
  },
  forest: {
    light: {
      primary: "#4caf50",
      secondary: "#8bc34a",
      accent: "#cddc39",
      background: "#f1f8e9",
      text: "#333333",
    },
    dark: {
      primary: "#4caf50",
      secondary: "#8bc34a",
      accent: "#cddc39",
      background: "#1b5e20",
      text: "#ffffff",
    },
  },
};

// Define the theme state interface
export interface ThemeState {
  mode: ThemeMode;
  primaryColor: string;
  colorScheme: keyof typeof predefinedColorSchemes;
  palette: ColorPalette;
  fontSize: number;
  fontFamily: string;
  borderRadius: number;
}

// Initial state
const initialState: ThemeState = {
  mode: "system",
  primaryColor: predefinedColorSchemes.default.light.primary,
  colorScheme: "default",
  palette: predefinedColorSchemes.default.light,
  fontSize: 16,
  fontFamily: "Inter, Roboto, Arial, sans-serif",
  borderRadius: 8,
};

// Create the theme slice
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Change theme mode
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;

      // Update palette based on new mode and current color scheme
      state.palette =
        action.payload === "dark"
          ? predefinedColorSchemes[state.colorScheme].dark
          : predefinedColorSchemes[state.colorScheme].light;
    },

    // Set color scheme
    setColorScheme(
      state,
      action: PayloadAction<keyof typeof predefinedColorSchemes>
    ) {
      state.colorScheme = action.payload;

      // Update palette based on current mode
      state.palette =
        state.mode === "dark"
          ? predefinedColorSchemes[action.payload].dark
          : predefinedColorSchemes[action.payload].light;
    },

    // Update primary color
    setPrimaryColor(state, action: PayloadAction<string>) {
      state.primaryColor = action.payload;

      // Update the palette's primary color
      state.palette = {
        ...state.palette,
        primary: action.payload,
      };
    },

    // Adjust font size
    setFontSize(state, action: PayloadAction<number>) {
      state.fontSize = action.payload;
    },

    // Change font family
    setFontFamily(state, action: PayloadAction<string>) {
      state.fontFamily = action.payload;
    },

    // Adjust border radius
    setBorderRadius(state, action: PayloadAction<number>) {
      state.borderRadius = action.payload;
    },

    // Toggle between light and dark modes
    toggleThemeMode(state) {
      state.mode = state.mode === "light" ? "dark" : "light";

      // Update palette when toggling
      state.palette =
        state.mode === "dark"
          ? predefinedColorSchemes[state.colorScheme].dark
          : predefinedColorSchemes[state.colorScheme].light;
    },

    // Reset theme to default
    resetTheme(state) {
      state.mode = "system";
      state.primaryColor = predefinedColorSchemes.default.light.primary;
      state.colorScheme = "default";
      state.palette = predefinedColorSchemes.default.light;
      state.fontSize = 16;
      state.fontFamily = "Inter, Roboto, Arial, sans-serif";
      state.borderRadius = 8;
    },
  },
});

// Export actions and reducer
export const {
  setThemeMode,
  setColorScheme,
  setPrimaryColor,
  setFontSize,
  setFontFamily,
  setBorderRadius,
  toggleThemeMode,
  resetTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
