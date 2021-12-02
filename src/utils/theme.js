import {createTheme, responsiveFontSizes} from '@material-ui/core/styles';

// A custom theme for this app
// https://mui.com/customization/default-theme/
// https://bareynol.github.io/mui-theme-creator/
let theme = createTheme({
  typography: {
    fontFamily: 'Roboto',
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
theme = responsiveFontSizes(theme);

export default theme;
