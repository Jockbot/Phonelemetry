import './App.css'
import InfoAddr from './components/GetSensorLog';
import DisplayInfomration from './components/DisplayInformation';
import { Box, Stack } from '@mui/material';
import PlotGPS from './components/PlotGPS';


function App() {
  return(
    <div>
        <Box sx={{ margin : 4 }}>
          <Stack spacing={8}>
            <InfoAddr></InfoAddr>
            <PlotGPS></PlotGPS>
            <DisplayInfomration></DisplayInfomration>
          </Stack>
        </Box>
    </div>
  );
}
export default App