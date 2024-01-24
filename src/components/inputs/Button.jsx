import React from 'react';
import {Button as MuiButton, Icon, Box} from '@mui/material';

/**
 * Button component
 */
const Button = (props) => {
  const {
    id,
    text,
    margin,
    width,
    nClicks,
    startIcon,
    endIcon,
    setProps,
    iconColor,
    ...remainingProps
  } = props;

  const handleClick = (event) => {
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
        {...remainingProps}
      >
        {text}
      </MuiButton>
    </Box>
  );
};

Button.defaultProps = {
  id: 'button',
  variant: 'contained',
  color: 'primary',
  size: 'medium',
  margin: 2,
  width: null,
  startIcon: null,
  endIcon: null,
  nClicks: 0,
  disabled: false
};

Button.propTypes = {
  /** Component id */
  id: PropTypes.string,

  /** Button text */
  text: PropTypes.string,

  /** MUI button variant */
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),

  /** MUI button color */
  color: PropTypes.oneOf([
    'inherit',
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning'
  ]),

  /** Icon color */
  iconColor: PropTypes.oneOf(['primary', 'secondary', 'action', 'error', 'disabled']),

  /** MUI button size, small | medium | large */
  size: PropTypes.string,

  /** Component margin */
  margin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /** Button is disabled */
  disabled: PropTypes.bool,

  /** Button has no ripple effect */
  disableRipple: PropTypes.bool,

  /* Disable keyboard focus ripple */
  disableFocusRipple: PropTypes.bool,

  /** Disable elevation */
  disableElevation: PropTypes.bool,

  /** Material Icon name to display at start of button - https://v4.mui.com/components/material-icons/ */
  startIcon: PropTypes.string,

  /** Material Icon name to display at end of button - https://v4.mui.com/components/material-icons/ */
  endIcon: PropTypes.string,

  /** Button link */
  href: PropTypes.string,

  /** Component width */
  width: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Number of times the button has been clicked */
  nClicks: PropTypes.number
};

export default Button;
