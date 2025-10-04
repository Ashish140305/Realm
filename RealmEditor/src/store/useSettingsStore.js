import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
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

      // Renamed for clarity to handle any item type
      starredItems: ['Socket-Server-Node'], 

      // Updated to be a generic toggle function
      toggleStarred: (itemId) => set((state) => {
        const isStarred = state.starredItems.includes(itemId);
        if (isStarred) {
          return { starredItems: state.starredItems.filter(id => id !== itemId) };
        } else {
          return { starredItems: [...state.starredItems, itemId] };
        }
      }),

      // Other functions remain the same
      updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
      setAvatar: (avatarUrl) => set((state) => ({ profile: { ...state.profile, avatar: avatarUrl } })),
      removeAvatar: () => set((state) => ({ profile: { ...state.profile, avatar: null } })),
      setTheme: (theme) => set({ theme }),
      setAccentColor: (color) => set({ accentColor: color }),
      toggleReduceMotion: () => set((state) => ({ reduceMotion: !state.reduceMotion })),
    }),
    { 
      name: 'realm-app-storage', 
      storage: createJSONStorage(() => localStorage) 
    }
  )
);

export default useSettingsStore;