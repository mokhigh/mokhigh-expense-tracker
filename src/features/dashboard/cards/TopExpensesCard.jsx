import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { SectionLabel } from '../primitives.jsx';
import { cardMotion, getCardSx } from '../utils.js';

export default function TopExpensesCard({ topExpenses, motionIndex }) {
  const theme = useTheme();
  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="Your top 5 single transactions this month, ranked by amount.">
        Largest expenses
      </SectionLabel>
      <Stack spacing={1.5}>
        {topExpenses.map((e, i) => (
          <Box
            key={e.id}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}
          >
            <Typography
              sx={{
                fontFamily: '"Roboto Mono", "Courier New", monospace',
                fontSize: '0.7rem',
                color: 'text.disabled',
                width: 18,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </Typography>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: e.categoryColor,
                flexShrink: 0,
              }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
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
                {e.note}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                {e.categoryLabel} · {e.date}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: '"Roboto Mono", "Courier New", monospace',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'text.primary',
                flexShrink: 0,
              }}
            >
              ${e.amount.toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
