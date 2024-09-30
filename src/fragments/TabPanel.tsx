import React from 'react';
import {DashComponentProps} from 'props';
import {Box} from '@mui/material';

/**
 * TabPanel component
 */
const TabPanel = ({children, value, index}: TabPanelProps) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`card-tabpanel-${index}`}
      height={'100%'}
    >
      {value === index && <Box height={'100%'}>{children}</Box>}
    </Box>
  );
};

type TabPanelProps = {
  // Current index of the TabPanel
  index: number;
  // Currently selected tab index
  value: number;
} & Partial<DashComponentProps>;

export default TabPanel;
