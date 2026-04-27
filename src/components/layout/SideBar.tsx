import React, {useState} from 'react';
import {Box, Drawer, Fab, IconButton, List, ListItem, Tooltip, Typography} from '@mui/material';
import {ChevronLeft, Settings} from '@mui/icons-material';
import {DashComponentProps} from 'props';

const DRAWER_WIDTH = 360;

/**
 * Sidebar component
 */
const Sidebar = ({
  id = 'sidebar',
  children,
  settings,
  title = 'Dashboard Settings'
}: SidebarProps) => {
  const [open, setOpen] = useState(false);

  const items: JSX.Element[] = [];
  if (children) {
    React.Children.forEach(children, (child, i) => {
      const label = settings?.[i];
      const itemId = `sidebar-item-${i + 1}`;
      items.push(
        <ListItem
          key={itemId}
          id={itemId}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
            px: 3,
            py: 1.5,
            borderRadius: 0,
            ...(label && {borderTop: (t) => `1px solid ${t.palette.divider}`})
          }}
        >
          {label && (
            <Typography
              sx={{
                minWidth: 130,
                flexShrink: 0,
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                lineHeight: 1.3
              }}
            >
              {label}
            </Typography>
          )}
          <Box sx={{flex: 1}}>{child}</Box>
        </ListItem>
      );
    });
  }

  return (
    <Box id={id}>
      <Tooltip title="Open settings" placement="right">
        <Fab
          onClick={() => setOpen(true)}
          aria-label="open-sidebar"
          size="medium"
          color="primary"
          id="sidebar-toggle"
          sx={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            zIndex: (t) => t.zIndex.drawer - 30
          }}
        >
          <Settings fontSize="small" />
        </Fab>
      </Tooltip>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{sx: {width: 'auto', minWidth: DRAWER_WIDTH, maxWidth: '85vw'}}}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            borderBottom: (t) => `3px solid ${t.palette.secondary.main}`,
            flexShrink: 0
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'text.primary',
              letterSpacing: '-0.01em'
            }}
          >
            {title}
          </Typography>
          <Tooltip title="Close">
            <IconButton
              id="close-sidebar-chevron"
              onClick={() => setOpen(false)}
              size="small"
              sx={{
                color: 'rgba(0, 0, 0, 0.35)',
                '&:hover': {color: 'text.primary', backgroundColor: 'rgba(0, 0, 0, 0.05)'}
              }}
            >
              <ChevronLeft />
            </IconButton>
          </Tooltip>
        </Box>

        <List disablePadding sx={{overflowY: 'auto', flexGrow: 1}}>
          {items}
        </List>
      </Drawer>
    </Box>
  );
};

type SidebarProps = {
  /** Array of settings to render as component children */
  settings?: string[];
  /** Dashboard sidebar title */
  title?: string;
} & DashComponentProps;

export default Sidebar;
