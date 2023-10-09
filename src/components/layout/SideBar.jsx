import React, {useState} from 'react';
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
  Tooltip,
  Typography
} from '@material-ui/core';
import {ChevronLeft, Settings} from '@material-ui/icons';
import {makeStyles} from '@material-ui/core/styles';

const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
  fabLayout: {
    position: 'absolute',
    bottom: theme.spacing(5),
    left: theme.spacing(5),
    // Position just below the drawer
    zIndex: theme.zIndex.drawer - 50
  },
  drawerLayout: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaperLayout: {
    width: drawerWidth,
    background: theme.palette.secondary.main
  },
  drawerHeaderLayout: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  drawerContentLayout: {
    width: '100%',
    height: '100%',
    overflow: 'auto'
  }
}));

/**
 * Sidebar component
 */
const Sidebar = (props) => {
  const {id, children, settings, title} = props;
  const classes = useStyles();
  const [toggledDrawer, setToggledDrawer] = useState(false);

  const handleDrawerOpen = () => {
    setToggledDrawer(true);
  };

  const handleDrawerClose = (event) => {
    // To prevent the drawer from closing
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setToggledDrawer(false);
  };

  // locals
  let drawerHeader;
  let drawerElements = [];

  // Fetch drawer button
  const drawerButton = (
    <Tooltip title="Open sidebar">
      <Fab
        onClick={handleDrawerOpen}
        aria-label="open-sidebar"
        size="medium"
        color="primary"
        className={classes.fabLayout}
        id="sidebar-toggle"
      >
        <Settings />
      </Fab>
    </Tooltip>
  );

  // Fetch drawer header
  if (title) {
    drawerHeader = (
      <Box className={classes.drawerHeaderLayout}>
        <Typography component="p" variant="h3" color="inherit">
          {title}
        </Typography>
        <Tooltip title="Close sidebar">
          <IconButton id="close-sidebar-chevron" color="inherit" onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  // Fetch drawer elements
  if (children) {
    let listElement;
    React.Children.forEach(children, (child, i) => {
      const itemId = `sidebar-item-${i + 1}`;
      listElement = (
        <ListItem id={itemId} key={itemId}>
          <ListItemText id={`${itemId}-text`} primary={settings[i]} />
          {child}
        </ListItem>
      );
      drawerElements.push(listElement);
    });
  }

  return (
    <Box id={id}>
      {drawerButton}
      <Drawer
        anchor="left"
        open={toggledDrawer}
        onClose={handleDrawerClose}
        className={classes.drawerLayout}
        classes={{paper: classes.drawerPaperLayout}}
      >
        {drawerHeader}
        <Divider />
        <List className={classes.drawerContentLayout}>{drawerElements}</List>
      </Drawer>
    </Box>
  );
};

Sidebar.defaultProps = {
  id: 'sidebar',
  title: 'Dashboard Settings'
};

Sidebar.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to render elements inside the component */
  children: PropTypes.node,

  /** Array of settings to render as component children */
  settings: PropTypes.arrayOf(PropTypes.string),

  /** Dashboard sidebar title */
  title: PropTypes.string
};

export default Sidebar;
