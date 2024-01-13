import React from 'react';
import {Box, Snackbar, Alert as MuiAlert, AlertColor} from '@mui/material';
import {DashComponentProps} from '../../props';
type Props = {
  /** Used to identify dash components in callbacks */
  id?: string;
  /** Alert type */
  severity?: AlertColor;
  /** Automatically hide the alert (in ms) */
  autoHide?: number;
  /** Message to display */
  message?: string | null;
  /** Dash callback to update props on the server */
  setProps: (props: {message?: string | null}) => void;
} & DashComponentProps;

/**
 * Alert component
 */
const Alert: React.FC<Props> = ({
  id = 'alert',
  severity = 'error',
  autoHide = 5000,
  message = null,
  setProps
}) => {
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

Alert.defaultProps = {
  id: 'alert',
  severity: 'error',
  autoHide: 5000,
  message: null,
  setProps: () => {}
};

export default Alert;
