import { Box, Paper, Typography, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { SectionLabel } from '../primitives.jsx';
import { cardMotion, getCardSx } from '../utils.js';

export default function CumulativeSpendCard({
  cumulativeData,
  now,
  lastMonthDate,
  motionIndex,
}) {
  const theme = useTheme();
  const lineColorThis = '#7a8fff';
  const lineColorLast = theme.palette.mode === 'dark' ? '#4b5563' : '#9ca3af';

  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="Running total day-by-day for this month vs. last month. Lets you see if you're tracking ahead of or behind last month's pace.">
        Cumulative spend
      </SectionLabel>
      <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: lineColorThis }} />
          <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
            {format(now, 'MMM')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: lineColorLast }} />
          <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
            {format(lastMonthDate, 'MMM')}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ height: 340 }}>
        <LineChart
          xAxis={[{ data: cumulativeData.xs, label: 'Day', tickMinStep: 5 }]}
          series={[
            {
              data: cumulativeData.lastCum,
              label: format(lastMonthDate, 'MMM'),
              color: lineColorLast,
              showMark: false,
              connectNulls: false,
              curve: 'monotoneX',
            },
            {
              data: cumulativeData.thisCum,
              label: format(now, 'MMM'),
              color: lineColorThis,
              showMark: false,
              connectNulls: false,
              curve: 'monotoneX',
              area: true,
            },
          ]}
          height={340}
          margin={{ top: 10, right: 10, bottom: 30, left: 50 }}
          slotProps={{ legend: { hidden: true } }}
          sx={{
            '& .MuiAreaElement-series-auto-generated-id-1': {
              fill: 'url(#cumGradient)',
              opacity: 0.25,
            },
          }}
        >
          <defs>
            <linearGradient id="cumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColorThis} stopOpacity={0.5} />
              <stop offset="100%" stopColor={lineColorThis} stopOpacity={0} />
            </linearGradient>
          </defs>
        </LineChart>
      </Box>
    </Paper>
  );
}
