import {create} from 'zustand';

export const useAuthStore = create((set) => ({
  auth: {
    username: '',
    active:false
    // other auth state values
  },
  setUsername: (username) =>
    set((state) => ({
      auth: {
        ...state.auth,
        username,
      },
    })),
}));

