import { useState } from 'react';
import { Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import { useReportData } from '../features/reports/useReportData.js';
import { DEFAULT_RANGE } from '../features/reports/ranges.js';
import ReportControls from '../features/reports/cards/ReportControls.jsx';
import ReportHeaderCard from '../features/reports/cards/ReportHeaderCard.jsx';
import ReportKpis from '../features/reports/cards/ReportKpis.jsx';
import SpendTrendCard from '../features/reports/cards/SpendTrendCard.jsx';
import CategoryBreakdownCard from '../features/reports/cards/CategoryBreakdownCard.jsx';
import CumulativeCard from '../features/reports/cards/CumulativeCard.jsx';
import TopExpensesCard from '../features/reports/cards/TopExpensesCard.jsx';
import WeekdayCard from '../features/reports/cards/WeekdayCard.jsx';
import CategoryDeltaCard from '../features/reports/cards/CategoryDeltaCard.jsx';

const stretch = { display: 'flex', '& > *': { width: '100%', height: '100%' } };

function DesktopOnlyNotice() {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', mt: 8, px: 3 }}>
      <DesktopWindowsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Reports open on desktop
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 320 }}>
        The full spending report is designed for a larger screen. Open the app on your laptop to
        explore it. On the go, the Dashboard has your key numbers.
      </Typography>
    </Stack>
  );
}

export default function Reports() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [range, setRange] = useState(DEFAULT_RANGE);
  const data = useReportData(range);

  if (!isDesktop) return <DesktopOnlyNotice />;

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          Reports
        </Typography>
        <ReportControls value={range} onChange={setRange} />
      </Box>

      <ReportHeaderCard data={data} />

      {data.isEmpty ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No expenses recorded in this period.
        </Typography>
      ) : (
        <>
          <ReportKpis data={data} motionIndex={1} />

          <Grid container spacing={2} alignItems="stretch">
            <Grid size={12} sx={stretch}>
              <SpendTrendCard data={data} motionIndex={2} />
            </Grid>

            <Grid size={12} sx={stretch}>
              <CategoryBreakdownCard data={data} motionIndex={3} />
            </Grid>

            <Grid size={{ xs: 12, md: 7 }} sx={stretch}>
              <CumulativeCard data={data} motionIndex={4} />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={stretch}>
              <WeekdayCard data={data} motionIndex={5} />
            </Grid>

            <Grid size={{ xs: 12, md: 7 }} sx={stretch}>
              <TopExpensesCard data={data} motionIndex={6} />
            </Grid>
            {data.categoryDeltas.length > 0 && (
              <Grid size={{ xs: 12, md: 5 }} sx={stretch}>
                <CategoryDeltaCard data={data} motionIndex={7} />
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Stack>
  );
}
