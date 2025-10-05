// src/store/useSettingsStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set, get) => ({
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

      // === CONTEXT HUB STATE ===
      workingContextHistory: [], // [{ text: 'Reviewing PR #45', date: Date.now() }, ...]
      pinnedTask: null, // { id: '45', type: 'PR', name: 'Fix Sidebar Bug' }
      // =============================

      // Updated to be a generic toggle function
      toggleStarred: (itemId) => set((state) => {
        const isStarred = state.starredItems.includes(itemId);
        if (isStarred) {
          return { starredItems: state.starredItems.filter(id => id !== itemId) };
        } else {
          return { starredItems: [...state.starredItems, itemId] };
        }
      }),

      // NEW ACTION: Manages the context history
      setWorkingContext: (contextText) => set((state) => {
        if (!contextText) return state;

        const newContext = { text: contextText, date: Date.now() };
        // Filter out duplicates and put the new context at the start
        const history = [newContext, ...state.workingContextHistory.filter(c => c.text !== contextText)];
        
        // Keep history limited to 5 items (Quick-Switcher list size)
        return { workingContextHistory: history.slice(0, 5) };
      }),
      
      // *** NEW ACTION: Allows deleting a context item by its unique date timestamp ***
      removeContextFromHistory: (dateToRemove) => set((state) => ({
          workingContextHistory: state.workingContextHistory.filter(context => context.date !== dateToRemove)
      })),

      // NEW ACTION: Sets the pinned task
      setPinnedTask: (taskDetails) => set({ pinnedTask: taskDetails }), // Accepts null to unpin

      // Other functions remain the same
      updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
      setAvatar: (avatarUrl) => set((state) => ({ profile: { ...state.profile, avatar: avatarUrl } })),
      removeAvatar: () => set((state) => ({ profile: { ...state.profile, avatar: null } })),
      setTheme: (theme) => set({ theme }),
      setAccentColor: (color) => set({ accentColor: color }),
      toggleReduceMotion: () => set((state) => ({ reduceMotion: !state.reduceMotion })),
      setStatus: (statusDetails) => set({ status: statusDetails }),
    }),
    { 
      name: 'realm-app-storage', 
      storage: createJSONStorage(() => localStorage) 
    }
  )
);

export default useSettingsStore;