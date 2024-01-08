import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Box} from '@mui/material';

import ThemeProvider from '../utils/ThemeProvider';

/**
 * Main dasboard component, initializing a Material UI theme
 * https://mui.com/customization/theming/
 */
const Dashboard = (props) => {
  const {id, children, height} = props;

  // Enforce and reset a MUI-theme on the entire page
  // And display a dashboard on a full screen width
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <Box id={id} sx={{display: 'flex', flexDirection: 'column', height: height}}>
          {children}
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

Dashboard.defaultProps = {
  id: 'dashboard',
  height: '100vh'
};

Dashboard.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to render elements inside the component */
  children: PropTypes.node,

  /** Dashboard window height */
  height: PropTypes.string
};

export default Dashboard;
