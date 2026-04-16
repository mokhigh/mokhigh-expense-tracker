import { format, getDaysInMonth } from 'date-fns';
import { db, dbAddExpense } from './db.js';

export async function generateRecurring(userId) {
  const now = new Date();
  const currentMonth = format(now, 'yyyy-MM');
  const templates = await db.recurring.toArray();
  let generated = 0;

  for (const t of templates) {
    if (t.last_generated_month === currentMonth) continue;

    const day = Math.min(t.day_of_month, getDaysInMonth(now));
    const spent_at = new Date(now.getFullYear(), now.getMonth(), day).toISOString();

    await dbAddExpense({
      amount: t.amount,
      currency: t.currency ?? 'USD',
      category: t.category,
      note: t.note ?? null,
      user_id: userId ?? null,
      spent_at,
    });

    await db.recurring.update(t.id, { last_generated_month: currentMonth });
    generated += 1;
  }

  return generated;
}
