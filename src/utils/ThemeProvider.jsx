import React from 'react';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import {CssBaseline} from '@mui/material';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {ThemeProvider as MuiThemeProvider, StyledEngineProvider} from '@mui/material/styles';

import theme from './theme';

const ThemeProvider = ({children}) => {
  // Enforce and reset a MUI-theme on the entire page
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>{children}</MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeProvider;
