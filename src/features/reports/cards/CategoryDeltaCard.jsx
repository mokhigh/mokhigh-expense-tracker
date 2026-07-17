import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { SectionLabel } from '../../dashboard/primitives.jsx';
import { cardMotion, getCardSx } from '../../dashboard/utils.js';

const money = (n) => `$${Math.round(n).toLocaleString()}`;

function DeltaPill({ delta, abs }) {
  if (delta === null) {
    return (
      <Box
        sx={{
          px: 1,
          py: 0.25,
          borderRadius: 10,
          fontSize: '0.68rem',
          fontWeight: 700,
          bgcolor: 'rgba(122,143,255,0.14)',
          color: '#7a8fff',
          whiteSpace: 'nowrap',
        }}
      >
        NEW
      </Box>
    );
  }
  const up = abs >= 0;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.3,
        px: 1,
        py: 0.25,
        borderRadius: 10,
        fontFamily: '"Roboto Mono", "Courier New", monospace',
        fontSize: '0.68rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        bgcolor: up ? 'rgba(248,113,113,0.12)' : 'rgba(74,222,128,0.12)',
        color: up ? '#f87171' : '#4ade80',
      }}
    >
      {up ? '▲' : '▼'} {up ? '+' : ''}
      {Math.round(delta)}%
    </Box>
  );
}

export default function CategoryDeltaCard({ data, motionIndex }) {
  const theme = useTheme();
  const rows = data.categoryDeltas.slice(0, 8);

  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="How each category's spend changed versus the previous window of equal length. Green means you spent less, red means more.">
        Category change
      </SectionLabel>
      <Stack spacing={1.25}>
        {rows.map((c) => (
          <Box
            key={c.id}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Box
                sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: c.color, flexShrink: 0 }}
              />
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.label}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
              <Typography
                sx={{
                  fontFamily: '"Roboto Mono", "Courier New", monospace',
                  fontSize: '0.8rem',
                  color: 'text.secondary',
                }}
              >
                {money(c.current)}
              </Typography>
              <DeltaPill delta={c.delta} abs={c.abs} />
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
