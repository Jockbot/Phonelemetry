import './App.css'
import InfoAddr from './components/GetSensorLog';
import DisplayInfomration from './components/DisplayInformation';
import { Box, Stack } from '@mui/material';
import PlotGPS from './components/PlotGPS';
import WriteButton from './components/WriteButton';


function App() {
  return(
    <div>
        <Box sx={{ margin : 4 }}>
          <Stack spacing={8}>
            <Stack direction={"row"} spacing={2}>
              <InfoAddr></InfoAddr>
              <WriteButton></WriteButton>
            </Stack>
            <PlotGPS></PlotGPS>
            <DisplayInfomration></DisplayInfomration>
          </Stack>
        </Box>
    </div>
  );
}
export default App