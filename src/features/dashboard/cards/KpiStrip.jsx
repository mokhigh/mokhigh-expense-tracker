import { Box } from '@mui/material';
import { motion } from 'motion/react';
import { KpiTile } from '../primitives.jsx';
import { cardMotion } from '../utils.js';

export default function KpiStrip({
  avgPerActiveDay,
  spendingDays,
  projection,
  sixMonthAvg,
  isDesktop,
}) {
  return (
    <Box
      component={motion.div}
      {...cardMotion(1)}
      sx={{ display: 'flex', gap: { xs: 1, md: 1.5 } }}
    >
      <KpiTile
        value={`$${avgPerActiveDay.toFixed(0)}`}
        label="Avg / active day"
        accent="#7a8fff"
      />
      <KpiTile value={spendingDays.length} label="Days active" />
      <KpiTile
        value={projection ? `$${Math.round(projection.projected).toLocaleString()}` : '—'}
        label="Projected"
        accent="#a78bfa"
      />
      {isDesktop && (
        <KpiTile
          value={sixMonthAvg ? `$${Math.round(sixMonthAvg).toLocaleString()}` : '—'}
          label="6-mo avg"
          accent="#34d399"
        />
      )}
    </Box>
  );
}
