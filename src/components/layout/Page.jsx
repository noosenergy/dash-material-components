import React from 'react';
import PropTypes from 'prop-types';
import {Box, Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  pageLayout: {
    // Contain the entire page
    width: '100%',
    height: '100%',
    // Reset page element negative margins
    margin: 0
  }
}));

/**
 * Page component, used to wrap section and card components
 * Dashboard > Page
 */
const Page = (props) => {
  const {id, children, orientation} = props;
  const classes = useStyles();

  // Variables
  const pageDirection = orientation == 'columns' ? 'row' : 'column';

  // Configure flex versus parent container
  return (
    <Box id={id} sx={{flexGrow: 1}}>
      <Grid container spacing={2} direction={pageDirection} className={classes.pageLayout}>
        {children}
      </Grid>
    </Box>
  );
};

Page.defaultProps = {
  id: 'page',
  orientation: 'columns'
};

Page.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to render elements inside the component */
  children: PropTypes.node,

  /** Page general orientation (rows or columns) */
  orientation: PropTypes.oneOf(['columns', 'rows'])
};

export default Page;
