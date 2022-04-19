import React from 'react';

import {CssBaseline} from '@material-ui/core';
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles';

import theme from './theme';

const ThemeProvider = ({children}) => {
  // Enforce and reset a MUI-theme on the entire page
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
