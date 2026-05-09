import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { motion } from 'motion/react';
import { MotionBar, SectionLabel } from '../primitives.jsx';
import { cardMotion, getCardSx } from '../utils.js';

export default function ByCategoryCard({ pieData, total, variant, motionIndex }) {
  const theme = useTheme();
  const isMobile = variant === 'mobile';
  const pieSize = isMobile ? 140 : 240;
  const innerR = isMobile ? 42 : 70;
  const outerR = isMobile ? 64 : 110;
  const center = pieSize / 2;
  const items = isMobile ? pieData.slice(0, 4) : pieData;

  return (
    <Paper component={motion.div} {...cardMotion(motionIndex)} sx={getCardSx(theme)}>
      <SectionLabel info="How this month's spend is split across your categories. The percentage shows each category's share of the total.">
        By category
      </SectionLabel>
      <Box
        sx={
          isMobile
            ? { display: 'flex', alignItems: 'center', gap: 2 }
            : { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }
        }
      >
        <Box
          sx={{
            position: 'relative',
            ...(isMobile
              ? { flex: `0 0 ${pieSize}px`, height: pieSize }
              : { width: pieSize, height: pieSize }),
          }}
        >
          <PieChart
            series={[
              {
                data: pieData,
                innerRadius: innerR,
                outerRadius: outerR,
                paddingAngle: 2,
                cornerRadius: 4,
                cx: center,
                cy: center,
                highlightScope: { faded: 'global', highlighted: 'item' },
              },
            ]}
            width={pieSize}
            height={pieSize}
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
                fontSize: isMobile ? '0.55rem' : '0.62rem',
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: isMobile ? '0.1em' : '0.12em',
                lineHeight: isMobile ? undefined : 1.4,
              }}
            >
              Total
            </Typography>
            <Typography
              sx={{
                fontFamily: isMobile
                  ? undefined
                  : '"Roboto Mono", "Courier New", monospace',
                fontSize: isMobile ? '0.9rem' : '1.4rem',
                fontWeight: 700,
                lineHeight: isMobile ? undefined : 1.1,
                color: 'text.primary',
                letterSpacing: isMobile ? undefined : '-0.02em',
              }}
            >
              $
              {total >= 1000
                ? isMobile
                  ? `${Math.round(total / 1000)}K`
                  : `${(total / 1000).toFixed(1)}K`
                : Math.round(total)}
            </Typography>
          </Box>
        </Box>

        <Stack
          spacing={isMobile ? 1.25 : 1.5}
          sx={isMobile ? { flex: 1, minWidth: 0 } : { alignSelf: 'stretch', minWidth: 0 }}
        >
          {items.map((d) => {
            const pct = Math.round((d.value / total) * 100);
            return (
              <Box key={d.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 0.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 9,
                        height: 9,
                        borderRadius: '50%',
                        bgcolor: d.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: isMobile ? '0.82rem' : '0.85rem',
                        fontWeight: 500,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {d.label}
                    </Typography>
                  </Box>
                  {isMobile ? (
                    <Typography
                      sx={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: 'text.primary',
                        ml: 1,
                        flexShrink: 0,
                      }}
                    >
                      {pct}%
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        ml: 1,
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: '"Roboto Mono", "Courier New", monospace',
                          fontSize: '0.78rem',
                          color: 'text.secondary',
                        }}
                      >
                        ${Math.round(d.value).toLocaleString()}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'text.primary',
                          minWidth: 32,
                          textAlign: 'right',
                        }}
                      >
                        {pct}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                <MotionBar value={pct} color={d.color} bg={`${d.color}33`} />
              </Box>
            );
          })}
          {isMobile && pieData.length > 4 && (
            <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>
              +{pieData.length - 4} more
            </Typography>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
