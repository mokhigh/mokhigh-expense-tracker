import { Box, ButtonBase, Typography } from '@mui/material';
import { motion } from 'motion/react';
import { RANGE_PRESETS } from '../ranges.js';

export default function ReportControls({ value, onChange }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: 0.25,
        p: 0.5,
        borderRadius: '100px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {RANGE_PRESETS.map((p) => {
        const active = p.key === value;
        return (
          <ButtonBase
            key={p.key}
            onClick={() => onChange(p.key)}
            disableRipple
            sx={{ borderRadius: '100px' }}
          >
            <Box
              sx={{
                position: 'relative',
                px: 1.75,
                py: 0.6,
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {active && (
                <Box
                  component={motion.div}
                  layoutId="report-range-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '100px',
                    bgcolor: 'primary.main',
                  }}
                />
              )}
              <Typography
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  color: active ? 'background.default' : 'text.secondary',
                  transition: 'color 0.2s ease',
                }}
              >
                {p.label}
              </Typography>
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
