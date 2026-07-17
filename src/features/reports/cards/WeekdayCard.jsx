import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { MotionBar, SectionLabel } from '../../dashboard/primitives.jsx';
import { cardMotion, getCardSx } from '../../dashboard/utils.js';

const money = (n) => `$${Math.round(n).toLocaleString()}`;

export default function WeekdayCard({ data, motionIndex }) {
  const theme = useTheme();
  const { weekday, maxWeekday } = data;
  const peak = weekday.reduce((m, w) => (w.total > m ? w.total : m), 0);
  const dim = theme.palette.mode === 'dark' ? '#4b5563' : '#9ca3af';

  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="Which days of the week you spend the most on, totalled across the whole period.">
        Spending by weekday
      </SectionLabel>
      <Stack spacing={1.5}>
        {weekday.map((w) => {
          const pct = Math.round((w.total / maxWeekday) * 100);
          const isPeak = w.total === peak && w.total > 0;
          return (
            <Box key={w.label}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: isPeak ? 700 : 400,
                    color: isPeak ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {w.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Roboto Mono", "Courier New", monospace',
                    fontSize: '0.8rem',
                    fontWeight: isPeak ? 700 : 400,
                    color: isPeak ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {w.total > 0 ? money(w.total) : '—'}
                </Typography>
              </Box>
              <MotionBar
                value={pct}
                color={isPeak ? '#7a8fff' : dim}
                bg={isPeak ? 'rgba(122,143,255,0.12)' : 'rgba(107,114,128,0.08)'}
              />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
