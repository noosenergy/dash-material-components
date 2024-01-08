import React from 'react';

import {CssBaseline} from '@mui/material';
import {ThemeProvider as MuiThemeProvider, StyledEngineProvider} from '@mui/material/styles';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {frFR} from '@mui/x-date-pickers/locales';
import theme from './theme';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

const ThemeProvider = ({children}) => {
  // Enforce and reset a MUI-theme on the entire page
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          {children}
        </LocalizationProvider>
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeProvider;
