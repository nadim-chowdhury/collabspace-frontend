import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for calendar-related entities
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO date string
  end: string; // ISO date string
  allDay?: boolean;
  color?: string;
  location?: string;
  participants?: string[];
  recurrence?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    byDay?: string[];
    until?: string;
  };
}

export interface CalendarState {
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  loading: boolean;
  error: string | null;
  view: "month" | "week" | "day" | "agenda";
}

// Initial state
const initialState: CalendarState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
  view: "month",
};

// Create the calendar slice
const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // Fetch events
    fetchEventsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchEventsSuccess(state, action: PayloadAction<CalendarEvent[]>) {
      state.events = action.payload;
      state.loading = false;
    },
    fetchEventsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Add new event
    addEvent(state, action: PayloadAction<CalendarEvent>) {
      state.events.push(action.payload);
    },

    // Update existing event
    updateEvent(state, action: PayloadAction<CalendarEvent>) {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },

    // Remove event
    removeEvent(state, action: PayloadAction<string>) {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    },

    // Select event
    selectEvent(state, action: PayloadAction<CalendarEvent | null>) {
      state.selectedEvent = action.payload;
    },

    // Change calendar view
    changeView(
      state,
      action: PayloadAction<"month" | "week" | "day" | "agenda">
    ) {
      state.view = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  fetchEventsStart,
  fetchEventsSuccess,
  fetchEventsFailure,
  addEvent,
  updateEvent,
  removeEvent,
  selectEvent,
  changeView,
} = calendarSlice.actions;

export default calendarSlice.reducer;
