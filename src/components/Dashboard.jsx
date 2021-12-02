import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Box, CssBaseline } from '@material-ui/core';
import { withStyles, ThemeProvider } from '@material-ui/core/styles';

import theme from '../utils/theme';

const styles = (theme) =>({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
});

/**
 * Main dasboard component, initializing a Material UI theme
 * https://mui.com/customization/theming/
 */
class Dashboard extends Component {

  render() {
    const { classes, children } = this.props;

    return (
      // Enforce a theme on the entire page
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box className={classes.root}>
          {children}
        </Box>
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

export default withStyles(styles, { withTheme: true })(Dashboard);
