import React from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import ThemeProvider from '../utils/ThemeProvider';
import {DashComponentProps} from 'props';

/**
 * Main dashboard component, initializing a Material UI theme
 * https://mui.com/customization/theming/
 */
const Dashboard = ({id = 'dashboard', children, height = '100vh'}: DashboardProps) => {
  // Enforce and reset a MUI-theme on the entire page
  // And display a dashboard on a full screen width
  return (
    <ThemeProvider>
      <Box id={id} sx={{display: 'flex', flexDirection: 'column', height: height}}>
        {children}
      </Box>
    </ThemeProvider>
  );
};

type DashboardProps = {
  id?: string;
  /** Dashboard display height */
  height?: string;
} & DashComponentProps;

Dashboard.propTypes = {
  /** Unique ID to identify this component in Dash callbacks. */
  id: PropTypes.string,
  children: PropTypes.node,
  /** Dashboard display height */
  height: PropTypes.string
};

export default Dashboard;
