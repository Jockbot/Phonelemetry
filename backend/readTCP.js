const net = require('net');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const client = net.createConnection({ host: '10.0.0.74', port: 60604 });
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

function parseSample(raw) {
  return {
    accelX: parseFloat(raw.accelerometerAccelerationX),
    accelY: parseFloat(raw.accelerometerAccelerationY),
    accelZ: parseFloat(raw.accelerometerAccelerationZ),
    accelTimestamp: parseFloat(raw.accelerometerTimestamp_sinceReboot),
    deviceID: raw.deviceID,
    label: parseInt(raw.label, 10),
    loggingSample: parseInt(raw.loggingSample, 10),
    loggingTime: new Date(raw.loggingTime)
  };
}

client.on('data', (chunk) => {
  try {
    const sensorData = parseSample(JSON.parse(chunk.toString()));
    io.emit('sensorData', sensorData); // push to all connected clients
  } catch (err) {
    console.error('bad JSON:', chunk.toString(), err);
  }
});

server.listen(5000, () => console.log('Server on 127.0.0.1:5000'));