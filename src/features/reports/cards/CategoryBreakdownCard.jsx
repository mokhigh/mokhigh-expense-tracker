import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { motion } from 'motion/react';
import { MotionBar, SectionLabel } from '../../dashboard/primitives.jsx';
import { cardMotion, getCardSx } from '../../dashboard/utils.js';

const money = (n) => `$${Math.round(n).toLocaleString()}`;
const PIE = 240;

export default function CategoryBreakdownCard({ data, motionIndex }) {
  const theme = useTheme();
  const { categoryBreakdown, total } = data;
  const pieData = categoryBreakdown.map((c) => ({
    id: c.id,
    value: c.total,
    label: c.label,
    color: c.color,
  }));

  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="Every category's spend for the selected period, with its share of the total, transaction count and average per transaction.">
        By category
      </SectionLabel>

      <Box
        sx={{
          display: 'flex',
          gap: { md: 4 },
          rowGap: 3,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ position: 'relative', width: PIE, height: PIE, mx: { xs: 'auto', md: 0 } }}>
          <PieChart
            series={[
              {
                data: pieData,
                innerRadius: 70,
                outerRadius: 110,
                paddingAngle: 2,
                cornerRadius: 4,
                cx: PIE / 2,
                cy: PIE / 2,
                highlightScope: { faded: 'global', highlighted: 'item' },
              },
            ]}
            width={PIE}
            height={PIE}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            slotProps={{ legend: { hidden: true } }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.62rem',
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              Total
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Roboto Mono", "Courier New", monospace',
                fontSize: '1.4rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {total >= 1000 ? `$${(total / 1000).toFixed(1)}K` : money(total)}
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled', mt: 0.25 }}>
              {categoryBreakdown.length} categories
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.5} sx={{ flex: 1, minWidth: 280 }}>
          {categoryBreakdown.map((c) => (
            <Box key={c.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  mb: 0.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      bgcolor: c.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.label}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '0.7rem', color: 'text.disabled', flexShrink: 0 }}
                  >
                    {c.count} · {money(c.avg)} avg
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
                    {money(c.total)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      minWidth: 42,
                      textAlign: 'right',
                    }}
                  >
                    {Math.round(c.pct)}%
                  </Typography>
                </Box>
              </Box>
              <MotionBar value={c.pct} color={c.color} bg={`${c.color}33`} />
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
