import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  tabpanelLayout: {
    height: '100%'
  },
  tabpanelContentLayout: {
    height: '100%'
  }
}));

const TabPanel = (props) => {
  const {children, value, index} = props;
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

export default TabPanel;
