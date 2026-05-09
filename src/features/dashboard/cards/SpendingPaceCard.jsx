import { Box, Paper, Typography, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { SectionLabel } from '../primitives.jsx';
import { cardMotion, getCardSx } from '../utils.js';

export default function SpendingPaceCard({
  cumulativeData,
  todayDay,
  now,
  lastMonthDate,
  motionIndex,
}) {
  const theme = useTheme();
  const lineColorThis = '#7a8fff';
  const lineColorLast = theme.palette.mode === 'dark' ? '#4b5563' : '#9ca3af';

  const thisAtToday = cumulativeData.thisCum[todayDay - 1] ?? 0;
  const lastAtSameDay = cumulativeData.lastCum[todayDay - 1] ?? 0;
  const deltaPct =
    lastAtSameDay > 0 ? ((thisAtToday - lastAtSameDay) / lastAtSameDay) * 100 : null;
  const ahead = deltaPct !== null && deltaPct > 0;
  const accent =
    deltaPct === null
      ? theme.palette.text.secondary
      : ahead
        ? '#f87171'
        : '#4ade80';

  const xs = cumulativeData.xs.slice(0, todayDay);
  const thisSeries = cumulativeData.thisCum.slice(0, todayDay);
  const lastSeries = cumulativeData.lastCum.slice(0, todayDay);

  const arrow = deltaPct === null ? '' : ahead ? '▲' : '▼';
  const sign = deltaPct !== null && deltaPct > 0 ? '+' : '';
  const headlineText =
    deltaPct === null ? '—' : `${arrow} ${sign}${deltaPct.toFixed(0)}%`;

  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info={`How much faster or slower you're spending compared to ${format(lastMonthDate, 'MMMM')} at the same day of the month. Green ▼ means you're behind last month's pace; red ▲ means ahead.`}>
        Spending pace
      </SectionLabel>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
        <Typography
          sx={{
            fontFamily: '"Roboto Mono", "Courier New", monospace',
            fontSize: { xs: '1.6rem', md: '1.9rem' },
            fontWeight: 700,
            lineHeight: 1,
            color: accent,
          }}
        >
          {headlineText}
        </Typography>
        <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
          vs {format(lastMonthDate, 'MMM')} at day {todayDay}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontFamily: '"Roboto Mono", "Courier New", monospace',
          fontSize: '0.78rem',
          color: 'text.secondary',
          mb: 1.5,
        }}
      >
        ${Math.round(thisAtToday).toLocaleString()}
        <Box component="span" sx={{ color: 'text.disabled', mx: 0.75 }}>
          /
        </Box>
        ${Math.round(lastAtSameDay).toLocaleString()}
      </Typography>

      <Box sx={{ flex: 1, minHeight: 160 }}>
        <LineChart
          xAxis={[{ data: xs, label: 'Day', tickMinStep: 5 }]}
          series={[
            {
              data: lastSeries,
              label: format(lastMonthDate, 'MMM'),
              color: lineColorLast,
              showMark: false,
              curve: 'monotoneX',
            },
            {
              data: thisSeries,
              label: format(now, 'MMM'),
              color: lineColorThis,
              showMark: false,
              curve: 'monotoneX',
              area: true,
            },
          ]}
          height={180}
          margin={{ top: 8, right: 10, bottom: 28, left: 44 }}
          slotProps={{ legend: { hidden: true } }}
          sx={{
            '& .MuiAreaElement-series-auto-generated-id-1': {
              fill: 'url(#paceGradient)',
              opacity: 0.25,
            },
          }}
        >
          <defs>
            <linearGradient id="paceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColorThis} stopOpacity={0.5} />
              <stop offset="100%" stopColor={lineColorThis} stopOpacity={0} />
            </linearGradient>
          </defs>
        </LineChart>
      </Box>
    </Paper>
  );
}
