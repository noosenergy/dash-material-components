import React from 'react';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import {CssBaseline} from '@material-ui/core';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles';

import theme from './theme';

const ThemeProvider = ({children}) => {
  // Enforce and reset a MUI-theme on the entire page
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>{children}</MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
