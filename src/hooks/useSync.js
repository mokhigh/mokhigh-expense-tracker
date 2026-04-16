import { useEffect } from 'react';
import { flushOutbox, pullExpenses } from '../lib/sync.js';
import { generateRecurring } from '../lib/recurring.js';
import { useExpenses } from '../store/useExpenses.js';
import { useAuth } from '../store/useAuth.js';
import { useBudgets } from '../store/useBudgets.js';
import { useCategories } from '../store/useCategories.js';
import { useRecurring } from '../store/useRecurring.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

export function useSync() {
  const loadExpenses = useExpenses((s) => s.loadExpenses);
  const loadBudgets = useBudgets((s) => s.loadBudgets);
  const loadCategories = useCategories((s) => s.loadCategories);
  const loadRecurring = useRecurring((s) => s.loadRecurring);
  const user = useAuth((s) => s.user);

  useEffect(() => {
    async function sync() {
      await Promise.all([loadCategories(), loadBudgets(), loadRecurring()]);
      if (isSupabaseConfigured && user) {
        try {
          await flushOutbox();
          await pullExpenses();
        } catch (err) {
          console.error('sync error:', err);
        }
      }
      await generateRecurring(user?.id ?? null);
      await loadExpenses();
    }
    sync();
  }, [user, loadExpenses, loadBudgets, loadCategories, loadRecurring]);

  useEffect(() => {
    async function onFocus() {
      if (!isSupabaseConfigured || !useAuth.getState().user) return;
      try {
        await flushOutbox();
      } catch (err) {
        console.error('flush error:', err);
      }
      await loadExpenses();
    }

    async function onOnline() {
      if (!isSupabaseConfigured || !useAuth.getState().user) return;
      try {
        await flushOutbox();
        await pullExpenses();
      } catch (err) {
        console.error('sync error:', err);
      }
      await loadExpenses();
    }

    window.addEventListener('focus', onFocus);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', onOnline);
    };
  }, [loadExpenses]);
}
