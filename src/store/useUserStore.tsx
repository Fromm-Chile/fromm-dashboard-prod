import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: any | null;
  setUser: (user: any) => void;
  clearUser: () => void;
  countryCode: string | null;
  setCountryCode: (countryCode: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      countryCode: null,
      setUser: (user: any) => set({ user }),
      clearUser: () => set({ user: null }),
      setCountryCode: (countryCode: string) => set({ countryCode }),
      reset: () => set({ user: null, countryCode: null }),
    }),
    { name: "user-store" }
  )
);

export const clearLocalStorage = () => {
  localStorage.removeItem("user-store");
  useUserStore.getState().reset();
};
