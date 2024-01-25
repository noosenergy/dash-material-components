import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {DashComponentProps} from 'props';

const useStyles = makeStyles(() => ({
  tabpanelLayout: {
    height: '100%'
  },
  tabpanelContentLayout: {
    height: '100%'
  }
}));

const TabPanel = ({children, value, index}: TabPanelProps) => {
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`card-tabpanel-${index}`}
      className={classes.tabpanelLayout}
    >
      {value === index && <div className={classes.tabpanelContentLayout}>{children}</div>}
    </div>
  );
};

type TabPanelProps = {
  // Current index of the TabPanel
  index: number;
  // Currently selected tab index
  value: number;
} & Partial<DashComponentProps>;

export default TabPanel;
