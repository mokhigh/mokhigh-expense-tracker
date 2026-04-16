import { create } from 'zustand';
import { dbAddExpense, dbDeleteExpense, dbGetExpenses, dbUpdateExpense } from '../lib/db.js';
import { useAuth } from './useAuth.js';
import { clearAllExpenses, flushOutbox } from '../lib/sync.js';

export const useExpenses = create((set) => ({
  expenses: [],
  loading: false,
  error: null,

  loadExpenses: async () => {
    set({ loading: true, error: null });
    try {
      const expenses = await dbGetExpenses();
      set({ expenses });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  addExpense: async (data) => {
    const user = useAuth.getState().user;
    const record = await dbAddExpense({ ...data, user_id: user?.id ?? null });
    set((s) => ({ expenses: [record, ...s.expenses] }));
    flushOutbox().catch(console.error);
  },

  updateExpense: async (id, changes) => {
    const record = await dbUpdateExpense(id, changes);
    set((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? record : e)) }));
    flushOutbox().catch(console.error);
  },

  deleteExpense: async (id) => {
    await dbDeleteExpense(id);
    set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
    flushOutbox().catch(console.error);
  },

  clearExpenses: async () => {
    await clearAllExpenses();
    set({ expenses: [] });
  },

  setExpenses: (expenses) => set({ expenses }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
