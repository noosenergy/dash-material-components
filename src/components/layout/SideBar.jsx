import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Box, Drawer, Fab} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {withStyles} from '@material-ui/core/styles';

const drawerWidth = 240;

const styles = (theme) => ({
  fabLayout: {
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
    this.state = {opened: this.props.opened};
  }

  handleDrawerOpen = () => {
    this.setState({opened: true});
  };

  handleDrawerClose = (event) => {
    // To prevent the drawer from closing
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({opened: false});
  };

  UNSAFE_componentWillReceiveProps = (nextProps, nextContext) => {
    if (nextProps.opened !== this.state.opened) this.setState({opened: nextProps.opened});
  };

  render() {
    const {classes, id, children} = this.props;
    const {opened} = this.state;

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
          open={opened}
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
  opened: false,
};

Sidebar.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Used to render elements inside the component */
  children: PropTypes.node,

  /** Wether the sidebar is opened or not */
  opened: PropTypes.bool,
};

export default withStyles(styles, {withTheme: true})(Sidebar);
