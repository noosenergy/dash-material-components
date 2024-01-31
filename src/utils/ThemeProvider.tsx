import React from 'react';

import {CssBaseline} from '@mui/material';
import {ThemeProvider as MuiThemeProvider} from '@mui/material/styles';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {frFR} from '@mui/x-date-pickers/locales';
import {theme as defaultTheme} from './theme';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {createTheme, responsiveFontSizes} from '@mui/material/styles';
import {Theme} from '@emotion/react';
import {CacheProvider} from '@emotion/react';
import {createEmotionCache} from './createEmotionCache';

const ThemeProvider = ({
  children,
  theme: themeOverrides
}: {
  children: JSX.Element;
  theme: Partial<Theme>;
}) => {
  // Enforce and reset a MUI-theme on the entire page
  let theme = createTheme({
    ...defaultTheme,
    ...themeOverrides
  } as Theme);
  theme = responsiveFontSizes(theme);

  const clientSideEmotionCache = createEmotionCache();

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          {children}
        </LocalizationProvider>
      </MuiThemeProvider>
    </CacheProvider>
  );
};

export default ThemeProvider;
