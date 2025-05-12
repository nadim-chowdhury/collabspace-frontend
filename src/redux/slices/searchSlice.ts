import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for search-related entities
export interface SearchResult {
  id: string;
  type: "document" | "task" | "board" | "user" | "message" | "event";
  title: string;
  description?: string;
  relevanceScore: number;
  context?: string;
  icon?: string;
  path?: string;
}

export interface SearchFilter {
  type?: "document" | "task" | "board" | "user" | "message" | "event";
  dateFrom?: string;
  dateTo?: string;
  minRelevance?: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  filters: SearchFilter;
  loading: boolean;
  error: string | null;
  recentSearches: string[];
}

// Initial state
const initialState: SearchState = {
  query: "",
  results: [],
  filters: {},
  loading: false,
  error: null,
  recentSearches: [],
};

// Create the search slice
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // Set search query
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },

    // Start search
    searchStart(state) {
      state.loading = true;
      state.error = null;
      state.results = [];
    },

    // Search success
    searchSuccess(state, action: PayloadAction<SearchResult[]>) {
      state.results = action.payload;
      state.loading = false;

      // Add to recent searches if not already present
      if (state.query && !state.recentSearches.includes(state.query)) {
        state.recentSearches.unshift(state.query);

        // Limit recent searches to 10
        if (state.recentSearches.length > 10) {
          state.recentSearches.pop();
        }
      }
    },

    // Search failure
    searchFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Set search filters
    setSearchFilters(state, action: PayloadAction<SearchFilter>) {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear search filters
    clearSearchFilters(state) {
      state.filters = {};
    },

    // Remove a specific recent search
    removeRecentSearch(state, action: PayloadAction<string>) {
      state.recentSearches = state.recentSearches.filter(
        (search) => search !== action.payload
      );
    },

    // Clear all recent searches
    clearRecentSearches(state) {
      state.recentSearches = [];
    },
  },
});

// Export actions and reducer
export const {
  setSearchQuery,
  searchStart,
  searchSuccess,
  searchFailure,
  setSearchFilters,
  clearSearchFilters,
  removeRecentSearch,
  clearRecentSearches,
} = searchSlice.actions;

export default searchSlice.reducer;
