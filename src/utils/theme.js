import { createTheme } from '@mui/material/styles';

// A custom theme for this app
// https://mui.com/customization/default-theme/
// https://bareynol.github.io/mui-theme-creator/
const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    type: 'light',
    primary: {
      main: '#151515',
      contrastText: '#FAC505',
    },
    secondary: {
      main: '#E9E9E9',
    },
    background: {
      paper: '#FFFFFF',
      default: '#E9E9E9',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#151515',
      disabled: '#C7C7C7',
    },
    error: {
      main: '#721C24',
    },
  },
});

export default theme;
