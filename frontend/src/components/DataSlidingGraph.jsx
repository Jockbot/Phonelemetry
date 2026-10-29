import { useEffect, useMemo, useRef, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

/**
 * Oscilloscope-style sweep chart: new values are written left to right,
 * wrapping around, with a blank gap in front of the cursor.
 *
 * Props (all optional except value/packetId):
 *   points     how many samples fit across the chart        (default 100)
 *   gap        blank samples ahead of the cursor             (default 10)
 *   height     chart height in px; width fills the parent    (default 200)
 *   yMin/yMax  fixed y-axis range; leave out to auto-scale
 *   color      line color                                    (default '#6a02fc')
 *   axisColor  color of axis lines, ticks and labels         (default 'white')
 *   lineWidth  stroke width of the line                      (default 2)
 *   margin     chart margins, e.g. { top: 10, right: 10, bottom: 20, left: 40 }
 *   ...rest    anything else is passed straight to <LineChart>
 */
export default function SweepChart({
  value,
  packetId,
  points = 100,
  gap = 10,
  height = 200,
  yMin,
  yMax,
  color = '#6a02fc',
  axisColor = 'white',
  lineWidth = 2,
  margin,
  sx,
  ...rest
}) {
  // Gap can't be bigger than the chart itself
  const safeGap = Math.min(Math.max(gap, 0), points - 1);

  const xs = useMemo(() => Array.from({ length: points }, (_, i) => i), [points]);

  const buf = useRef([]);
  const cursor = useRef(0);
  const lastPacket = useRef(undefined);
  const [data, setData] = useState(() => Array(points).fill(null));

  // (Re)create the buffer whenever the number of points changes
  useEffect(() => {
    buf.current = Array(points).fill(null);
    cursor.current = 0;
    setData([...buf.current]);
  }, [points]);

  // Write each new packet's value at the cursor
  useEffect(() => {
    if (packetId === lastPacket.current) return; // already plotted this packet
    lastPacket.current = packetId;

    const n = Number(value);
    if (value == null || !Number.isFinite(n)) return;

    const c = cursor.current;
    buf.current[c] = n;
    for (let g = 1; g <= safeGap; g++) buf.current[(c + g) % points] = null;
    cursor.current = (c + 1) % points;
    setData([...buf.current]);
    // value is read when a new packet arrives; packetId is the trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packetId, points, safeGap]);

  return (
    <LineChart
      // No width prop: the chart fills its parent's width automatically
      height={height}
      margin={margin}
      skipAnimation
      xAxis={[{ data: xs, scaleType: 'linear', min: 0, max: points - 1 }]}
      // undefined min/max means MUI picks the range from the data
      yAxis={[{ min: yMin, max: yMax }]}
      series={[{ data, color, showMark: false, curve: 'linear', connectNulls: false }]}
      sx={[
        {
          '& .MuiChartsAxis-root .MuiChartsAxis-line, & .MuiChartsAxis-root .MuiChartsAxis-tick': {
            stroke: axisColor,
          },
          '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel, & .MuiChartsAxis-root .MuiChartsAxis-label': {
            fill: axisColor,
          },
          '& .MuiLineElement-root': { strokeWidth: lineWidth },
        },
        // Let the caller's sx add to or override the defaults above
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
}