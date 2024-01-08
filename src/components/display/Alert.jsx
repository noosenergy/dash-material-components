import React from 'react';
import PropTypes from 'prop-types';
import {Box, Snackbar} from '@mui/material';
import {Alert as MuiAlert} from '@mui/material';

/**
 * Alert component
 */
const Alert = (props) => {
  const {id, severity, autoHide, message, setProps} = props;

  const handleClose = (event, reason) => {
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
        autoHide={true}
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

Alert.defaultProps = {
  id: 'alert',
  severity: 'error',
  autoHide: 5000,
  message: null,
  setProps: () => {}
};

Alert.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Alert type */
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),

  /** Automatically hide the alert (in ms) */
  autoHide: PropTypes.number,

  /** Message to display */
  message: PropTypes.string,

  /** Dash callback to update props on the server */
  setProps: PropTypes.func
};

export default Alert;
