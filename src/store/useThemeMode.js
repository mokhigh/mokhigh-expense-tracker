import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { flushSync } from 'react-dom';

const useThemeMode = create(
  persist(
    (set) => ({
      mode: 'dark',
      toggleMode: () => {
        const update = () => set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' }));
        if (document.startViewTransition) {
          document.startViewTransition(() => flushSync(update));
        } else {
          update();
        }
      },
    }),
    { name: 'theme-mode' },
  ),
);

export default useThemeMode;
