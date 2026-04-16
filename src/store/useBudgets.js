import { create } from 'zustand';
import { db } from '../lib/db.js';

export const useBudgets = create((set) => ({
  budgets: [],

  loadBudgets: async () => {
    const budgets = await db.budgets.toArray();
    set({ budgets });
  },

  setBudget: async (category, amount) => {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      await db.budgets.delete(category);
    } else {
      await db.budgets.put({ category, amount: num });
    }
    const budgets = await db.budgets.toArray();
    set({ budgets });
  },
}));
