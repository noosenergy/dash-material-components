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
    return (
      // Enforce a theme on the entire page
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{display: 'flex', flexDirection: 'column'}}>{this.props.children}</Box>
      </ThemeProvider>
    );
  }
}

Dashboard.defaultProps = {
  children: null,
};

Dashboard.propTypes = {
  /** Can be used to render elements inside the component */
  children: PropTypes.node,
};
