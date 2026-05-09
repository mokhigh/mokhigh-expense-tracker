import { Stack, Typography, useTheme, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useDashboardData } from '../features/dashboard/useDashboardData.js';
import HeroCard from '../features/dashboard/cards/HeroCard.jsx';
import KpiStrip from '../features/dashboard/cards/KpiStrip.jsx';
import ByCategoryCard from '../features/dashboard/cards/ByCategoryCard.jsx';
import MonthlyTrendCard from '../features/dashboard/cards/MonthlyTrendCard.jsx';
import BudgetsCard from '../features/dashboard/cards/BudgetsCard.jsx';
import CumulativeSpendCard from '../features/dashboard/cards/CumulativeSpendCard.jsx';
import CategoryDeltasCard from '../features/dashboard/cards/CategoryDeltasCard.jsx';
import TopExpensesCard from '../features/dashboard/cards/TopExpensesCard.jsx';
import DailySpendCard from '../features/dashboard/cards/DailySpendCard.jsx';
import MonthCheckpointsCard from '../features/dashboard/cards/MonthCheckpointsCard.jsx';
import WeekdayPatternsCard from '../features/dashboard/cards/WeekdayPatternsCard.jsx';
import SpendingPaceCard from '../features/dashboard/cards/SpendingPaceCard.jsx';

export default function Dashboard() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const d = useDashboardData();

  const hero = (
    <HeroCard
      now={d.now}
      total={d.total}
      percentChange={d.percentChange}
      lastMonthDate={d.lastMonthDate}
      projection={d.projection}
    />
  );

  const kpiStrip = (
    <KpiStrip
      avgPerActiveDay={d.avgPerActiveDay}
      spendingDays={d.spendingDays}
      projection={d.projection}
      sixMonthAvg={d.sixMonthAvg}
      isDesktop={isDesktop}
    />
  );

  if (d.thisMonth.length === 0) {
    return (
      <Stack spacing={2.5}>
        {hero}
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No expenses this month.
        </Typography>
      </Stack>
    );
  }

  if (!isDesktop) {
    return (
      <Stack spacing={2.5}>
        {hero}
        {kpiStrip}
        {d.pieData.length > 0 && (
          <ByCategoryCard pieData={d.pieData} total={d.total} variant="mobile" motionIndex={2} />
        )}
        {d.hasHistory && (
          <MonthlyTrendCard
            monthlyHistory={d.monthlyHistory}
            maxMonthlyTotal={d.maxMonthlyTotal}
            motionIndex={3}
          />
        )}
        {d.budgetProgress.length > 0 && (
          <BudgetsCard budgetProgress={d.budgetProgress} variant="mobile" motionIndex={4} />
        )}
      </Stack>
    );
  }

  const gridItemSx = { display: 'flex', '& > *': { width: '100%', height: '100%' } };

  return (
    <Stack spacing={2}>
      {hero}
      <Grid container spacing={2} alignItems="stretch">
        {d.pieData.length > 0 && (
          <Grid size={{ xs: 12, md: 5 }} sx={gridItemSx}>
            <ByCategoryCard
              pieData={d.pieData}
              total={d.total}
              variant="desktop"
              motionIndex={1}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2}>
            <CumulativeSpendCard
              cumulativeData={d.cumulativeData}
              now={d.now}
              lastMonthDate={d.lastMonthDate}
              motionIndex={2}
            />
            {d.hasWeekdayData && (
              <WeekdayPatternsCard
                weekdayData={d.weekdayData}
                maxWeekday={d.maxWeekday}
                variant="horizontal"
                motionIndex={3}
              />
            )}
          </Stack>
        </Grid>

        {d.topExpenses.length > 0 && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={gridItemSx}>
            <TopExpensesCard topExpenses={d.topExpenses} motionIndex={4} />
          </Grid>
        )}
        {d.hasHistory && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={gridItemSx}>
            <MonthlyTrendCard
              monthlyHistory={d.monthlyHistory}
              maxMonthlyTotal={d.maxMonthlyTotal}
              motionIndex={5}
            />
          </Grid>
        )}
        {d.total > 0 && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={gridItemSx}>
            <MonthCheckpointsCard
              checkpointData={d.checkpointData}
              maxBy15={d.maxBy15}
              maxBy30={d.maxBy30}
              todayDay={d.todayDay}
              motionIndex={6}
            />
          </Grid>
        )}
        {d.hasLastMonth && d.categoryDeltas.length > 0 && (
          <Grid size={{ xs: 12, md: 4 }} sx={gridItemSx}>
            <CategoryDeltasCard
              categoryDeltas={d.categoryDeltas}
              lastMonthDate={d.lastMonthDate}
              motionIndex={7}
            />
          </Grid>
        )}
        {d.spendingDays.length > 0 && (
          <Grid size={{ xs: 12, md: 3 }} sx={gridItemSx}>
            <DailySpendCard
              spendingDays={d.spendingDays}
              maxDaySpend={d.maxDaySpend}
              motionIndex={8}
            />
          </Grid>
        )}
        {d.hasLastMonth && (
          <Grid size={{ xs: 12, md: 5 }} sx={gridItemSx}>
            <SpendingPaceCard
              cumulativeData={d.cumulativeData}
              todayDay={d.todayDay}
              now={d.now}
              lastMonthDate={d.lastMonthDate}
              motionIndex={9}
            />
          </Grid>
        )}
        {d.budgetProgress.length > 0 && (
          <Grid size={12} sx={gridItemSx}>
            <BudgetsCard
              budgetProgress={d.budgetProgress}
              variant="desktop"
              motionIndex={10}
            />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
}
