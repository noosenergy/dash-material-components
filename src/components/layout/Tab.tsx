import React, {useState} from 'react';
import {Grid, Tab as MuiTab, Tabs} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import TabPanel from '../../fragments/TabPanel';
import {DashComponentProps} from 'props';

const useStyles = makeStyles(() => ({
  tabLayout: {
    height: '100%',
    width: '100%'
  }
}));

/**
 * Tab component
 * Dashboard > Page > Section > Card > Tab
 * https://github.com/danielfrg/jupyter-flex/blob/main/js/src/Section/index.js
 */
const Tab = ({id = 'tab', children, tabs}: TabProps) => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_: React.ChangeEvent, value: number) => {
    setSelectedTab(value);
  };

  const tabElements: JSX.Element[] = [];
  const tabpanelElements: JSX.Element[] = [];

  // Fetch cards or tabs
  if (children && tabs) {
    React.Children.forEach(children, (child, i) => {
      tabpanelElements.push(
        <TabPanel key={i} value={selectedTab} index={i}>
          {child}
        </TabPanel>
      );
      tabElements.push(<MuiTab key={i} label={tabs[i].label} />);
    });
  }

  return (
    <Grid id={id} container direction="column" className={classes.tabLayout} spacing={2}>
      <Grid
        item
        component={Tabs}
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        aria-label="card-tabs"
        selectionFollowsFocus
      >
        {tabElements}
      </Grid>
      <Grid item xs>
        {tabpanelElements}
      </Grid>
    </Grid>
  );
};

// TypeScript props type
type TabProps = {
  /** Array of tabs to render as component children */
  tabs: Array<{
    /** Element label */
    label: string;
  }>;
} & DashComponentProps;

export default Tab;
