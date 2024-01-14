import React from 'react';
import PropTypes from 'prop-types';
import {Box, AppBar, IconButton, Toolbar, Typography} from '@mui/material';
import NoosIcon from '../../fragments/NoosIcon';
import {DashComponentProps} from 'props';

/**
 * Dashboard navigation bar component
 * https://mui.com/components/app-bar/
 */
const NavBar = ({id = 'navbar', title}: NavBarProps) => {
  return (
    <Box id={id}>
      <AppBar position="static" elevation={4}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" size="large">
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

// TypeScript props type
type NavBarProps = {
  /** Dashboard navigation bar title */
  title?: string;
} & DashComponentProps;

// PropTypes for runtime type checking
NavBar.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Dashboard navigation bar title */
  title: PropTypes.string
};

// Default props
NavBar.defaultProps = {};

export default NavBar;
