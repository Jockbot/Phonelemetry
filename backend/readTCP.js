const net = require('net');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());

let client = null;

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

app.post('/api/submit', (req, res) => {
  const { ip, port } = req.body;

  if (client) client.destroy(); // drop any previous connection

  client = net.createConnection({ host: ip, port: Number(port) });

  client.once('connect', () => res.json({ ok: true }));
  client.once('error', (err) => {
    if (!res.headersSent) res.status(502).json({ ok: false, error: err.message });
  });

  client.on('data', (chunk) => {
    try {
      const sensorData = parseSample(JSON.parse(chunk.toString()));
      io.emit('sensorData', sensorData);
    } catch (err) {
      console.error('bad JSON:', chunk.toString(), err);
    }
  });

  client.on('error', (err) => console.error('tcp error:', err.message));
});

server.listen(5000, () => console.log('Server on 127.0.0.1:5000'));