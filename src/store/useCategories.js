import { create } from 'zustand';
import { db } from '../lib/db.js';
import { CATEGORIES } from '../utils/categories.js';
import { pullCategories, pushCategory, pushCategories, deleteRemoteCategory } from '../lib/sync.js';
import { isSupabaseConfigured } from '../lib/supabase.js';
import { useAuth } from './useAuth.js';

export const useCategories = create((set) => ({
  categories: [],

  loadCategories: async () => {
    const userId = useAuth.getState().user?.id;
    let shouldPushLocal = false;

    if (isSupabaseConfigured && userId) {
      try {
        const { pulled } = await pullCategories();
        if (pulled > 0) {
          const cats = await db.categories.orderBy('sort_order').toArray();
          set({ categories: cats });
          return;
        }
        // Supabase reachable but empty — will push local data up after seeding
        shouldPushLocal = true;
      } catch (_) {
        // Network error — fall through to local
      }
    }

    const localCount = await db.categories.count();
    if (localCount === 0) {
      await db.categories.bulkAdd(CATEGORIES.map((c, i) => ({ ...c, sort_order: i })));
    }
    const cats = await db.categories.orderBy('sort_order').toArray();
    set({ categories: cats });

    if (shouldPushLocal) {
      pushCategories(cats, userId).catch(() => {});
    }
  },

  saveCategory: async (cat) => {
    await db.categories.put(cat);
    const categories = await db.categories.orderBy('sort_order').toArray();
    set({ categories });
    const userId = useAuth.getState().user?.id;
    pushCategory(cat, userId).catch(() => {});
  },

  deleteCategory: async (id) => {
    await db.categories.delete(id);
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
    deleteRemoteCategory(id).catch(() => {});
  },

  reorderCategories: async (orderedIds) => {
    await db.transaction('rw', db.categories, async () => {
      for (let i = 0; i < orderedIds.length; i++) {
        await db.categories.update(orderedIds[i], { sort_order: i });
      }
    });
    const categories = await db.categories.orderBy('sort_order').toArray();
    set({ categories });
    const userId = useAuth.getState().user?.id;
    pushCategories(categories, userId).catch(() => {});
  },
}));
