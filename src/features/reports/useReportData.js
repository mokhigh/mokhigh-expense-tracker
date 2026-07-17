import { useMemo } from 'react';
import {
  format,
  eachMonthOfInterval,
  eachDayOfInterval,
  addDays,
  differenceInCalendarDays,
} from 'date-fns';
import { useExpenses } from '../../store/useExpenses.js';
import { useCategories } from '../../store/useCategories.js';
import { tzDate, tzYM } from '../dashboard/utils.js';
import { resolveRange, ymd } from './ranges.js';

const FALLBACK = { label: null, color: '#888888' };
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Parse a `yyyy-MM-dd` string at local noon so timezone offsets never roll it
// across a day/month boundary (mirrors the app's existing date handling).
const parseStr = (s) => new Date(`${s}T12:00:00`);
const fmtStr = (dt) => ymd(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());

const sum = (list) => list.reduce((s, e) => s + Number(e.amount), 0);

export function useReportData(rangeKey) {
  const expenses = useExpenses((s) => s.expenses);
  const categories = useCategories((s) => s.categories);

  return useMemo(() => {
    const todayStr = tzDate(new Date());
    const { startStr, endStr } = resolveRange(rangeKey, todayStr, expenses);

    const startDate = parseStr(startStr);
    const endDate = parseStr(endStr);
    const spanDays = Math.max(1, differenceInCalendarDays(endDate, startDate) + 1);
    const multiYear = startStr.slice(0, 4) !== endStr.slice(0, 4);

    // Prior window of equal length, immediately preceding the current one.
    const compareEndDate = addDays(startDate, -1);
    const compareStartDate = addDays(compareEndDate, -(spanDays - 1));
    const cStartStr = fmtStr(compareStartDate);
    const cEndStr = fmtStr(compareEndDate);

    const catOf = (id) => categories.find((c) => c.id === id) ?? FALLBACK;

    const periodExpenses = expenses.filter((e) => {
      const d = tzDate(e.spent_at);
      return d >= startStr && d <= endStr;
    });
    const prevExpenses = expenses.filter((e) => {
      const d = tzDate(e.spent_at);
      return d >= cStartStr && d <= cEndStr;
    });

    const total = sum(periodExpenses);
    const prevTotal = sum(prevExpenses);
    const count = periodExpenses.length;
    const percentChange =
      prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : null;

    // ---- time buckets (month for multi-month windows, day otherwise) -------
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    const granularity = months.length > 1 ? 'month' : 'day';

    let trend;
    if (granularity === 'month') {
      trend = months.map((d) => {
        const key = format(d, 'yyyy-MM');
        const items = periodExpenses.filter((e) => tzYM(e.spent_at) === key);
        return {
          key,
          label: format(d, multiYear ? "MMM ''yy" : 'MMM'),
          total: sum(items),
          count: items.length,
        };
      });
    } else {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      trend = days.map((d) => {
        const key = format(d, 'yyyy-MM-dd');
        const items = periodExpenses.filter((e) => tzDate(e.spent_at) === key);
        return {
          key,
          label: format(d, 'd'),
          total: sum(items),
          count: items.length,
        };
      });
    }
    const maxTrend = Math.max(...trend.map((t) => t.total), 1);

    // running cumulative total across the buckets
    let run = 0;
    const cumulative = trend.map((t) => {
      run += t.total;
      return { label: t.label, total: run };
    });

    const busiest = trend.reduce(
      (best, t) => (t.total > best.total ? t : best),
      { label: '—', total: 0 },
    );

    // ---- category breakdown ------------------------------------------------
    const byCatMap = new Map();
    for (const e of periodExpenses) {
      const cur = byCatMap.get(e.category) ?? { total: 0, count: 0 };
      cur.total += Number(e.amount);
      cur.count += 1;
      byCatMap.set(e.category, cur);
    }
    const categoryBreakdown = [...byCatMap.entries()]
      .map(([id, v]) => {
        const cat = catOf(id);
        return {
          id,
          label: cat.label ?? id,
          color: cat.color ?? '#888888',
          total: v.total,
          count: v.count,
          avg: v.count ? v.total / v.count : 0,
          pct: total > 0 ? (v.total / total) * 100 : 0,
        };
      })
      .sort((a, b) => b.total - a.total);

    // ---- category deltas vs prior period -----------------------------------
    const prevByCat = new Map();
    for (const e of prevExpenses) {
      prevByCat.set(e.category, (prevByCat.get(e.category) ?? 0) + Number(e.amount));
    }
    const ids = new Set([...byCatMap.keys(), ...prevByCat.keys()]);
    const categoryDeltas = [...ids]
      .map((id) => {
        const cat = catOf(id);
        const cur = byCatMap.get(id)?.total ?? 0;
        const prev = prevByCat.get(id) ?? 0;
        const delta = prev > 0 ? ((cur - prev) / prev) * 100 : cur > 0 ? null : 0;
        return {
          id,
          label: cat.label ?? id,
          color: cat.color ?? '#888888',
          current: cur,
          prev,
          delta,
          abs: cur - prev,
        };
      })
      .filter((d) => d.current > 0 || d.prev > 0)
      .sort((a, b) => Math.abs(b.abs) - Math.abs(a.abs));

    // ---- weekday pattern ---------------------------------------------------
    const wdTotals = new Array(7).fill(0);
    const wdCounts = new Array(7).fill(0);
    for (const e of periodExpenses) {
      const [y, mo, d] = tzDate(e.spent_at).split('-').map(Number);
      const idx = new Date(y, mo - 1, d).getDay();
      wdTotals[idx] += Number(e.amount);
      wdCounts[idx] += 1;
    }
    const weekday = WEEKDAYS.map((label, i) => ({
      label,
      total: wdTotals[i],
      count: wdCounts[i],
    }));
    const maxWeekday = Math.max(...weekday.map((w) => w.total), 1);

    // ---- top expenses ------------------------------------------------------
    const topExpenses = [...periodExpenses]
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 10)
      .map((e) => {
        const cat = catOf(e.category);
        const d = tzDate(e.spent_at);
        return {
          id: e.id,
          amount: Number(e.amount),
          note: e.note || cat.label || 'Expense',
          categoryLabel: cat.label ?? e.category,
          categoryColor: cat.color ?? '#888888',
          date: format(parseStr(d), multiYear ? "MMM d, ''yy" : 'MMM d'),
        };
      });

    const largest = topExpenses[0] ?? null;

    // ---- summary stats -----------------------------------------------------
    const activeDays = new Set(periodExpenses.map((e) => tzDate(e.spent_at))).size;
    const monthsTouched = months.length;

    return {
      rangeKey,
      startStr,
      endStr,
      startDate,
      endDate,
      multiYear,
      spanDays,
      granularity,
      compareStartStr: cStartStr,
      compareEndStr: cEndStr,
      isEmpty: count === 0,

      total,
      prevTotal,
      count,
      percentChange,
      activeDays,
      monthsTouched,
      avgPerDay: total / spanDays,
      avgPerActiveDay: activeDays ? total / activeDays : 0,
      avgPerTxn: count ? total / count : 0,
      avgPerMonth: total / monthsTouched,

      trend,
      maxTrend,
      cumulative,
      busiest,
      categoryBreakdown,
      categoryDeltas,
      weekday,
      maxWeekday,
      topExpenses,
      largest,
    };
  }, [expenses, categories, rangeKey]);
}
