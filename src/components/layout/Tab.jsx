import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Grid, Tab as MuiTab, Tabs} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import TabPanel from '../../fragments/TabPanel';

const styles = (theme) => ({
  tabLayout: {
    height: '100%',
    width: '100%'
  }
});

/**
 * Tab component
 * Dashboard > Page > Section > Card > Tab
 * https://github.com/danielfrg/jupyter-flex/blob/main/js/src/Section/index.js
 */
const Tab = (props) => {
  const {classes, id, children, tabs} = props;
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, value) => {
    setSelectedTab(value);
  };

  const tabElements = children.map((child, i) => <MuiTab key={i} label={tabs[i].label} />);

  const tabpanelElements = children.map((child, i) => (
    <TabPanel key={i} value={selectedTab} index={i}>
      {child}
    </TabPanel>
  ));

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

Tab.defaultProps = {
  id: 'tab'
};

Tab.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to render elements inside the component */
  children: PropTypes.node,

  /** Array of tabs to render as component children */
  tabs: PropTypes.arrayOf(
    PropTypes.exact({
      /** Element label */
      label: PropTypes.string
    })
  )
};

export default withStyles(styles, {withTheme: true})(Tab);
