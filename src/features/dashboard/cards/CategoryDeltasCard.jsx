import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { MotionBar, SectionLabel } from '../primitives.jsx';
import { cardMotion, getCardSx } from '../utils.js';

export default function CategoryDeltasCard({ categoryDeltas, lastMonthDate, motionIndex }) {
  const theme = useTheme();
  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="How each category's spend changed vs. last month. Red ▲ means you're spending more, green ▼ means less. 'new' marks categories with no spend last month.">
        Category shifts vs {format(lastMonthDate, 'MMM')}
      </SectionLabel>
      <Stack spacing={1.5}>
        {categoryDeltas.map((c) => {
          const up = c.abs >= 0;
          const color = up ? '#f87171' : '#4ade80';
          return (
            <Box key={c.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      bgcolor: c.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: 'text.primary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.label}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.4,
                    color,
                    fontFamily: '"Roboto Mono", "Courier New", monospace',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    ml: 1,
                  }}
                >
                  {up ? '▲' : '▼'} {up ? '+' : ''}
                  {c.prev > 0 ? `${c.delta.toFixed(0)}%` : 'new'}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography
                  sx={{
                    fontFamily: '"Roboto Mono", "Courier New", monospace',
                    fontSize: '0.72rem',
                    color: 'text.disabled',
                    minWidth: 60,
                  }}
                >
                  ${Math.round(c.prev).toLocaleString()}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <MotionBar
                    value={Math.min(100, (c.current / Math.max(c.current, c.prev, 1)) * 100)}
                    color={c.color}
                    bg={`${c.color}22`}
                  />
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Roboto Mono", "Courier New", monospace',
                    fontSize: '0.72rem',
                    color: 'text.primary',
                    fontWeight: 700,
                    minWidth: 60,
                    textAlign: 'right',
                  }}
                >
                  ${Math.round(c.current).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
