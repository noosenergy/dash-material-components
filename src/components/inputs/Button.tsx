import React from 'react';
import {Button as MuiButton, Icon, Box} from '@mui/material';
import {DashComponentProps} from 'props';

/**
 * Button component
 */
const Button = ({
  id = 'button',
  text,
  margin = 2,
  width = null,
  nClicks = 0,
  startIcon = null,
  endIcon = null,
  setProps,
  iconColor,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  disableRipple,
  disableFocusRipple,
  disableElevation,
  sx,
  href
}: ButtonProps) => {
  const handleClick = () => {
    // Fire Dash-assigned callback
    setProps({nClicks: nClicks + 1});
  };

  return (
    <Box id={id} m={margin} width={width}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <MuiButton
        id={`${id}-btn`}
        onClick={handleClick}
        fullWidth={width !== null}
        startIcon={startIcon ? <Icon color={iconColor}>{startIcon}</Icon> : null}
        endIcon={endIcon ? <Icon color={iconColor}>{endIcon}</Icon> : null}
        variant={variant}
        color={color}
        size={size}
        disabled={disabled}
        disableFocusRipple={disableFocusRipple}
        disableRipple={disableRipple}
        disableElevation={disableElevation}
        href={href}
        sx={sx}
      >
        {text}
      </MuiButton>
    </Box>
  );
};

type ButtonProps = {
  /** Button text */
  text?: string;
  /** MUI button variant */
  variant?: 'contained' | 'outlined' | 'text';
  /** MUI button color */
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /** Icon color */
  iconColor?: 'primary' | 'secondary' | 'action' | 'error' | 'disabled';
  /** MUI button size, small | medium | large */
  size?: 'small' | 'medium' | 'large';
  /** Component margin */
  margin?: number | string;
  /** Button is disabled */
  disabled?: boolean;
  /** Button has no ripple effect */
  disableRipple?: boolean;
  /** Disable keyboard focus ripple */
  disableFocusRipple?: boolean;
  /** Disable elevation */
  disableElevation?: boolean;
  /** Material Icon name to display at start of button, https://mui.com/material-ui/material-icons/#search-material-icons */
  startIcon?: string;
  /** Material Icon name to display at end of button, https://mui.com/material-ui/material-icons/#search-material-icons */
  endIcon?: string;
  /** Button link */
  href?: string;
  /** Component width */
  width?: string | null;
  /** Number of times the button has been clicked */
  nClicks?: number;
  /** Custom style */
  sx?: object;
} & DashComponentProps;

export default Button;
