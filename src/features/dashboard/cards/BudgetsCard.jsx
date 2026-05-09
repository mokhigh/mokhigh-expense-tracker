import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { MotionBar, SectionLabel } from '../primitives.jsx';
import { cardMotion, getCardSx } from '../utils.js';

export default function BudgetsCard({ budgetProgress, variant, motionIndex }) {
  const theme = useTheme();
  const isMobile = variant === 'mobile';
  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="Spend vs. monthly budget per category. Bars turn red once you cross the limit.">
        Budgets
      </SectionLabel>
      <Stack spacing={1.5}>
        {budgetProgress.map((b) => {
          const over = b.spent > b.budget;
          const pct = isMobile
            ? Math.min(100, (b.spent / b.budget) * 100)
            : Math.min(100, (b.spent / b.budget) * 100);
          return (
            <Box key={b.category}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">{b.label}</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    ...(isMobile && {
                      fontFamily: '"Roboto Mono", "Courier New", monospace',
                      fontSize: '0.8rem',
                    }),
                    color: over ? 'error.main' : 'text.secondary',
                  }}
                >
                  {isMobile
                    ? `$${b.spent.toFixed(0)} / $${b.budget.toFixed(0)}`
                    : `$${b.spent.toFixed(2)} / $${b.budget.toFixed(2)}`}
                </Typography>
              </Box>
              <MotionBar
                value={pct}
                color={over ? '#f44336' : b.color}
                bg={`${b.color}22`}
                height={4}
              />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
