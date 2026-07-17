import { Box, Chip, Paper, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { SectionLabel } from '../../dashboard/primitives.jsx';
import { cardMotion, getCardSx } from '../../dashboard/utils.js';

const money = (n) => `$${Number(n).toFixed(2)}`;

export default function TopExpensesCard({ data, motionIndex }) {
  const theme = useTheme();
  const { topExpenses } = data;

  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="The largest individual expenses recorded during the selected period.">
        Top expenses
      </SectionLabel>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '24px 72px 1fr auto',
          columnGap: 1.5,
          rowGap: 0,
          alignItems: 'center',
        }}
      >
        {['#', 'Date', 'Description', 'Amount'].map((h, i) => (
          <Typography
            key={h}
            sx={{
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'text.disabled',
              pb: 1,
              textAlign: i === 3 ? 'right' : 'left',
            }}
          >
            {h}
          </Typography>
        ))}

        {topExpenses.map((e, i) => (
          <Box key={e.id} sx={{ display: 'contents' }}>
            <Typography
              sx={{
                fontFamily: '"Roboto Mono", "Courier New", monospace',
                fontSize: '0.75rem',
                color: 'text.disabled',
                py: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              {i + 1}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                py: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              {e.date}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: 0,
                py: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Chip
                label={e.categoryLabel}
                size="small"
                sx={{
                  bgcolor: `${e.categoryColor}20`,
                  color: e.categoryColor,
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  height: 20,
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.82rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'text.primary',
                }}
              >
                {e.note}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: '"Roboto Mono", "Courier New", monospace',
                fontSize: '0.85rem',
                fontWeight: 700,
                textAlign: 'right',
                whiteSpace: 'nowrap',
                py: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              {money(e.amount)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
