import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Divider,
  Drawer,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {withStyles} from '@material-ui/core/styles';

const drawerWidth = 360;

const styles = (theme) => ({
  fabLayout: {
    position: 'absolute',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
    // Position just below the drawer
    zIndex: theme.zIndex.drawer - 50,
  },
  drawerLayout: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaperLayout: {
    width: drawerWidth,
    background: theme.palette.secondary.main,
  },
  drawerHeaderLayout: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  drawerContentLayout: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
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
    const {classes, id, children, settings, title} = this.props;
    const {toggledDrawer} = this.state;

    // locals
    let drawerHeader;
    let drawerElements = [];

    // Fetch drawer header
    if (title) {
      drawerHeader = (
        <Box className={classes.drawerHeaderLayout}>
          <Typography component="p" variant="h3" color="inherit">
            {title}
          </Typography>
          <IconButton color="inherit" onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      );
    }

    // Fetch drawer elements
    if (children) {
      let listElement;
      React.Children.forEach(children, (child, i) => {
        listElement = (
          <ListItem>
            <ListItemText id={`list-item-${i + 1}`} primary={settings[i]} />
            {child}
          </ListItem>
        );
        drawerElements.push(listElement);
      });
    }

    return (
      <Box id={id}>
        <Fab
          onClick={this.handleDrawerOpen}
          aria-label="open-sidebar"
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
          className={classes.drawerLayout}
          classes={{paper: classes.drawerPaperLayout}}
        >
          {drawerHeader}
          <Divider />
          <List className={classes.drawerContentLayout}>{drawerElements}</List>
        </Drawer>
      </Box>
    );
  }
}

Sidebar.defaultProps = {
  id: 'sidebar',
  title: 'Dashboard Settings',
};

Sidebar.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to render elements inside the component */
  children: PropTypes.node,

  /** Array of settings to render as component children */
  settings: PropTypes.arrayOf(PropTypes.string),

  /** Dashboard sidebar title */
  title: PropTypes.string,
};

export default withStyles(styles, {withTheme: true})(Sidebar);
