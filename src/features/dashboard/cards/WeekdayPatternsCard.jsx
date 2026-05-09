import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { MotionBar, SectionLabel } from '../primitives.jsx';
import { cardMotion, getCardSx } from '../utils.js';

export default function WeekdayPatternsCard({
  weekdayData,
  maxWeekday,
  motionIndex,
  variant = 'vertical',
}) {
  const theme = useTheme();

  if (variant === 'horizontal') {
    return (
      <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
        <SectionLabel info="Total spend by day of week this month. The smaller number next to each day is the transaction count.">
          Weekday patterns
        </SectionLabel>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1,
          }}
        >
          {weekdayData.map((d) => {
            const pct = Math.round((d.total / maxWeekday) * 100);
            const active = d.total > 0;
            return (
              <Box
                key={d.label}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 0.75,
                  px: 1,
                  py: 1.25,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: active ? 'divider' : 'transparent',
                  bgcolor: active
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.02)'
                      : 'rgba(0,0,0,0.02)'
                    : 'transparent',
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: active ? 'text.primary' : 'text.disabled',
                    }}
                  >
                    {d.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.62rem',
                      color: 'text.disabled',
                      fontWeight: 500,
                    }}
                  >
                    {d.count > 0 ? d.count : ''}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Roboto Mono", "Courier New", monospace',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: active ? 'text.primary' : 'text.disabled',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {active ? `$${Math.round(d.total).toLocaleString()}` : '—'}
                </Typography>
                <MotionBar value={pct} color="#34d399" bg="rgba(52,211,153,0.1)" />
              </Box>
            );
          })}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="Total spend by day of week this month. The smaller number next to each day is the transaction count.">
        Weekday patterns
      </SectionLabel>
      <Stack spacing={1.5}>
        {weekdayData.map((d) => {
          const pct = Math.round((d.total / maxWeekday) * 100);
          return (
            <Box key={d.label}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: d.total > 0 ? 'text.primary' : 'text.disabled',
                  }}
                >
                  {d.label}
                  {d.count > 0 && (
                    <Box
                      component="span"
                      sx={{ color: 'text.disabled', fontWeight: 400, ml: 0.75 }}
                    >
                      · {d.count}
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Roboto Mono", "Courier New", monospace',
                    fontSize: '0.82rem',
                    color: d.total > 0 ? 'text.primary' : 'text.disabled',
                  }}
                >
                  {d.total > 0 ? `$${Math.round(d.total).toLocaleString()}` : '—'}
                </Typography>
              </Box>
              <MotionBar value={pct} color="#34d399" bg="rgba(52,211,153,0.1)" />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
