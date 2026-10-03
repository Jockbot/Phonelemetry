import { useState } from "react";
import { Button } from '@mui/material';

export default function WriteButton() {
  const [recording, setRecording] = useState(false);

  const handleClick = async () => {
    const endpoint = recording ? "/api/stopwrite" : "/api/startwrite";
    const res = await fetch(endpoint, { method: "POST" });
    const data = await res.json();
    console.log(data);
    setRecording(data.recording);
  };

  return (
    <Button color="myVar2" variant="contained" onClick={handleClick}>
      {recording ? "Stop Recording" : "Start Recording"}
    </Button>
  );
}