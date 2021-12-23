import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Grid, Tab as MuiTab, Tabs} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

import TabPanel from '../../fragments/TabPanel.jsx';

const styles = (theme) => ({
  tabLayout: {
    height: '100%',
    width: '100%',
  },
});

/**
 * Tab component
 * Dashboard > Page > Section > Card > Tab
 * https://github.com/danielfrg/jupyter-flex/blob/main/js/src/Section/index.js
 */
class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedTab: 0};
  }

  handleTabChange = (event, value) => {
    this.setState({selectedTab: value});
  };

  render() {
    // props & state
    const {classes, id, children, tabs} = this.props;
    let {selectedTab} = this.state;

    // locals
    let tabElements = [];
    let tabpanelElements = [];

    // Fetch cards or tabs
    if (children) {
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
          onChange={this.handleTabChange}
          indicatorColor="primary"
          aria-label="basic-tabs"
          selectionFollowsFocus
        >
          {tabElements}
        </Grid>
        <Grid item xs>
          {tabpanelElements}
        </Grid>
      </Grid>
    );
  }
}

Tab.defaultProps = {
  id: 'tab',
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
      label: PropTypes.string,
    })
  ),
};

export default withStyles(styles, {withTheme: true})(Tab);
