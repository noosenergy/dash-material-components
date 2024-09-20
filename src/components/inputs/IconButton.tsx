import React from 'react';
import {IconButton as MuiIconButton, Icon, Box} from '@mui/material';
import {DashComponentProps} from 'props';

/**
 * IconButton component
 */
const IconButton = ({
  id = 'icon-button',
  icon,
  margin = 2,
  width = null,
  nClicks = 0,
  edge = false,
  color = 'primary',
  size = 'medium',
  disabled = false,
  disableRipple,
  disableFocusRipple,
  sx,
  setProps
}: IconButtonProps) => {
  const handleClick = () => {
    // Fire Dash-assigned callback
    setProps({nClicks: nClicks + 1});
  };

  return (
    <Box id={id} m={margin} width={width}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <MuiIconButton
        id={`${id}-btn`}
        onClick={handleClick}
        color={color}
        size={size}
        edge={edge}
        disableFocusRipple={disableFocusRipple}
        disableRipple={disableRipple}
        disabled={disabled}
        aria-label={icon}
        sx={sx}
      >
        <Icon fontSize="inherit">{icon}</Icon>
      </MuiIconButton>
    </Box>
  );
};

type IconButtonProps = {
  /** Icon name from https://mui.com/material-ui/material-icons/#search-material-icons */
  icon?: string;
  /** Button color */
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Box margin */
  margin?: number;
  /** Box width */
  width?: number | string;
  /** Number of clicks */
  nClicks?: number;
  /** Use a negative margin to counteract the padding on one side */
  edge?: 'start' | 'end' | false;
  /** Disable button */
  disabled?: boolean;
  /** Disable ripple effect */
  disableRipple?: boolean;
  /** Disable focus ripple effect */
  disableFocusRipple?: boolean;
  /** Disable elevation */
  sx?: object;
} & DashComponentProps;

export default IconButton;
