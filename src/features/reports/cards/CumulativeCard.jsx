import { Box, Paper, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { motion } from 'motion/react';
import { SectionLabel } from '../../dashboard/primitives.jsx';
import { cardMotion, getCardSx } from '../../dashboard/utils.js';

export default function CumulativeCard({ data, motionIndex }) {
  const theme = useTheme();
  const { cumulative } = data;
  const color = '#7a8fff';
  const labels = cumulative.map((c) => c.label);
  const values = cumulative.map((c) => c.total);

  // Show at most ~14 tick labels so long day-based periods stay legible.
  const step = Math.max(1, Math.ceil(labels.length / 14));
  const tickInterval = (_, i) => i % step === 0 || i === labels.length - 1;

  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="Running total across the period — how spend accumulated from the start of the window to the end.">
        Cumulative spend
      </SectionLabel>
      <Box sx={{ height: 260 }}>
        <LineChart
          xAxis={[{ scaleType: 'point', data: labels, tickInterval }]}
          series={[
            {
              data: values,
              color,
              showMark: false,
              curve: 'monotoneX',
              area: true,
            },
          ]}
          height={260}
          margin={{ top: 10, right: 12, bottom: 28, left: 56 }}
          slotProps={{ legend: { hidden: true } }}
          sx={{
            '& .MuiAreaElement-root': {
              fill: 'url(#reportCumGradient)',
              opacity: 0.28,
            },
          }}
        >
          <defs>
            <linearGradient id="reportCumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
        </LineChart>
      </Box>
    </Paper>
  );
}
