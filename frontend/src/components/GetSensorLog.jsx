import { useState } from "react";
import { TextField, Button, Stack } from '@mui/material';

export default function InfoAddr() {
  const [addr, setAddr] = useState({ ip: "", port: "" });

  const handleChange = (e) =>
    setAddr({ ...addr, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addr),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
  <Stack component="form" onSubmit={handleSubmit} direction={"row"} spacing={2}>
    <TextField
      color="myVar"
      id="ip"
      name="ip"
      label="IP Address"
      variant="standard"
      value={addr.ip}
      onChange={handleChange}
      sx={{
        '& .MuiInputLabel-root': { color: 'myVar.main' },
        '& .MuiInputBase-input': { color: 'myVar.main' },
        '& .MuiInput-underline:before': { borderBottomColor: 'myVar.main' },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'myVar.main' },
      }}
    />
    <TextField
      color="myVar"
      id="port"
      name="port"
      label="Port"
      variant="standard"
      value={addr.port}
      onChange={handleChange}
      sx={{
        '& .MuiInputLabel-root': { color: 'myVar.main' },
        '& .MuiInputBase-input': { color: 'myVar.main' },
        '& .MuiInput-underline:before': { borderBottomColor: 'myVar.main' },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'myVar.main' },
      }}
    />
    <Button color="myVar2" type="submit" variant="contained">Send</Button>
  </Stack>
);
}