import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      profile: {
        name: 'Vedant',
        username: 'vedant-d', // Default username, now editable
        bio: 'Hello :D',
        email: 'vedant@gmail.com',
        avatar: null,
        profession: 'Frontend Engineer',
        company: 'Realm Corp',
        // Social links are part of the profile state
        socials: { 
          github: 'vedantD13', 
          linkedin: 'vedant-s', 
          twitter: 'vedanttweets' 
        },
      },
      theme: 'dark',
      accentColor: '#58a6ff',
      reduceMotion: false,

      // Functions to update the state
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