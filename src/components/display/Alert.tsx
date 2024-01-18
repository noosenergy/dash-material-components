import React from 'react';
import {Box, Snackbar, Alert as MuiAlert, AlertColor} from '@mui/material';
import PropTypes from 'prop-types';
import {DashComponentProps} from 'props';

/**
 * Alert component
 */
const Alert = ({id = 'alert', severity = 'error', autoHide = 5000, message, setProps}: Props) => {
  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === 'clickaway') {
      setProps({message: null});
    }
  };

  return (
    <Box id={id}>
      <Snackbar
        open={Boolean(message)}
        onClose={handleClose}
        autoHideDuration={autoHide}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <MuiAlert severity={severity} variant="filled">
          {message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

type Props = {
  /** Alert type */
  severity?: AlertColor;
  /** Automatically hide the alert (in ms) */
  autoHide?: number;
  /** Message to display */
  message?: string;
} & DashComponentProps;

Alert.propTypes = {
  /** Unique ID to identify this component in Dash callbacks. */
  id: PropTypes.string,
  /** Alert type */
  severity: PropTypes.string /*PropTypes.oneOf(['error', 'warning', 'info', 'success'])*/,
  /** Automatically hide the alert (in ms) */
  autoHide: PropTypes.number,
  /** Message to display */
  message: PropTypes.string,
  /**
   * Function to update props to trigger callbacks.
   * This is a function that takes an object as an argument.
   */
  setProps: PropTypes.func.isRequired
};

export default Alert;
