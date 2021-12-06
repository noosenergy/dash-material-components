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
 * Page component
 * Dashboard > Page
 * https://github.com/danielfrg/jupyter-flex/blob/main/js/src/Section/index.js
 */
class Page extends Component {
  render() {
    const {classes, children, orientation} = this.props;

    // Variables
    const pageDirection = orientation == 'columns' ? 'row' : 'column';

    return (
      <Box sx={{display: 'flex', flexDirection: 'column'}} className={classes.page}>
        <Grid container spacing={2} direction={pageDirection} className={classes.pageLayout}>
          {children}
        </Grid>
      </Box>
    );
  }
}

Page.defaultProps = {
  children: null,
  orientation: 'columns',
};

Page.propTypes = {
  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** Dashboard general orientation (rows or columns) */
  orientation: PropTypes.string,
};

export default withStyles(styles, {withTheme: true})(Page);
