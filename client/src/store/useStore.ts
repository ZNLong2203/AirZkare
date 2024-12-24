import { create } from 'zustand';
import { Passenger } from '@/schemas/Passenger';

interface State {
  userInfo: Passenger | null;
  token: string | null;
  expire: number | null;
  setUserInfo: (userInfo: Passenger) => void;
  clearUserInfo: () => void;
  setToken: (token: string, expire: number) => void;
  clearToken: () => void;
  initializeAuth: () => void;
}


export const useStore = create<State>(
  (set) => ({
    userInfo: null,
    token: null,
    expire: null,
    setUserInfo: (userInfo: Passenger) =>
      set(() => ({ userInfo })),
    clearUserInfo: () =>
      set(() => ({ userInfo: null })),
    setToken: (token: string, expire: number) =>
      set(() => ({ token, expire })),
    clearToken: () =>
      set(() => ({ token: null, expire: null })),
    initializeAuth: () => {
      const storedToken = localStorage.getItem('token');
      const storedExpire = localStorage.getItem('expire');

      if (storedToken && storedExpire) {
        const expireTime = parseInt(storedExpire, 10);
        if (Date.now() > expireTime) {
          // Token expired
          // set(() => ({ token: null, expire: null }));
          // localStorage.removeItem('token');
          // localStorage.removeItem('expire');
        } else {
          // Token is valid
          set(() => ({ token: storedToken, expire: expireTime }));
        }
      } else {
        // No token found
        set(() => ({ token: null, expire: null }));
      }
    },
  }),
);
