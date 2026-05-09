import { Box, Paper, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { InfoTip } from '../primitives.jsx';
import { cardMotion, getHeroSx } from '../utils.js';

export default function HeroCard({
  now,
  total,
  percentChange,
  lastMonthDate,
  projection,
}) {
  const theme = useTheme();
  const intPart = Math.floor(total).toLocaleString();
  const decPart = String(Math.round((total % 1) * 100)).padStart(2, '0');
  const isPositive = (percentChange ?? 0) >= 0;

  return (
    <Paper component={motion.div} {...cardMotion(0)} sx={getHeroSx(theme)}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'text.secondary',
          }}
        >
          {format(now, 'MMMM yyyy')} total
        </Typography>
        <InfoTip title="Total spend so far this month, compared against last month and projected to month-end at your current pace." />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, flexWrap: 'wrap' }}>
        <Typography
          sx={{
            fontFamily: '"Roboto Mono", "Courier New", monospace',
            fontSize: { xs: '2.75rem', md: '3.75rem' },
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.05em',
            color: 'text.primary',
          }}
        >
          ${intPart}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Roboto Mono", "Courier New", monospace',
            fontSize: { xs: '1.4rem', md: '1.8rem' },
            fontWeight: 500,
            color: 'text.secondary',
            lineHeight: 1,
          }}
        >
          .{decPart}
        </Typography>
      </Box>

      {percentChange !== null && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
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
            {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}
            {percentChange.toFixed(1)}%
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            vs {format(lastMonthDate, 'MMMM yyyy')}
          </Typography>
        </Box>
      )}

      {projection && (
        <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.75 }}>
          At this pace —{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
            ~${Math.round(projection.projected).toLocaleString()}
          </Box>{' '}
          projected · {projection.daysLeft}d left
        </Typography>
      )}
    </Paper>
  );
}
