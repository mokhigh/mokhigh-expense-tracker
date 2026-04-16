import { useMemo } from 'react';
import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useExpenses } from '../store/useExpenses.js';
import { useBudgets } from '../store/useBudgets.js';
import { useCategories } from '../store/useCategories.js';

export default function Dashboard() {
  const expenses = useExpenses((s) => s.expenses);
  const budgets = useBudgets((s) => s.budgets);
  const categories = useCategories((s) => s.categories);

  const thisMonth = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now).toISOString();
    const end = endOfMonth(now).toISOString();
    return expenses.filter((e) => e.spent_at >= start && e.spent_at <= end);
  }, [expenses]);

  const total = useMemo(
    () => thisMonth.reduce((sum, e) => sum + Number(e.amount), 0),
    [thisMonth],
  );

  const pieData = useMemo(() => {
    const map = {};
    for (const e of thisMonth) {
      map[e.category] = (map[e.category] ?? 0) + Number(e.amount);
    }
    return Object.entries(map)
      .map(([id, value]) => {
        const cat = categories.find((c) => c.id === id);
        return { id, value, label: cat?.label ?? id, color: cat?.color ?? '#94a3b8' };
      })
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [thisMonth, categories]);

  const barData = useMemo(() => {
    const now = new Date();
    const days = eachDayOfInterval({ start: startOfMonth(now), end: now });
    return days.map((day) => {
      const key = format(day, 'yyyy-MM-dd');
      const dayTotal = thisMonth
        .filter((e) => e.spent_at.slice(0, 10) === key)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      return { day: format(day, 'MMM d'), total: dayTotal };
    });
  }, [thisMonth]);

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
          color: cat?.color ?? '#94a3b8',
          budget: amount,
          spent,
        };
      })
      .filter((b) => b.budget > 0);
  }, [budgets, thisMonth, categories]);

  return (
    <Stack spacing={3}>
      <Typography variant="h1">Dashboard</Typography>

      <Paper sx={{ p: 2.5 }}>
        <Typography variant="body2" color="text.secondary">
          {format(new Date(), 'MMMM yyyy')} total
        </Typography>
        <Typography variant="h1" sx={{ mt: 0.5 }}>
          ${total.toFixed(2)}
        </Typography>
      </Paper>

      {budgetProgress.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h2" sx={{ mb: 1.5, fontSize: '1rem' }}>
            Budgets
          </Typography>
          <Stack spacing={1.5}>
            {budgetProgress.map((b) => (
              <Box key={b.category}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{b.label}</Typography>
                  <Typography
                    variant="body2"
                    color={b.spent > b.budget ? 'error.main' : 'text.secondary'}
                  >
                    ${b.spent.toFixed(2)} / ${b.budget.toFixed(2)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (b.spent / b.budget) * 100)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: `${b.color}22`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: b.spent > b.budget ? 'error.main' : b.color,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {thisMonth.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No expenses this month.
        </Typography>
      ) : (
        <>
          {pieData.length > 0 && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h2" sx={{ mb: 1, fontSize: '1rem' }}>
                By category
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <PieChart
                  series={[
                    {
                      data: pieData,
                      innerRadius: 50,
                      paddingAngle: 2,
                      cornerRadius: 4,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                    },
                  ]}
                  height={220}
                  width={320}
                />
              </Box>
            </Paper>
          )}

          <Paper sx={{ p: 2 }}>
            <Typography variant="h2" sx={{ mb: 1, fontSize: '1rem' }}>
              Daily spend
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <BarChart
                dataset={barData}
                xAxis={[{ scaleType: 'band', dataKey: 'day' }]}
                series={[{ dataKey: 'total', label: 'Spent ($)', color: '#2563eb' }]}
                height={220}
                width={Math.max(320, barData.length * 30)}
                slotProps={{ legend: { hidden: true } }}
              />
            </Box>
          </Paper>
        </>
      )}
    </Stack>
  );
}
