import { Box, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { motion } from 'motion/react';
import { EASE } from './utils.js';

export function MotionBar({ value, color, bg, height = 3 }) {
  return (
    <Box sx={{ height, borderRadius: 2, bgcolor: bg, overflow: 'hidden' }}>
      <Box
        component={motion.div}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        sx={{ height: '100%', bgcolor: color, borderRadius: 2 }}
      />
    </Box>
  );
}

export function InfoTip({ title }) {
  if (!title) return null;
  return (
    <Tooltip
      title={title}
      arrow
      enterTouchDelay={0}
      leaveTouchDelay={4000}
      slotProps={{
        tooltip: {
          sx: {
            fontSize: '0.72rem',
            lineHeight: 1.4,
            maxWidth: 240,
            px: 1.25,
            py: 0.85,
          },
        },
      }}
    >
      <InfoOutlinedIcon
        sx={{
          fontSize: '0.95rem',
          color: 'text.disabled',
          cursor: 'help',
          '&:hover': { color: 'text.secondary' },
          transition: 'color 0.15s ease',
        }}
      />
    </Tooltip>
  );
}

export function SectionLabel({ children, info, sx = {} }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        mb: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'text.secondary',
          ...sx,
        }}
      >
        {children}
      </Typography>
      <InfoTip title={info} />
    </Box>
  );
}

export function SubLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: '0.58rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'text.disabled',
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

export function KpiTile({ value, label, accent }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        px: 1.5,
        py: 1.25,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Roboto Mono", "Courier New", monospace',
          fontSize: { xs: '1.05rem', md: '1.35rem' },
          fontWeight: 700,
          lineHeight: 1,
          color: accent ?? 'text.primary',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.58rem',
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          mt: 0.75,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
