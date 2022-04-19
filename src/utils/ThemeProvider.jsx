import React from 'react';

import {CssBaseline} from '@material-ui/core';
import {
  createGenerateClassName,
  StylesProvider,
  ThemeProvider as MuiThemeProvider
} from '@material-ui/core/styles';

import theme from './theme';

const ThemeProvider = ({cssPrefix, children}) => {
  // Ensure to have a MUI theme with unique CSS class names
  // (allow several MUI apps loading on the same page)
  const generateClassName = createGenerateClassName({
    seed: cssPrefix
  });

  // Enforce and reset a MUI-theme on the entire page
  return (
    <StylesProvider generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </StylesProvider>
  );
};

export default ThemeProvider;
