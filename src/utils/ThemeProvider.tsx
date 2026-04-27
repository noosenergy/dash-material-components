import React from 'react';

import {CssBaseline} from '@mui/material';
import {ThemeProvider as MuiThemeProvider} from '@mui/material/styles';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {frFR} from '@mui/x-date-pickers/locales';
import {theme as defaultTheme} from './theme';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {fr} from 'date-fns/locale';
import {createTheme, responsiveFontSizes, ThemeOptions} from '@mui/material/styles';
import {CacheProvider} from '@emotion/react';
import {createEmotionCache} from './createEmotionCache';

const ThemeProvider = ({
  children,
  theme: themeOverrides
}: {
  children: JSX.Element;
  theme: Record<string, unknown>;
}) => {
  let theme = createTheme({
    ...defaultTheme,
    ...themeOverrides
  } as ThemeOptions);
  theme = responsiveFontSizes(theme);

  const clientSideEmotionCache = createEmotionCache();

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={fr}
          localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          {children}
        </LocalizationProvider>
      </MuiThemeProvider>
    </CacheProvider>
  );
};

export default ThemeProvider;
