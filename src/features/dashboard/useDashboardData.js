import { useMemo } from 'react';
import { format, startOfMonth, eachDayOfInterval, getDaysInMonth } from 'date-fns';
import { useExpenses } from '../../store/useExpenses.js';
import { useBudgets } from '../../store/useBudgets.js';
import { useCategories } from '../../store/useCategories.js';
import { tzDate, tzYM, dayOf } from './utils.js';

export function useDashboardData() {
  const expenses = useExpenses((s) => s.expenses);
  const budgets = useBudgets((s) => s.budgets);
  const categories = useCategories((s) => s.categories);

  const now = new Date();
  const todayDay = parseInt(tzDate(now).slice(8));

  const thisMonth = useMemo(() => {
    const key = tzYM(new Date());
    return expenses.filter((e) => tzYM(e.spent_at) === key);
  }, [expenses]);

  const total = useMemo(
    () => thisMonth.reduce((sum, e) => sum + Number(e.amount), 0),
    [thisMonth],
  );

  const lastMonthKey = useMemo(() => {
    const [y, m] = tzYM(new Date()).split('-').map(Number);
    return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;
  }, []);

  const lastMonthExpenses = useMemo(
    () => expenses.filter((e) => tzYM(e.spent_at) === lastMonthKey),
    [expenses, lastMonthKey],
  );

  const lastMonthTotal = useMemo(
    () => lastMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [lastMonthExpenses],
  );

  const percentChange =
    lastMonthTotal > 0 ? ((total - lastMonthTotal) / lastMonthTotal) * 100 : null;

  const pieData = useMemo(() => {
    const map = {};
    for (const e of thisMonth) {
      map[e.category] = (map[e.category] ?? 0) + Number(e.amount);
    }
    return Object.entries(map)
      .map(([id, value]) => {
        const cat = categories.find((c) => c.id === id);
        return { id, value, label: cat?.label ?? id, color: cat?.color ?? '#888888' };
      })
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [thisMonth, categories]);

  const barData = useMemo(() => {
    const days = eachDayOfInterval({ start: startOfMonth(now), end: now });
    return days.map((day) => {
      const key = format(day, 'yyyy-MM-dd');
      const dayTotal = thisMonth
        .filter((e) => tzDate(e.spent_at) === key)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      return { day: format(day, 'MMM d'), weekday: format(day, 'EEE'), total: dayTotal };
    });
  }, [thisMonth]);

  const spendingDays = useMemo(() => barData.filter((d) => d.total > 0), [barData]);
  const maxDaySpend = useMemo(() => Math.max(...barData.map((d) => d.total), 1), [barData]);

  const budgetProgress = useMemo(() => {
    return budgets
      .map(({ category, amount }) => {
        const spent = thisMonth
          .filter((e) => e.category === category)
          .reduce((sum, e) => sum + Number(e.amount), 0);
        const cat = categories.find((c) => c.id === category);
        return {
          category,
          label: cat?.label ?? category,
          color: cat?.color ?? '#888888',
          budget: amount,
          spent,
        };
      })
      .filter((b) => b.budget > 0);
  }, [budgets, thisMonth, categories]);

  const monthlyHistory = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = tzYM(d);
      const monthTotal = expenses
        .filter((e) => tzYM(e.spent_at) === key)
        .reduce((s, e) => s + Number(e.amount), 0);
      return { key, label: format(d, 'MMM yyyy'), total: monthTotal, isCurrent: i === 0 };
    });
  }, [expenses]);

  const maxMonthlyTotal = useMemo(
    () => Math.max(...monthlyHistory.map((m) => m.total), 1),
    [monthlyHistory],
  );

  const sixMonthAvg = useMemo(() => {
    const past = monthlyHistory.slice(1).filter((m) => m.total > 0);
    if (!past.length) return null;
    return past.reduce((s, m) => s + m.total, 0) / past.length;
  }, [monthlyHistory]);

  const projection = useMemo(() => {
    if (todayDay === 0 || total === 0) return null;
    const daysInMonth = getDaysInMonth(now);
    const projected = (total / todayDay) * daysInMonth;
    return { projected, daysLeft: daysInMonth - todayDay };
  }, [total, todayDay]);

  const checkpointData = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = tzYM(d);
      const monthExp = expenses.filter((e) => tzYM(e.spent_at) === key);
      const by15 = monthExp.filter((e) => dayOf(e) <= 15).reduce((s, e) => s + Number(e.amount), 0);
      const by30 = monthExp.filter((e) => dayOf(e) <= 30).reduce((s, e) => s + Number(e.amount), 0);
      const full = monthExp.reduce((s, e) => s + Number(e.amount), 0);
      return { key, label: format(d, i === 0 ? "'This'" : 'MMM'), by15, by30, full, isCurrent: i === 0 };
    });
  }, [expenses]);

  const maxBy15 = useMemo(() => Math.max(...checkpointData.map((c) => c.by15), 1), [checkpointData]);
  const maxBy30 = useMemo(() => Math.max(...checkpointData.map((c) => c.by30), 1), [checkpointData]);

  const weekdayData = useMemo(() => {
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const totals = new Array(7).fill(0);
    const counts = new Array(7).fill(0);
    for (const e of thisMonth) {
      const [y, mo, d] = tzDate(e.spent_at).split('-').map(Number);
      const idx = new Date(y, mo - 1, d).getDay();
      totals[idx] += Number(e.amount);
      counts[idx] += 1;
    }
    return DAYS.map((label, i) => ({ label, total: totals[i], count: counts[i] }));
  }, [thisMonth]);

  const maxWeekday = useMemo(() => Math.max(...weekdayData.map((d) => d.total), 1), [weekdayData]);

  const topExpenses = useMemo(() => {
    return [...thisMonth]
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 5)
      .map((e) => {
        const cat = categories.find((c) => c.id === e.category);
        return {
          id: e.id,
          amount: Number(e.amount),
          note: e.note || cat?.label || 'Expense',
          categoryLabel: cat?.label ?? e.category,
          categoryColor: cat?.color ?? '#888888',
          date: format(new Date(e.spent_at), 'MMM d'),
        };
      });
  }, [thisMonth, categories]);

  const categoryDeltas = useMemo(() => {
    const cur = {};
    const prev = {};
    for (const e of thisMonth) cur[e.category] = (cur[e.category] ?? 0) + Number(e.amount);
    for (const e of lastMonthExpenses) prev[e.category] = (prev[e.category] ?? 0) + Number(e.amount);
    const ids = new Set([...Object.keys(cur), ...Object.keys(prev)]);
    return [...ids]
      .map((id) => {
        const cat = categories.find((c) => c.id === id);
        const c = cur[id] ?? 0;
        const p = prev[id] ?? 0;
        const delta = p > 0 ? ((c - p) / p) * 100 : c > 0 ? 100 : 0;
        return {
          id,
          label: cat?.label ?? id,
          color: cat?.color ?? '#888888',
          current: c,
          prev: p,
          delta,
          abs: c - p,
        };
      })
      .filter((d) => d.current > 0 || d.prev > 0)
      .sort((a, b) => Math.abs(b.abs) - Math.abs(a.abs))
      .slice(0, 6);
  }, [thisMonth, lastMonthExpenses, categories]);

  const cumulativeData = useMemo(() => {
    const daysInThis = getDaysInMonth(now);
    const lastDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const daysInLast = getDaysInMonth(lastDate);
    const maxDays = Math.max(daysInThis, daysInLast);
    const xs = Array.from({ length: maxDays }, (_, i) => i + 1);
    const thisCum = new Array(maxDays).fill(null);
    const lastCum = new Array(maxDays).fill(null);
    let runT = 0;
    let runL = 0;
    for (let d = 1; d <= maxDays; d++) {
      if (d <= daysInThis && d <= todayDay) {
        runT += thisMonth.filter((e) => dayOf(e) === d).reduce((s, e) => s + Number(e.amount), 0);
        thisCum[d - 1] = runT;
      }
      if (d <= daysInLast) {
        runL += lastMonthExpenses
          .filter((e) => dayOf(e) === d)
          .reduce((s, e) => s + Number(e.amount), 0);
        lastCum[d - 1] = runL;
      }
    }
    return { xs, thisCum, lastCum };
  }, [thisMonth, lastMonthExpenses, todayDay]);

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const avgPerActiveDay = spendingDays.length > 0 ? total / spendingDays.length : 0;
  const hasHistory = monthlyHistory.slice(1).some((m) => m.total > 0);
  const hasWeekdayData = weekdayData.some((d) => d.total > 0);
  const hasLastMonth = lastMonthTotal > 0;

  return {
    now,
    todayDay,
    lastMonthDate,
    thisMonth,
    total,
    percentChange,
    pieData,
    spendingDays,
    maxDaySpend,
    budgetProgress,
    monthlyHistory,
    maxMonthlyTotal,
    sixMonthAvg,
    projection,
    checkpointData,
    maxBy15,
    maxBy30,
    weekdayData,
    maxWeekday,
    topExpenses,
    categoryDeltas,
    cumulativeData,
    avgPerActiveDay,
    hasHistory,
    hasWeekdayData,
    hasLastMonth,
  };
}
