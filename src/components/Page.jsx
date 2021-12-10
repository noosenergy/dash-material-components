import React, {Component} from 'react';

import {Box, Grid} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const styles = (theme) => ({
  page: {
    // header + dashboard padding + extra room
    height: 'calc(100vh - 64px - 16px - 5px)',
    maxHeight: 'calc(100vh - 64px - 16px - 5px)',
  },
  pageLayout: {
    maxWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    margin: 0,
    padding: 0,
  },
});

/**
 * Page component, used to wrap section and card components
 * Dashboard > Page
 */
class Page extends Component {
  render() {
    const {classes, id, children, orientation} = this.props;

    // Variables
    const pageDirection = orientation == 'columns' ? 'row' : 'column';

    return (
      <Box id={id} sx={{display: 'flex', flexDirection: 'column'}} className={classes.page}>
        <Grid container spacing={2} direction={pageDirection} className={classes.pageLayout}>
          {children}
        </Grid>
      </Box>
    );
  }
}

Page.defaultProps = {
  id: 'page',
  children: null,
  orientation: 'columns',
};

Page.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to render elements inside the component */
  children: PropTypes.node,

  /** Dashboard general orientation (rows or columns) */
  orientation: PropTypes.oneOf(['columns', 'rows']),
};

export default withStyles(styles, {withTheme: true})(Page);
