import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      profile: {
        name: 'Vedant',
        username: 'ashish140305',
        bio: 'Hello :D',
        email: 'vedant@gmail.com',
        avatar: null,
        socials: { github: 'vedantD13', linkedin: 'vedant-s', twitter: 'vedanttweets' },
      },
      theme: 'dark',
      accentColor: '#58a6ff',
      reduceMotion: false,
      starredProjects: ['RealmEditor-Frontend'],
      
      updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
      setAvatar: (avatarUrl) => set((state) => ({ profile: { ...state.profile, avatar: avatarUrl } })),
      removeAvatar: () => set((state) => ({ profile: { ...state.profile, avatar: null } })),
      setTheme: (theme) => set({ theme }),
      setAccentColor: (color) => set({ accentColor: color }),
      toggleReduceMotion: () => set((state) => ({ reduceMotion: !state.reduceMotion })),
      toggleStarredProject: (projectName) =>
        set((state) => ({
          starredProjects: state.starredProjects.includes(projectName)
            ? state.starredProjects.filter((p) => p !== projectName)
            : [...state.starredProjects, projectName],
        })),
    }),
    { name: 'realm-app-storage', storage: createJSONStorage(() => localStorage) }
  )
);
export default useSettingsStore;