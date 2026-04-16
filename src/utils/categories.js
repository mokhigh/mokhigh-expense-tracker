export const CATEGORIES = [
  { id: 'food', label: 'Food', color: '#f97316' },
  { id: 'transport', label: 'Transport', color: '#3b82f6' },
  { id: 'shopping', label: 'Shopping', color: '#a855f7' },
  { id: 'entertainment', label: 'Entertainment', color: '#ec4899' },
  { id: 'bills', label: 'Bills', color: '#6b7280' },
  { id: 'health', label: 'Health', color: '#10b981' },
  { id: 'travel', label: 'Travel', color: '#f59e0b' },
  { id: 'other', label: 'Other', color: '#94a3b8' },
];

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
