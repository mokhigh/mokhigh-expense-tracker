import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeMode = create(
  persist(
    (set) => ({
      mode: 'dark',
      toggleMode: () =>
        set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'theme-mode' },
  ),
);

export default useThemeMode;
