import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { MotionBar, SectionLabel } from '../primitives.jsx';
import { cardMotion, getCardSx } from '../utils.js';

export default function MonthlyTrendCard({ monthlyHistory, maxMonthlyTotal, motionIndex }) {
  const theme = useTheme();
  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="Your last 6 months of total spend. The current month is highlighted in blue.">
        Monthly trend
      </SectionLabel>
      <Stack spacing={1.5}>
        {monthlyHistory.map((m) => {
          const pct = Math.round((m.total / maxMonthlyTotal) * 100);
          return (
            <Box key={m.key}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.82rem',
                    fontWeight: m.isCurrent ? 700 : 400,
                    color: m.isCurrent ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {m.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Roboto Mono", "Courier New", monospace',
                    fontSize: '0.82rem',
                    fontWeight: m.isCurrent ? 700 : 400,
                    color: m.isCurrent ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {m.total > 0 ? `$${Math.round(m.total).toLocaleString()}` : '—'}
                </Typography>
              </Box>
              <MotionBar
                value={pct}
                color={
                  m.isCurrent
                    ? '#7a8fff'
                    : theme.palette.mode === 'dark'
                      ? '#4b5563'
                      : '#9ca3af'
                }
                bg={m.isCurrent ? 'rgba(122,143,255,0.12)' : 'rgba(107,114,128,0.08)'}
              />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
