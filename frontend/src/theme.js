import { createTheme } from "@mui/material";

const base = createTheme();

const theme = createTheme({
  palette: {
    myVar: base.palette.augmentColor({
      color: {
         main: "#FAF9F6"
         },
      name: "myVar",
    }),
    myVar2: base.palette.augmentColor({
      color: {
         main: "#CCC"
         },
      name: "myVar2",
    }),
  },
});

export default theme;