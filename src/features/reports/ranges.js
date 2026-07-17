import { tzDate } from '../dashboard/utils.js';

// Period presets for the report. Each resolves to an inclusive [startStr, endStr]
// pair of `yyyy-MM-dd` strings in the app's display timezone.
export const RANGE_PRESETS = [
  { key: 'this-month', label: 'This month' },
  { key: 'last-month', label: 'Last month' },
  { key: 'last-3', label: '3 months' },
  { key: 'last-6', label: '6 months' },
  { key: 'this-year', label: 'This year' },
  { key: 'last-12', label: '12 months' },
  { key: 'all', label: 'All time' },
];

export const DEFAULT_RANGE = 'this-year';

const pad = (n) => String(n).padStart(2, '0');
export const ymd = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

const lastDayOfMonth = (y, m) => new Date(y, m, 0).getDate();

// A trailing window that starts on the 1st of the month `back` months ago and
// ends today. `back = 2` → current month plus the 2 prior (3 months total).
function trailingMonths(ty, tm, todayStr, back) {
  const d = new Date(ty, tm - 1 - back, 1);
  return { startStr: ymd(d.getFullYear(), d.getMonth() + 1, 1), endStr: todayStr };
}

export function resolveRange(key, todayStr, expenses) {
  const [ty, tm] = todayStr.split('-').map(Number);

  switch (key) {
    case 'this-month':
      return { startStr: ymd(ty, tm, 1), endStr: todayStr };
    case 'last-month': {
      const d = new Date(ty, tm - 2, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      return { startStr: ymd(y, m, 1), endStr: ymd(y, m, lastDayOfMonth(y, m)) };
    }
    case 'last-3':
      return trailingMonths(ty, tm, todayStr, 2);
    case 'last-6':
      return trailingMonths(ty, tm, todayStr, 5);
    case 'last-12':
      return trailingMonths(ty, tm, todayStr, 11);
    case 'this-year':
      return { startStr: ymd(ty, 1, 1), endStr: todayStr };
    case 'all': {
      if (!expenses.length) return { startStr: ymd(ty, tm, 1), endStr: todayStr };
      let min = todayStr;
      for (const e of expenses) {
        const d = tzDate(e.spent_at);
        if (d < min) min = d;
      }
      return { startStr: min, endStr: todayStr };
    }
    default:
      return { startStr: ymd(ty, 1, 1), endStr: todayStr };
  }
}
