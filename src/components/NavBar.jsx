import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Box, AppBar, IconButton, Toolbar, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

import NoosIcon from '../fragments/NoosIcon.jsx';

const styles = (theme) => ({
  navTitle: {
    fontSize: '2rem',
    fontWeight: 700,
  },
});

/**
 * Dashboard navigation bar component
 * https://mui.com/components/app-bar/
 */
class NavBar extends Component {
  render() {
    const {classes, title} = this.props;

    return (
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{mx: 2}}>
              <NoosIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="h1"
              sx={{flexGrow: 1}}
              className={classes.navTitle}
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

export default withStyles(styles, {withTheme: true})(NavBar);
