import { create } from 'zustand';
import { db } from '../lib/db.js';

export const useRecurring = create((set) => ({
  recurring: [],

  loadRecurring: async () => {
    const recurring = await db.recurring.toArray();
    set({ recurring });
  },

  addRecurring: async (data) => {
    const record = {
      id: crypto.randomUUID(),
      currency: 'USD',
      last_generated_month: null,
      ...data,
    };
    await db.recurring.add(record);
    set((s) => ({ recurring: [...s.recurring, record] }));
  },

  deleteRecurring: async (id) => {
    await db.recurring.delete(id);
    set((s) => ({ recurring: s.recurring.filter((r) => r.id !== id) }));
  },
}));
