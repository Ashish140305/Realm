import { create } from 'zustand';

const useFocusStore = create((set, get) => ({
  isActive: false,
  goal: '',
  duration: 0, // Duration in minutes
  timeLeft: 0, // Time left in seconds
  timerId: null,

  startSession: (settings) => {
    const { duration, goal, pauseNotifications, hideActivityFeeds } = settings;
    const durationInSeconds = duration * 60;

    // Clear any existing timer
    if (get().timerId) {
      clearInterval(get().timerId);
    }

    set({
      isActive: true,
      goal,
      duration,
      timeLeft: durationInSeconds,
      // Store the functional settings
      pauseNotifications, 
      hideActivityFeeds,
    });

    // Start the countdown timer
    const newTimerId = setInterval(() => {
      set((state) => {
        if (state.timeLeft <= 1) {
          clearInterval(newTimerId);
          get().endSession(); // End the session when time is up
          return { timeLeft: 0 };
        }
        return { timeLeft: state.timeLeft - 1 };
      });
    }, 1000);

    set({ timerId: newTimerId });
  },

  endSession: () => {
    if (get().timerId) {
      clearInterval(get().timerId);
    }
    set({
      isActive: false,
      goal: '',
      timeLeft: 0,
      timerId: null,
      pauseNotifications: false,
      hideActivityFeeds: false,
    });
    // Here you would also reset the user's status if needed
    // For example: useSettingsStore.getState().setStatus(null);
  },
}));

export default useFocusStore;