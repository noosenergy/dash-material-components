import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Box, Drawer, Fab} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {withStyles} from '@material-ui/core/styles';

const drawerWidth = 240;

const styles = (theme) => ({
  fabLayout: {
    // Position above all other components
    zIndex: 1001,
    position: 'absolute',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
  drawerLayout: {
    width: drawerWidth,
    flexShrink: 0,
    background: theme.palette.secondary.main,
  },
  drawerContentLayout: {
    overflow: 'auto',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
});

/**
 * SideBar component
 * Dashboard > SideBar
 */
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.state = {toggledDrawer: false};
  }

  handleDrawerOpen = () => {
    this.setState({toggledDrawer: true});
  };

  handleDrawerClose = (event) => {
    // To prevent the drawer from closing
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({toggledDrawer: false});
  };

  render() {
    const {classes, id, children} = this.props;
    const {toggledDrawer} = this.state;

    return (
      <Box id={id}>
        <Fab
          onClick={this.handleDrawerOpen}
          aria-label="configure"
          size="medium"
          color="primary"
          className={classes.fabLayout}
        >
          <MoreVertIcon />
        </Fab>
        <Drawer
          anchor="left"
          open={toggledDrawer}
          onClose={this.handleDrawerClose}
          classes={{paper: classes.drawerLayout}}
        >
          <div className={classes.toolbar} />
          <Box className={classes.drawerContentLayout}>{children}</Box>
        </Drawer>
      </Box>
    );
  }
}

Sidebar.defaultProps = {
  id: 'sidebar',
};

Sidebar.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to render elements inside the component */
  children: PropTypes.node,
};

export default withStyles(styles, {withTheme: true})(Sidebar);
