import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Box, AppBar, IconButton, Toolbar, Typography} from '@material-ui/core';

import DashboardIcon from '@material-ui/icons/Dashboard';

/**
 * Dashboard navigation bar component
 * https://mui.com/components/app-bar/
 */
 export default class NavBar extends Component {
  render() {
    const {title} = this.props;

    return (
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{mx: 2}}>
              <DashboardIcon />
            </IconButton>
            <Typography
              variant="h1"
              component="h1"
            >
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}

NavBar.defaultProps = {
  title: 'Neptune dashboard',
};

NavBar.propTypes = {
  /** Dashboard navigation bar title */
  title: PropTypes.string,
};
