import { useEffect, useRef, useState } from 'react';
import { Paper } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

const N = 200;   // packets visible per sweep
const GAP = 10;  // blank slots ahead of the cursor
const XS = Array.from({ length: N }, (_, i) => i);

export default function SweepChart({ value, packetId, yMin = -20, yMax = 20 }) {
  const buf = useRef(Array(N).fill(null));
  const cursor = useRef(0);
  const [data, setData] = useState(() => Array(N).fill(null));

  // Runs once per packet. packetId is the trigger, so repeated identical values still register.
  useEffect(() => {
    const n = Number(value);
    if (value == null || Number.isNaN(n)) return;

    const c = cursor.current;
    buf.current[c] = n;
    for (let g = 1; g <= GAP; g++) buf.current[(c + g) % N] = null;
    cursor.current = (c + 1) % N;   // wraps to 0 at the end
    setData([...buf.current]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packetId]);

  return (
    <Paper sx={{ width: 820, height: 320, p: 1 }}>
      <LineChart
        width={800}
        height={300}
        skipAnimation
        xAxis={[{ data: XS, scaleType: 'linear', min: 0, max: N - 1, label: 'Packet' }]}
        yAxis={[{ min: yMin, max: yMax, label: 'Acceleration (m/s²)' }]}
        series={[{ data, showMark: false, curve: 'linear', connectNulls: false }]}
      />
    </Paper>
  );
}