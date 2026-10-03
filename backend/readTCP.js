const net = require('net');
const fs = require('fs');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { stringify } = require('csv-stringify');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());

let client = null;
let csv = null;       // null = not recording
let csvFile = null;

const columns = [
  'deviceID', 'loggingTime', 'loggingSample', 'label',
  'accelX', 'accelY', 'accelZ', 'accelTimestamp',
  'latitude', 'longitude', 'speed'
];

function parseSample(raw) {
  return {
    accelX: parseFloat(raw.accelerometerAccelerationX),
    accelY: parseFloat(raw.accelerometerAccelerationY),
    accelZ: parseFloat(raw.accelerometerAccelerationZ),
    accelTimestamp: parseFloat(raw.accelerometerTimestamp_sinceReboot),
    deviceID: raw.deviceID,
    label: parseInt(raw.label, 10),
    latitude: parseFloat(raw.locationLatitude),
    longitude: parseFloat(raw.locationLongitude),
    speed: parseFloat(raw.locationSpeed),
    loggingSample: parseInt(raw.loggingSample, 10),
    loggingTime: new Date(raw.loggingTime)
  };
}

app.post('/api/submit', (req, res) => {
  const { ip, port } = req.body;

  if (client) client.destroy();

  client = net.createConnection({ host: ip, port: Number(port) });

  client.once('connect', () => res.json({ ok: true }));
  client.once('error', (err) => {
    if (!res.headersSent) res.status(502).json({ ok: false, error: err.message });
  });

  client.on('data', (chunk) => {
    try {
      const sensorData = parseSample(JSON.parse(chunk.toString()));
      if (csv) {
        csv.write({ ...sensorData, loggingTime: sensorData.loggingTime.toISOString() });
      }
      io.emit('sensorData', sensorData);
    } catch (err) {
      console.error('bad JSON:', chunk.toString(), err);
    }
  });

  client.on('error', (err) => console.error('tcp error:', err.message));
});

// Start recording: open a new CSV file
app.post('/api/startwrite', (req, res) => {
  if (!csv) {
    csvFile = `sensor_${Date.now()}.csv`;
    csv = stringify({ header: true, columns });
    csv.pipe(fs.createWriteStream(csvFile));
  }
  res.json({ recording: true, file: csvFile });
});

// Stop recording: close the CSV file
app.post('/api/stopwrite', (req, res) => {
  if (csv) {
    csv.end();
    csv = null;
  }
  res.json({ recording: false, file: csvFile });
});

// Lets the frontend check the current state on page load
app.get('/api/recording', (req, res) => {
  res.json({ recording: !!csv, file: csvFile });
});

server.listen(5000, () => console.log('Server on 127.0.0.1:5000'));