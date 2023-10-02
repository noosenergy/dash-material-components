import React from 'react';
import PropTypes from 'prop-types';
import {Box, AppBar, IconButton, Toolbar, Typography} from '@material-ui/core';
import NoosIcon from '../../fragments/NoosIcon';

/**
 * Dashboard navigation bar component
 * https://mui.com/components/app-bar/
 */
const NavBar = (props) => {
  const {id, title} = props;

  return (
    <Box id={id}>
      <AppBar position="static" elevation={4}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <NoosIcon viewBox="0 0 50 20" />
          </IconButton>
          <Typography variant="h1" component="h1">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

NavBar.defaultProps = {
  id: 'navbar'
};

NavBar.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Dashboard navigation bar title */
  title: PropTypes.string
};

export default NavBar;
