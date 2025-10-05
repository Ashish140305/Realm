import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// NEW: Define default shortcuts in a central place
const defaultShortcuts = {
  openCommandPalette: { key: 'k', ctrl: true, label: 'Open Command Palette' },
  openSettings: { key: ',', ctrl: true, label: 'Open Settings' },
  openInbox: { key: 'i', ctrl: false, label: 'Open Inbox' },
  startFocus: { key: 'f', ctrl: false, label: 'Start Focus Session' },
  newProject: { key: 'n', ctrl: false, label: 'Create New Project' },
  searchFiles: { key: 'f', ctrl: true, label: 'Search Files' },
};

const useSettingsStore = create(
  persist(
    (set, get) => ({
      // --- Existing State ---
      profile: {
        name: 'Vedant',
        username: 'vedant-d',
        bio: 'Hello :D',
        email: 'vedant@gmail.com',
        avatar: null,
        profession: 'Frontend Engineer',
        company: 'Realm Corp',
        socials: { 
          github: 'vedantD13', 
          linkedin: 'vedant-s', 
          twitter: 'vedanttweets' 
        },
      },
      theme: 'dark',
      accentColor: '#58a6ff',
      reduceMotion: false,
      status: null, 
      starredItems: ['Socket-Server-Node'], 
      workingContextHistory: [],
      pinnedTask: null,
      fontSize: 'default',
      compactMode: false,
      notifications: {
        email: true,
        inApp: true,
        desktop: false,
      },

      // --- NEW: Add shortcuts to the state ---
      shortcuts: defaultShortcuts,

      // --- Existing Actions ---
      // ... (all your other actions like toggleStarred, setTheme, etc.)
      toggleStarred: (itemId) => set((state) => {
        const isStarred = state.starredItems.includes(itemId);
        if (isStarred) {
          return { starredItems: state.starredItems.filter(id => id !== itemId) };
        } else {
          return { starredItems: [...state.starredItems, itemId] };
        }
      }),
      setWorkingContext: (contextText) => set((state) => {
        if (!contextText) return state;
        const newContext = { text: contextText, date: Date.now() };
        const history = [newContext, ...state.workingContextHistory.filter(c => c.text !== contextText)];
        return { workingContextHistory: history.slice(0, 5) };
      }),
      removeContextFromHistory: (dateToRemove) => set((state) => ({
          workingContextHistory: state.workingContextHistory.filter(context => context.date !== dateToRemove)
      })),
      setPinnedTask: (taskDetails) => set({ pinnedTask: taskDetails }),
      updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
      setAvatar: (avatarUrl) => set((state) => ({ profile: { ...state.profile, avatar: avatarUrl } })),
      removeAvatar: () => set((state) => ({ profile: { ...state.profile, avatar: null } })),
      setTheme: (theme) => set({ theme }),
      setAccentColor: (color) => set({ accentColor: color }),
      toggleReduceMotion: () => set((state) => ({ reduceMotion: !state.reduceMotion })),
      setStatus: (statusDetails) => set({ status: statusDetails }),
      setFontSize: (size) => set({ fontSize: size }),
      toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
      toggleNotification: (type) => set((state) => ({
        notifications: {
          ...state.notifications,
          [type]: !state.notifications[type],
        }
      })),

      // --- NEW: Action to update a shortcut ---
      updateShortcut: (actionName, newBinding) => set((state) => ({
        shortcuts: {
          ...state.shortcuts,
          [actionName]: { ...state.shortcuts[actionName], ...newBinding },
        },
      })),
    }),
    { 
      name: 'realm-app-storage', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // ... (all your other persisted state)
        profile: state.profile,
        theme: state.theme,
        accentColor: state.accentColor,
        reduceMotion: state.reduceMotion,
        status: state.status,
        starredItems: state.starredItems,
        workingContextHistory: state.workingContextHistory,
        pinnedTask: state.pinnedTask,
        fontSize: state.fontSize,
        compactMode: state.compactMode,
        notifications: state.notifications,
        // --- NEW: Persist shortcuts ---
        shortcuts: state.shortcuts,
      }),
    }
  )
);

export default useSettingsStore;