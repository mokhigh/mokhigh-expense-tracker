import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { MotionBar, SectionLabel } from '../primitives.jsx';
import { cardMotion, getCardSx } from '../utils.js';

export default function DailySpendCard({ spendingDays, motionIndex }) {
  const theme = useTheme();
  const topDays = useMemo(
    () => [...spendingDays].sort((a, b) => b.total - a.total).slice(0, 5),
    [spendingDays],
  );
  const peak = topDays[0]?.total ?? 1;
  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="Your top 5 highest-spending days this month. Bars are scaled relative to your peak day.">
        Top spending days
      </SectionLabel>
      <Stack spacing={1.25}>
        {topDays.map((d) => {
          const pct = Math.round((d.total / peak) * 100);
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
                  sx={{ fontSize: '0.82rem', fontWeight: 500, color: 'text.primary' }}
                >
                  {d.weekday}, {d.day}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Roboto Mono", "Courier New", monospace',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  ${d.total.toFixed(2)}
                </Typography>
              </Box>
              <MotionBar value={pct} color="#7a8fff" bg="rgba(122,143,255,0.12)" />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
