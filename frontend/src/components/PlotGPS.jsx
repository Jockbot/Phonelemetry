import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Paper, Box, Typography } from '@mui/material';

const socket = io('http://localhost:5000');

function FitRoute({ path }) {
  const map = useMap();
  useEffect(() => {
    if (path.length > 1) map.fitBounds(path, { padding: [40, 40] });
    else if (path.length === 1) map.setView(path[0], 16);
  }, [path, map]);
  return null;
}

function PlotGPS() {
  const [path, setPath] = useState([]);

  useEffect(() => {
    const handler = ({ latitude: lat, longitude: lng }) =>
      setPath((prev) => {
        const last = prev[prev.length - 1];
        if (last && last[0] === lat && last[1] === lng) return prev;
        return [...prev, [lat, lng]];
      });
    socket.on('sensorData', handler);
    return () => socket.off('sensorData', handler);
  }, []);

  const distanceM = useMemo(
    () =>
      path.reduce(
        (sum, p, i) => (i ? sum + L.latLng(path[i - 1]).distanceTo(L.latLng(p)) : 0),
        0
      ),
    [path]
  );

  const start = path[0];
  const end = path[path.length - 1];

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', gap: 4, p: 2, bgcolor: '#1A2027', color: "#FAF9F6"}}>
        <Box>
          <Typography variant="caption">Distance</Typography>
          <Typography variant="h6">{(distanceM / 1000).toFixed(2)} km</Typography>
        </Box>
        <Box>
          <Typography variant="caption">Points</Typography>
          <Typography variant="h6">{path.length}</Typography>
        </Box>
        <Box>
          <Typography variant="caption">Latitude</Typography>
          <Typography variant="h6">{end ? end[0].toFixed(6) : '—'}</Typography>
        </Box>
        <Box>
          <Typography variant="caption">Longitude</Typography>
          <Typography variant="h6">{end ? end[1].toFixed(6) : '—'}</Typography>
        </Box>
      </Box>

      <MapContainer
        center={[0, 0]}
        zoom={2}
        minZoom={1}
        maxZoom={19}
        zoomControl={false}
        style={{ height: 400, width: '100%' }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        {path.length > 1 && (
          <>
            <Polyline positions={path} pathOptions={{ color: '#fff', weight: 8, opacity: 0.9 }} />
            <Polyline positions={path} pathOptions={{ color: '#6a02fc', weight: 5 }} />
          </>
        )}
        {start && (
          <CircleMarker center={start} radius={7}
            pathOptions={{ color: '#fff', fillColor: '#2e044b', fillOpacity: 1, weight: 2 }} />
        )}
        {end && path.length > 1 && (
          <CircleMarker center={end} radius={7}
            pathOptions={{ color: '#fff', fillColor: '#6a02fc', fillOpacity: 1, weight: 2 }} />
        )}
        <FitRoute path={path} />
      </MapContainer>
    </Paper>
  );
}

export default PlotGPS;