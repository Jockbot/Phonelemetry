import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Stack, Box } from '@mui/material'
import SweepChart from './DataSlidingGraph';
import Typography from '@mui/material/Typography';

export default function DataCard({ dataName, data, packetID }) {
  return (
    <Card sx={{ bgcolor: '#1A2027' }}>
      <CardContent>
        <Stack direction="row" spacing={16} alignItems="center">
          {/* Left: text */}
          <Box
            sx={{
              flexShrink: 0,
              minWidth: 240,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // vertical
              alignItems: 'center',     // horizontal
              alignSelf: 'stretch',     // take the full height of the row
            }}
          >
            <Typography gutterBottom variant="h5" component="div" color="myVar">
              {dataName}
            </Typography>
            <Typography variant="h6" color="myVar2">
              {data}
            </Typography>
          </Box>

          {/* Right: chart fills the remaining space */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <SweepChart value={data} packetId={packetID} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}