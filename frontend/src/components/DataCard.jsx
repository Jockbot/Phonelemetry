import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Box, Typography, Tabs, Tab } from '@mui/material';
import SweepChart from './DataSlidingGraph';

const TAB_LABELS = ['Current', 'Average', 'Max'];

// Shared padding so content sits the same distance from every edge
const PANEL_PADDING = 2; // 2 * 8px = 16px

// One height for the content area, so the card doesn't jump when switching tabs
const CONTENT_HEIGHT = 200;

// Format any reading to 2 decimals, or a dash if it isn't a number yet
const format = (v) => {
  const n = Number(v);
  return v == null || !Number.isFinite(n) ? '—' : n.toFixed(2);
};

export default function DataCard({ dataName, data, packetID }) {
  const [tab, setTab] = useState(0);

  // Running stats: keep the sum and count so the average is cheap to compute
  const [stats, setStats] = useState({ sum: 0, count: 0, max: -Infinity });
  const lastPacket = useRef(null);

  // Update stats once per new packet
  useEffect(() => {
    if (packetID === lastPacket.current) return; // same packet, already counted
    lastPacket.current = packetID;

    const value = Number(data);
    if (!Number.isFinite(value)) return; // ignore missing/garbage readings

    setStats((prev) => ({
      sum: prev.sum + value,
      count: prev.count + 1,
      max: Math.max(prev.max, value),
    }));
  }, [packetID, data]);

  const hasData = stats.count > 0;
  const tabValues = [
    format(data),
    hasData ? format(stats.sum / stats.count) : '—',
    hasData ? format(stats.max) : '—',
  ];

  const showChart = tab === 0; // "Current" tab

  return (
    <Card sx={{ bgcolor: '#1A2027', width: '100%' }}>
      {/* MUI adds extra bottom padding to the last CardContent; override it so all sides match */}
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        {/* Top bar: name on the left, tabs on the right */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            px: PANEL_PADDING,
            pt: 1,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            color="myVar"
            noWrap
            sx={{ minWidth: 0 }} // lets a long name truncate instead of pushing the tabs off
          >
            {dataName}
          </Typography>

          <Tabs
            value={tab}
            onChange={(event, newValue) => setTab(newValue)}
            sx={{
              flexShrink: 0,
              minHeight: 32,
              '& .MuiTabs-flexContainer': { gap: 1 }, // equal space between tabs
              '& .MuiTab-root': {
                minWidth: 0,
                minHeight: 32,
                px: 1,
                py: 0.5,
                color: 'rgba(250, 249, 246, 0.6)',
              },
              '& .MuiTab-root.Mui-selected': { color: '#FAF9F6' },
            }}
          >
            {TAB_LABELS.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Box>

        {/* Content area: same size for every tab */}
        <Box sx={{ p: PANEL_PADDING, position: 'relative', height: CONTENT_HEIGHT }}>
          {/* The chart stays mounted on every tab so it keeps recording;
              it's only hidden when Average or Max is selected */}
          <Box sx={{ display: showChart ? 'block' : 'none', height: '100%' }}>
            <SweepChart value={data} packetId={packetID} height={CONTENT_HEIGHT} margin={{ left : 5}}/>
          </Box>

          {showChart ? (
            // Current value pinned to the chart's top-right corner
            <Typography
              variant="h6"
              color="myVar2"
              sx={{
                position: 'absolute',
                top: (theme) => theme.spacing(PANEL_PADDING),
                right: (theme) => theme.spacing(PANEL_PADDING),
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                pointerEvents: 'none', // don't block the chart's tooltip
              }}
            >
              {tabValues[0]}
              <Typography component="span" variant="body2" sx={{ ml: 0.5, opacity: 0.7 }}>
                m/s²
              </Typography>
            </Typography>
          ) : (
            // Average / Max: just the number, centered
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h3"
                color="myVar2"
                sx={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {tabValues[tab]}
                <Typography component="span" variant="body2" sx={{ ml: 0.5, opacity: 0.7 }}>
                  m/s²
                </Typography>
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}