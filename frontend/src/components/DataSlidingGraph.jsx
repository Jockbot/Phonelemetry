import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts/LineChart';

const N = 100;
const GAP = 10;
const XS = Array.from({ length: N }, (_, i) => i);

export default function SweepChart({ value, packetId, yMin = -10, yMax = 10 }) {
  const theme = useTheme();
  // works whether myVar is a full palette color ({ main: ... }) or a plain string
  const lineColor = theme.palette.myVar?.main ?? theme.palette.myVar ?? '#90caf9';

  const buf = useRef(Array(N).fill(null));
  const cursor = useRef(0);
  const [data, setData] = useState(() => Array(N).fill(null));

  useEffect(() => {
    const n = Number(value);
    if (value == null || Number.isNaN(n)) return;

    const c = cursor.current;
    buf.current[c] = n;
    for (let g = 1; g <= GAP; g++) buf.current[(c + g) % N] = null;
    cursor.current = (c + 1) % N;
    setData([...buf.current]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packetId]);

  return (
    <LineChart
      height={200}
      width={300}
      skipAnimation
      xAxis={[{ data: XS, scaleType: 'linear', min: 0, max: N - 1 }]}
      yAxis={[{ min: yMin, max: yMax }]}
      series={[{ data, color: "#6a02fc", showMark: false, curve: 'linear', connectNulls: false }]}
      sx={{
        '& .MuiChartsAxis-root .MuiChartsAxis-line, & .MuiChartsAxis-root .MuiChartsAxis-tick': {
          stroke: 'white',
        },
        '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel, & .MuiChartsAxis-root .MuiChartsAxis-label': {
          fill: 'white',
        },
      }}
    />
  );
}