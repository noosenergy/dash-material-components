import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';

const styles = (theme) => ({
  tabpanelLayout: {
    height: '100%'
  },
  tabpanelContentLayout: {
    height: '100%'
  }
});

// directly from https://mui.com/components/tabs/
class TabPanel extends Component {
  render() {
    const {classes, children, value, index} = this.props;

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
  }
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

export default withStyles(styles, {withTheme: true})(TabPanel);
