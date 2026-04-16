import { useMemo } from 'react';
import { Box, LinearProgress, Paper, Stack, Typography, useTheme } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useExpenses } from '../store/useExpenses.js';
import { useBudgets } from '../store/useBudgets.js';
import { useCategories } from '../store/useCategories.js';

function SectionLabel({ children, sx = {} }) {
  return (
    <Typography
      sx={{
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'text.secondary',
        mb: 2,
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

export default function Dashboard() {
  const theme = useTheme();
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

  const lastMonthTotal = useMemo(() => {
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const start = startOfMonth(lastMonthStart).toISOString();
    const end = endOfMonth(lastMonthStart).toISOString();
    return expenses
      .filter((e) => e.spent_at >= start && e.spent_at <= end)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

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

  const intPart = Math.floor(total).toLocaleString();
  const decPart = String(Math.round((total % 1) * 100)).padStart(2, '0');
  const isPositive = (percentChange ?? 0) >= 0;
  const now = new Date();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return (
    <Stack spacing={2.5}>
      <Typography variant="h1">Dashboard</Typography>

      {/* Hero total card */}
      <Paper
        sx={{
          p: 2.5,
          background: 'linear-gradient(140deg, #080e24 0%, #0e1a45 55%, #142060 100%)',
          border: '1px solid rgba(99,130,255,0.18)',
          boxShadow: '0 0 0 1px rgba(99,130,255,0.08), 0 8px 40px rgba(14,26,69,0.7), 0 0 60px rgba(30,58,138,0.25)',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(160,180,255,0.6)',
            mb: 1.5,
          }}
        >
          {format(now, 'MMMM yyyy')} total
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          <Typography
            sx={{
              fontFamily: '"Roboto Mono", "Courier New", monospace',
              fontSize: '2.75rem',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.05em',
              color: '#ffffff',
            }}
          >
            ${intPart}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Roboto Mono", "Courier New", monospace',
              fontSize: '1.4rem',
              fontWeight: 500,
              color: 'rgba(160,180,255,0.55)',
              lineHeight: 1,
            }}
          >
            .{decPart}
          </Typography>
        </Box>

        {percentChange !== null && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.4,
                bgcolor: isPositive ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                color: isPositive ? '#4ade80' : '#f87171',
                border: '1px solid',
                borderColor: isPositive ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)',
                px: 1.25,
                py: 0.35,
                borderRadius: 10,
                fontFamily: '"Roboto Mono", "Courier New", monospace',
                fontSize: '0.72rem',
                fontWeight: 700,
                lineHeight: 1.5,
                letterSpacing: '0.02em',
              }}
            >
              {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{percentChange.toFixed(1)}%
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(160,180,255,0.45)' }}>
              vs {format(lastMonthDate, 'MMMM yyyy')}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* By category */}
      {pieData.length > 0 && (
        <Paper
          sx={{
            p: 2.5,
            background: 'linear-gradient(140deg, #0a0a0a 0%, #111111 55%, #161616 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <SectionLabel sx={{ color: 'rgba(255,255,255,0.35)' }}>By category</SectionLabel>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative', flex: '0 0 160px', height: 160 }}>
              <PieChart
                series={[
                  {
                    data: pieData,
                    innerRadius: 48,
                    outerRadius: 72,
                    paddingAngle: 2,
                    cornerRadius: 4,
                    cx: 80,
                    cy: 80,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                  },
                ]}
                width={160}
                height={160}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                slotProps={{ legend: { hidden: true } }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.55rem',
                    color: 'rgba(255,255,255,0.35)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    lineHeight: 1.4,
                  }}
                >
                  Total
                </Typography>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.2, color: '#ffffff' }}>
                  ${total >= 1000 ? `${Math.round(total / 1000)}K` : Math.round(total)}
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
              {pieData.map((d) => {
                const pct = Math.round((d.value / total) * 100);
                return (
                  <Box key={d.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: 9,
                            height: 9,
                            borderRadius: '50%',
                            bgcolor: d.color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: 'rgba(220,225,255,0.88)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {d.label}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', ml: 1, flexShrink: 0 }}>
                        {pct}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{
                        height: 3,
                        borderRadius: 2,
                        bgcolor: `${d.color}33`,
                        '& .MuiLinearProgress-bar': { bgcolor: d.color, borderRadius: 2 },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Paper>
      )}

      {/* Daily spend */}
      {spendingDays.length > 0 && (
        <Paper
          sx={{
            p: 2.5,
            background: 'linear-gradient(140deg, #0a0a0a 0%, #111111 55%, #161616 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <SectionLabel sx={{ color: 'rgba(255,255,255,0.35)' }}>Daily spend</SectionLabel>

          <Box sx={{ display: 'flex', gap: 3, mb: 2.5 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Roboto Mono", "Courier New", monospace',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              >
                {spendingDays.length}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  color: 'rgba(160,180,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  mt: 0.5,
                }}
              >
                days active
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Roboto Mono", "Courier New", monospace',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              >
                ${(total / spendingDays.length).toFixed(0)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  color: 'rgba(160,180,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  mt: 0.5,
                }}
              >
                avg / day
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Roboto Mono", "Courier New", monospace',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              >
                ${maxDaySpend.toFixed(0)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  color: 'rgba(160,180,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  mt: 0.5,
                }}
              >
                peak day
              </Typography>
            </Box>
          </Box>

          <Stack spacing={1.5}>
            {spendingDays.map((d) => {
              const pct = Math.round((d.total / maxDaySpend) * 100);
              return (
                <Box key={d.day}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: 'rgba(220,225,255,0.88)',
                      }}
                    >
                      {d.day}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Roboto Mono", "Courier New", monospace',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#ffffff',
                      }}
                    >
                      ${d.total.toFixed(2)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      height: 3,
                      borderRadius: 2,
                      bgcolor: 'rgba(122,143,255,0.12)',
                      '& .MuiLinearProgress-bar': { bgcolor: '#7a8fff', borderRadius: 2 },
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </Paper>
      )}

      {/* Budgets */}
      {budgetProgress.length > 0 && (
        <Paper sx={{ p: 2.5 }}>
          <SectionLabel>Budgets</SectionLabel>
          <Stack spacing={1.5}>
            {budgetProgress.map((b) => (
              <Box key={b.category}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{b.label}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: b.spent > b.budget ? 'error.main' : 'text.secondary' }}
                  >
                    ${b.spent.toFixed(2)} / ${b.budget.toFixed(2)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (b.spent / b.budget) * 100)}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: `${b.color}22`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: b.spent > b.budget ? 'error.main' : b.color,
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {thisMonth.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No expenses this month.
        </Typography>
      )}
    </Stack>
  );
}
