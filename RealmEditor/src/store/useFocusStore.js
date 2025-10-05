// src/store/useFocusStore.js
import { create } from 'zustand';

// DEPRECATED: This store is being retired as the "Focus Assistant" feature is removed.
// All functionality is now handled by the professional Presence and Context Hub in useSettingsStore.
const useFocusStore = create((set, get) => ({
  isActive: false, // Legacy status
  goal: '',
  duration: 0, 
  timeLeft: 0, 
  timerId: null,

  // Stub functions to prevent runtime errors
  startSession: (settings) => {
    console.warn("Focus session is deprecated. Use Set Working Context via OverviewHeader.");
  },

  endSession: () => {
    console.warn("Focus session is deprecated. Use Set Working Context via OverviewHeader.");
  },
}));

export default useFocusStore;