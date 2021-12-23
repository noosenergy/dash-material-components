import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Box, CssBaseline} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/core/styles';

import theme from '../utils/theme';

/**
 * Main dasboard component, initializing a Material UI theme
 * https://mui.com/customization/theming/
 */
export default class Dashboard extends Component {
  render() {
    const {id, children, height} = this.props;

    // Enforce and reset a MUI-theme on the entire page
    // And display a dashboard on a full screen width
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box id={id} sx={{display: 'flex', flexDirection: 'column', height: height}}>
          {children}
        </Box>
      </ThemeProvider>
    );
  }
}

Dashboard.defaultProps = {
  id: 'dashboard',
  height: '100vh',
};

Dashboard.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to render elements inside the component */
  children: PropTypes.node,

  /** Dashboard window height */
  height: PropTypes.string,
};
