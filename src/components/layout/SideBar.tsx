/** @jsxImportSource @emotion/react */
import React, {useState} from 'react';
import {
  Box,
  Divider,
  Drawer,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Theme,
  Tooltip,
  Typography
} from '@mui/material';
import {ChevronLeft, Settings} from '@mui/icons-material';
import {DashComponentProps} from 'props';
import {Interpolation, css, useTheme} from '@emotion/react';

const drawerWidth = 360;

const useSidebarStyles = (theme: Theme) => {
  const fabLayout = css`
    position: absolute;
    bottom: ${theme.spacing(5)};
    left: ${theme.spacing(5)};
    z-index: ${theme.zIndex.drawer - 50};
  `;

  const drawerLayout = css`
    width: ${drawerWidth}px; // NOTE px was added in @emotion/react
    flex-shrink: 0;
    '&:.muidrawer-paper': {
      width: ${drawerWidth}px; // NOTE px was added in @emotion/react
      background: ${theme.palette.secondary.main};
    }
  `;

  const drawerHeaderLayout = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
    ...theme.mixins.toolbar
  } as Interpolation<Theme>;

  const drawerContentLayout = css`
    width: 100%;
    height: 100%;
    overflow: auto;
  `;

  return {
    fabLayout,
    drawerLayout,
    drawerHeaderLayout,
    drawerContentLayout
  };
};

/**
 * Sidebar component
 */
const Sidebar = ({
  id = 'sidebar',
  children,
  settings,
  title = 'Dashboard Settings'
}: SidebarProps) => {
  const theme = useTheme() as Theme;
  const {fabLayout, drawerLayout, drawerHeaderLayout, drawerContentLayout} =
    useSidebarStyles(theme);

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
  const drawerElements: JSX.Element[] = [];

  // Fetch drawer button
  const drawerButton = (
    <Tooltip title="Open sidebar">
      <Fab
        onClick={handleDrawerOpen}
        aria-label="open-sidebar"
        size="medium"
        color="primary"
        css={fabLayout}
        id="sidebar-toggle"
      >
        <Settings />
      </Fab>
    </Tooltip>
  );

  // Fetch drawer header
  if (title) {
    drawerHeader = (
      <Box css={drawerHeaderLayout}>
        <Typography component="p" variant="h3" color="inherit">
          {title}
        </Typography>
        <Tooltip title="Close sidebar">
          <IconButton
            id="close-sidebar-chevron"
            color="inherit"
            onClick={handleDrawerClose}
            size="large"
          >
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
      <Drawer anchor="left" open={toggledDrawer} onClose={handleDrawerClose} css={drawerLayout}>
        {drawerHeader}
        <Divider />
        <List css={drawerContentLayout}>{drawerElements}</List>
      </Drawer>
    </Box>
  );
};

// TypeScript props type
type SidebarProps = {
  /** Array of settings to render as component children */
  settings?: string[];
  /** Dashboard sidebar title */
  title?: string;
} & DashComponentProps;

export default Sidebar;
