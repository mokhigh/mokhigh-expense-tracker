import { db } from './db.js';
import { supabase, isSupabaseConfigured } from './supabase.js';

export async function pullCategories() {
  if (!isSupabaseConfigured) return { pulled: 0, skipped: true };

  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;

  if (data?.length) {
    await db.categories.clear();
    await db.categories.bulkPut(
      data.map(({ user_id: _uid, updated_at: _ua, ...rest }) => rest),
    );
  }

  return { pulled: data?.length ?? 0, skipped: false };
}

export async function pushCategories(categories, userId) {
  if (!isSupabaseConfigured || !userId) return;
  const now = new Date().toISOString();
  const rows = categories.map((c) => ({ ...c, user_id: userId, updated_at: now }));
  const { error } = await supabase
    .from('categories')
    .upsert(rows, { onConflict: 'id,user_id' });
  if (error) throw error;
}

export async function pushCategory(cat, userId) {
  if (!isSupabaseConfigured || !userId) return;
  const { error } = await supabase
    .from('categories')
    .upsert(
      { ...cat, user_id: userId, updated_at: new Date().toISOString() },
      { onConflict: 'id,user_id' },
    );
  if (error) throw error;
}

export async function deleteRemoteCategory(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function flushOutbox() {
  if (!isSupabaseConfigured) return { pushed: 0, skipped: true };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { pushed: 0, skipped: true };

  const pending = await db.outbox.orderBy('created_at').toArray();
  let pushed = 0;

  for (const item of pending) {
    const { op, entity, payload } = item;
    let error = null;

    if (entity === 'expenses') {
      if (op === 'insert' || op === 'update') {
        const stamped = { ...payload, user_id: user.id };
        ({ error } = await supabase.from('expenses').upsert(stamped));
      } else if (op === 'delete') {
        ({ error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', payload.id));
      }
    }

    if (error) break;
    await db.outbox.delete(item.id);
    pushed += 1;
  }

  return { pushed, skipped: false };
}

export async function clearAllExpenses() {
  await db.expenses.clear();
  await db.outbox.clear();

  if (!isSupabaseConfigured) return;
  // RLS limits this delete to the authenticated user's own rows
  await supabase.from('expenses').delete().gte('created_at', new Date(0).toISOString());
}

export async function pullExpenses() {
  if (!isSupabaseConfigured) return { pulled: 0, skipped: true };

  const { data, error } = await supabase.from('expenses').select('*');
  if (error) throw error;

  await db.expenses.clear();
  if (data?.length) await db.expenses.bulkPut(data);

  return { pulled: data?.length ?? 0, skipped: false };
}
