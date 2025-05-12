import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for video-related entities
export interface VideoParticipant {
  id: string;
  username: string;
  avatar?: string;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
}

export interface VideoCall {
  id: string;
  title?: string;
  participants: VideoParticipant[];
  hostId: string;
  startedAt: string;
  status: "connecting" | "in-progress" | "ended";
  recordingStatus: "not-recording" | "recording" | "paused";
}

export interface VideoState {
  currentCall: VideoCall | null;
  callHistory: VideoCall[];
  localUser: VideoParticipant | null;
  loading: boolean;
  error: string | null;
  deviceSettings: {
    audioInput: string | null;
    audioOutput: string | null;
    videoInput: string | null;
  };
}

// Initial state
const initialState: VideoState = {
  currentCall: null,
  callHistory: [],
  localUser: null,
  loading: false,
  error: null,
  deviceSettings: {
    audioInput: null,
    audioOutput: null,
    videoInput: null,
  },
};

// Create the video slice
const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    // Start a new video call
    startVideoCall(
      state,
      action: PayloadAction<Omit<VideoCall, "status" | "recordingStatus">>
    ) {
      state.currentCall = {
        ...action.payload,
        status: "connecting",
        recordingStatus: "not-recording",
      };
      state.loading = false;
    },

    // Update call status
    updateCallStatus(
      state,
      action: PayloadAction<{
        status?: VideoCall["status"];
        recordingStatus?: VideoCall["recordingStatus"];
      }>
    ) {
      if (state.currentCall) {
        if (action.payload.status) {
          state.currentCall.status = action.payload.status;
        }
        if (action.payload.recordingStatus) {
          state.currentCall.recordingStatus = action.payload.recordingStatus;
        }
      }
    },

    // Add participant to current call
    addParticipant(state, action: PayloadAction<VideoParticipant>) {
      if (state.currentCall) {
        state.currentCall.participants.push(action.payload);
      }
    },

    // Remove participant from current call
    removeParticipant(state, action: PayloadAction<string>) {
      if (state.currentCall) {
        state.currentCall.participants = state.currentCall.participants.filter(
          (participant) => participant.id !== action.payload
        );
      }
    },

    // Update participant status
    updateParticipant(
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<VideoParticipant>;
      }>
    ) {
      if (state.currentCall) {
        const participantIndex = state.currentCall.participants.findIndex(
          (p) => p.id === action.payload.id
        );
        if (participantIndex !== -1) {
          state.currentCall.participants[participantIndex] = {
            ...state.currentCall.participants[participantIndex],
            ...action.payload.updates,
          };
        }
      }
    },

    // End current call
    endVideoCall(state) {
      if (state.currentCall) {
        state.callHistory.push({
          ...state.currentCall,
          status: "ended",
        });
        state.currentCall = null;
      }
    },

    // Set local user
    setLocalUser(state, action: PayloadAction<VideoParticipant>) {
      state.localUser = action.payload;
    },

    // Update device settings
    updateDeviceSettings(
      state,
      action: PayloadAction<Partial<VideoState["deviceSettings"]>>
    ) {
      state.deviceSettings = {
        ...state.deviceSettings,
        ...action.payload,
      };
    },

    // Handle video call errors
    setVideoError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Export actions and reducer
export const {
  startVideoCall,
  updateCallStatus,
  addParticipant,
  removeParticipant,
  updateParticipant,
  endVideoCall,
  setLocalUser,
  updateDeviceSettings,
  setVideoError,
} = videoSlice.actions;

export default videoSlice.reducer;
