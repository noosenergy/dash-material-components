import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Box, AppBar, IconButton, Toolbar, Typography } from '@mui/material';

import NoosIcon from '../fragments/NoosIcon.react';

/**
 * Dashboard navigation bar component
 * https://mui.com/components/app-bar/
 */
 export default class NavBar extends Component {

  render() {
    const {title} = this.props;

    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <NoosIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="h1"
              sx={{ flexGrow: 1 }}
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
