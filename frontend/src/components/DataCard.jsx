import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SweepChart from './DataSlidingGraph';
import Typography from '@mui/material/Typography';

export default function DataCard({ dataName, data, packetID }) {
  return (
    <Card sx={{ bgcolor: '#1A2027'}}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" color="myVar">
          {dataName}
        </Typography>
        <Typography variant="h6" color="myVar2">
          {data}
        </Typography>
        <SweepChart value={data} packetId={packetID}></SweepChart>
      </CardContent>
    </Card>
  );
}