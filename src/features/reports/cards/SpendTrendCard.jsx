import { Box, Paper, Tooltip, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { SectionLabel } from '../../dashboard/primitives.jsx';
import { cardMotion, getCardSx, EASE } from '../../dashboard/utils.js';

const money = (n) => `$${Math.round(n).toLocaleString()}`;

export default function SpendTrendCard({ data, motionIndex }) {
  const theme = useTheme();
  const { trend, maxTrend, busiest, granularity } = data;
  const isMonth = granularity === 'month';
  const peakColor = '#7a8fff';
  const baseColor = 'rgba(122,143,255,0.4)';

  // Thin labels when there are many day-columns so they don't collide.
  const step = Math.ceil(trend.length / 14);
  const showLabel = (i) =>
    isMonth || trend.length <= 16 || i % step === 0 || i === trend.length - 1;

  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel
        info={
          isMonth
            ? 'Total spend for each month in the selected period. The highest month is highlighted.'
            : 'Total spend for each day in the selected period. The highest day is highlighted.'
        }
      >
        {isMonth ? 'Spend by month' : 'Daily spend'}
      </SectionLabel>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: trend.length > 20 ? 0.35 : 0.75,
          height: 220,
        }}
      >
        {trend.map((t, i) => {
          const pct = (t.total / maxTrend) * 100;
          const isPeak = t.key === busiest.key && t.total > 0;
          return (
            <Box
              key={t.key}
              sx={{
                flex: 1,
                minWidth: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box sx={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <Tooltip
                  arrow
                  placement="top"
                  enterTouchDelay={0}
                  title={`${t.label} · ${money(t.total)}${
                    t.count ? ` · ${t.count} txn${t.count === 1 ? '' : 's'}` : ''
                  }`}
                >
                  <Box
                    component={motion.div}
                    initial={{ height: 0 }}
                    animate={{ height: `${t.total > 0 ? Math.max(pct, 2) : 0}%` }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.1 + Math.min(i, 20) * 0.02 }}
                    sx={{
                      width: '100%',
                      maxWidth: 44,
                      mx: 'auto',
                      minHeight: t.total > 0 ? 3 : 0,
                      borderRadius: '5px 5px 0 0',
                      bgcolor: isPeak ? peakColor : baseColor,
                      cursor: 'default',
                    }}
                  />
                </Tooltip>
              </Box>
              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: '0.6rem',
                  fontWeight: isPeak ? 700 : 500,
                  color: isPeak ? 'text.primary' : 'text.disabled',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  height: 14,
                  lineHeight: '14px',
                }}
              >
                {showLabel(i) ? t.label : ' '}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
