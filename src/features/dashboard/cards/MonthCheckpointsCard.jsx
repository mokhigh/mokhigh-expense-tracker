import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import { MotionBar, SectionLabel, SubLabel } from '../primitives.jsx';
import { cardMotion, getCardSx } from '../utils.js';

function CheckpointGroup({ data, accessor, max, accent }) {
  const theme = useTheme();
  return (
    <Stack spacing={1.5}>
      {data.map((c) => {
        const value = accessor(c);
        const pct = Math.round((value / max) * 100);
        return (
          <Box key={c.key + accessor.tag}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography
                sx={{
                  fontSize: '0.82rem',
                  fontWeight: c.isCurrent ? 700 : 400,
                  color: c.isCurrent ? 'text.primary' : 'text.secondary',
                }}
              >
                {c.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Roboto Mono", "Courier New", monospace',
                  fontSize: '0.82rem',
                  fontWeight: c.isCurrent ? 700 : 400,
                  color: c.isCurrent ? 'text.primary' : 'text.secondary',
                }}
              >
                {value > 0 ? `$${Math.round(value).toLocaleString()}` : '—'}
              </Typography>
            </Box>
            <MotionBar
              value={pct}
              color={
                c.isCurrent
                  ? accent
                  : theme.palette.mode === 'dark'
                    ? '#4b5563'
                    : '#9ca3af'
              }
              bg={
                c.isCurrent
                  ? accent === '#a78bfa'
                    ? 'rgba(167,139,250,0.12)'
                    : 'rgba(245,158,11,0.12)'
                  : 'rgba(107,114,128,0.08)'
              }
            />
          </Box>
        );
      })}
    </Stack>
  );
}

const by15 = (c) => c.by15;
by15.tag = '-15';
const by30 = (c) => c.by30;
by30.tag = '-30';

export default function MonthCheckpointsCard({
  checkpointData,
  maxBy15,
  maxBy30,
  todayDay,
  motionIndex,
}) {
  const theme = useTheme();
  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="Where you stood by day 15 and day 30 in each of the last 4 months. Useful for spotting whether you front-load or back-load your spending.">
        Month checkpoints
      </SectionLabel>

      <SubLabel>By day 15</SubLabel>
      <Box sx={{ mb: 3 }}>
        <CheckpointGroup data={checkpointData} accessor={by15} max={maxBy15} accent="#a78bfa" />
      </Box>

      <SubLabel>By day 30{todayDay < 30 ? ' · in progress' : ''}</SubLabel>
      <CheckpointGroup data={checkpointData} accessor={by30} max={maxBy30} accent="#f59e0b" />
    </Paper>
  );
}
