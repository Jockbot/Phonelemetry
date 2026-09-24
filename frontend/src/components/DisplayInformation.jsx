import { Paper, styled, Grid } from '@mui/material';
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import DataCard from './DataCard';

const socket = io('http://localhost:5000');


function DisplayInformation() {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    socket.on('sensorData', (data) => {
      setSensorData(data);
    });

    return () => {
      socket.off('sensorData');
    };
  }, []);

  return (
    <div>
      {sensorData ? (
        <Grid container spacing={4}>
            <Grid size={6}>
                <DataCard dataName={"Acceleration in X"} data={sensorData?.accelX}></DataCard>
            </Grid>
            <Grid size={6}>
                <DataCard dataName={"Acceleration in Y"} data={sensorData?.accelY}></DataCard>
            </Grid>
            <Grid size={6}>
                <DataCard dataName={"Acceleration in Z"} data={sensorData?.accelZ}></DataCard>
            </Grid>
            <Grid size={6}>
                <DataCard dataName={"Acceleration in X"} data={sensorData?.accelX}></DataCard>
            </Grid>
        </Grid>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}

export default DisplayInformation
