import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const socket = io('http://localhost:5000');

function App() {
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
        <pre>{JSON.stringify(sensorData, null, 2)}</pre>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}

export default App