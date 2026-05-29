import React, {useState} from 'react';
import {Box, Tab as MuiTab, Tabs} from '@mui/material';
import TabPanel from '../../fragments/TabPanel';
import {DashComponentProps} from 'props';

/**
 * Tab component
 * Dashboard > Page > Section > Card > Tab
 */
const Tab = ({id = 'tab', children, tabs}: TabProps) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, value: number) => {
    setSelectedTab(value);
  };

  const tabElements: JSX.Element[] = [];
  const tabpanelElements: JSX.Element[] = [];

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
    <Box id={id} display="flex" flexDirection="column" height="100%" width="100%">
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="card-tabs"
        selectionFollowsFocus
      >
        {tabElements}
      </Tabs>
      <Box flexGrow={1} pt={2}>
        {tabpanelElements}
      </Box>
    </Box>
  );
};

type TabProps = {
  /** Array of tabs to render as component children */
  tabs: Array<{
    /** Element label */
    label: string;
  }>;
} & DashComponentProps;

export default Tab;
