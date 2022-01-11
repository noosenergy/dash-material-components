import {createTheme, responsiveFontSizes} from '@material-ui/core/styles';

// A custom theme for this app
// https://mui.com/customization/default-theme/
// https://bareynol.github.io/mui-theme-creator/
let theme = createTheme({
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
      primary: '#151515',
      disabled: '#C7C7C7',
    },
    error: {
      main: '#721C24',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.4rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.9rem',
    },
    button: {
      textTransform: 'none',
    },
  },
});

theme.overrides = {
  MuiChip: {
    root: {
      color: 'rgba(0, 0, 0, 0.54)',
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
  },
  MuiInputLabel: {
    root: {
      color: 'rgba(0, 0, 0, 0.38)',
      '&$focused': {
        color: 'rgba(0, 0, 0, 0.54)',
      },
    },
  },
  MuiListItem: {
    root: {
      color: 'rgba(0, 0, 0, 0.38)',
      '&$selected': {
        color: 'rgba(0, 0, 0, 0.54)',
      },
    },
  },
  MuiOutlinedInput: {
    root: {
      '& $notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.15)',
      },
      '&:hover $notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.54)',
      },
      '&$focused $notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.54)',
        borderWidth: 1,
      },
    },
  },
};

theme = responsiveFontSizes(theme);

export default theme;
