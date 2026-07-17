import Grid from '@mui/material/Grid2';
import { motion } from 'motion/react';
import { KpiTile } from '../../dashboard/primitives.jsx';
import { cardMotion } from '../../dashboard/utils.js';

const money = (n) => `$${Math.round(n).toLocaleString()}`;

export default function ReportKpis({ data, motionIndex = 1 }) {
  const { count, avgPerTxn, avgPerActiveDay, activeDays, spanDays, busiest, largest, granularity } =
    data;
  const peakLabel = granularity === 'month' ? 'Peak month' : 'Peak day';

  const tiles = [
    { value: count.toLocaleString(), label: 'Transactions' },
    { value: money(avgPerTxn), label: 'Avg / transaction' },
    { value: money(avgPerActiveDay), label: 'Avg / active day' },
    { value: `${activeDays}/${spanDays}`, label: 'Active days' },
    { value: money(busiest.total), label: `${peakLabel} · ${busiest.label}`, accent: '#7a8fff' },
    { value: money(largest?.amount ?? 0), label: 'Largest expense' },
  ];

  return (
    <Grid
      container
      spacing={1.5}
      component={motion.div}
      {...cardMotion(motionIndex)}
    >
      {tiles.map((t) => (
        <Grid key={t.label} size={{ xs: 6, sm: 4, md: 2 }} sx={{ display: 'flex' }}>
          <KpiTile value={t.value} label={t.label} accent={t.accent} />
        </Grid>
      ))}
    </Grid>
  );
}
