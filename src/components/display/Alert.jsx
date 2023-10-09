import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Box, Snackbar} from '@material-ui/core';
import {Alert as MuiAlert} from '@material-ui/lab';

/**
 * Alert component
 */
const Alert = (props) => {
  const {id, severity, autoHide, message: initialMessage} = props;
  const [message, setMessage] = useState(initialMessage);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'timeout') {
      setMessage(null);
    }
  };

  useEffect(() => {
    setMessage(initialMessage);

    const timer = setTimeout(() => {
      handleClose(null, 'timeout');
    }, autoHide);

    return () => {
      clearTimeout(timer);
    };
  }, [initialMessage]);

  return (
    <Box id={id}>
      <Snackbar
        open={Boolean(message)}
        onClose={handleClose}
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
  message: null
};

Alert.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Alert type */
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),

  /** Automatically hide the alert (in ms) */
  autoHide: PropTypes.number,

  /** Message to display */
  message: PropTypes.string
};

export default Alert;
