import { Box, Paper, Tooltip, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { InfoTip } from '../../dashboard/primitives.jsx';
import { cardMotion, getHeroSx } from '../../dashboard/utils.js';

const rangeText = (start, end) =>
  start.getFullYear() === end.getFullYear()
    ? `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
    : `${format(start, 'MMM d, yyyy')} – ${format(end, 'MMM d, yyyy')}`;

export default function ReportHeaderCard({ data }) {
  const theme = useTheme();
  const { total, percentChange, startDate, endDate, spanDays } = data;
  const intPart = Math.floor(total).toLocaleString();
  const decPart = String(Math.round((total % 1) * 100)).padStart(2, '0');
  const isPositive = (percentChange ?? 0) >= 0;

  const compareRange = `${format(new Date(`${data.compareStartStr}T12:00:00`), 'MMM d')} – ${format(
    new Date(`${data.compareEndStr}T12:00:00`),
    'MMM d, yyyy',
  )}`;

  return (
    <Paper component={motion.div} {...cardMotion(0)} sx={getHeroSx(theme)}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'text.secondary',
          }}
        >
          Spending report
        </Typography>
        <InfoTip title="Total spend over the selected period, compared against the previous window of equal length." />
      </Box>

      <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 1.5 }}>
        {rangeText(startDate, endDate)}
        <Box component="span" sx={{ color: 'text.disabled' }}>
          {'  ·  '}
          {spanDays.toLocaleString()} days
        </Box>
      </Typography>

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

      {percentChange !== null ? (
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
              letterSpacing: '0.02em',
            }}
          >
            {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}
            {percentChange.toFixed(1)}%
          </Box>
          <Tooltip title={`Prior period: ${compareRange}`} arrow enterTouchDelay={0}>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', cursor: 'help' }}>
              vs prior period
            </Typography>
          </Tooltip>
        </Box>
      ) : (
        <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 1.5 }}>
          No comparable prior period
        </Typography>
      )}
    </Paper>
  );
}
