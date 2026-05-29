import React from 'react';
import {AppBar, Box, Divider, Toolbar, Typography} from '@mui/material';
import NoosIcon from '../../fragments/NoosIcon';
import {DashComponentProps} from 'props';

/**
 * Dashboard navigation bar component
 * https://mui.com/components/app-bar/
 */
const NavBar = ({id = 'navbar', title}: NavBarProps) => {
  return (
    <Box id={id}>
      <AppBar position="static">
        <Toolbar variant="dense" sx={{gap: 2, px: 3}}>
          <NoosIcon viewBox="0 0 50 20" sx={{width: 22, height: 9, flexShrink: 0}} />
          {title && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{borderColor: 'rgba(255,255,255,0.15)', my: 1.5}}
              />
              <Typography variant="h1" component="h1">
                {title}
              </Typography>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

type NavBarProps = {
  /** Dashboard navigation bar title */
  title?: string;
} & DashComponentProps;

export default NavBar;
