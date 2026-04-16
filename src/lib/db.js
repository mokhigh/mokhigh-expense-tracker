import Dexie from 'dexie';

export const db = new Dexie('mokhigh-expense-tracker');

db.version(1).stores({
  expenses: 'id, spent_at, category, updated_at',
  outbox: '++id, op, entity, created_at',
});

db.version(2).stores({
  budgets: 'category',
  recurring: 'id, category',
  categories: 'id, sort_order',
});

export async function dbAddExpense(expense) {
  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    user_id: null,
    currency: 'USD',
    created_at: now,
    updated_at: now,
    ...expense,
  };
  await db.expenses.add(record);
  await db.outbox.add({ op: 'insert', entity: 'expenses', payload: record, created_at: now });
  return record;
}

export async function dbUpdateExpense(id, changes) {
  const now = new Date().toISOString();
  const updated = { ...changes, updated_at: now };
  await db.expenses.update(id, updated);
  await db.outbox.add({ op: 'update', entity: 'expenses', payload: { id, ...updated }, created_at: now });
  return db.expenses.get(id);
}

export async function dbDeleteExpense(id) {
  await db.expenses.delete(id);
  const now = new Date().toISOString();
  await db.outbox.add({ op: 'delete', entity: 'expenses', payload: { id }, created_at: now });
}

export async function dbGetExpenses() {
  return db.expenses.orderBy('spent_at').reverse().toArray();
}
