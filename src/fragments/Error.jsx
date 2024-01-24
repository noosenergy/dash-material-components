import React from 'react';
import PropTypes from 'prop-types';

import {Box, Grid, Hidden, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  // Change overall body background
  '@global': {
    body: {
      background: 'linear-gradient(180deg, #FAC505 30%, #FAC505 50%, #E9E9E9 70%, #E9E9E9 100%)'
    }
  },
  errorLayout: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  errorStatusLayout: {
    justifyContent: 'right'
  },
  errorMessageLayout: {
    justifyContent: 'left'
  },
  pageLayout: {
    // Contain the entire page
    width: '100%',
    height: '100%',
    // Reset page element negative margins
    margin: 0
  }
});

const Error = (props) => {
  const {id, status, message} = props;
  const classes = useStyles();

  const errorStatus = (
    <Hidden mdDown>
      <Grid item sm={4} className={`${classes.errorLayout} ${classes.errorStatusLayout}`}>
        <Typography component="h1" style={{fontWeight: 900, fontSize: '10rem'}}>
          {status}
        </Typography>
      </Grid>
    </Hidden>
  );

  const errorMessage = (
    <Grid item xs={12} sm={8} className={`${classes.errorLayout} ${classes.errorMessageLayout}`}>
      <Typography component="h1" variant="h1">
        {message}
      </Typography>
    </Grid>
  );

  return (
    <Box id={id} sx={{flexGrow: 1}}>
      <Grid container spacing={2} direction="row" className={classes.pageLayout}>
        {errorStatus}
        {errorMessage}
      </Grid>
    </Box>
  );
};

Error.defaultProps = {
  id: 'error'
};

Error.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Error status code */
  status: PropTypes.number.isRequired,

  /** Error message */
  message: PropTypes.string.isRequired
};

export default Error;
