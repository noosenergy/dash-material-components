import React, {Component} from 'react';

import {Box, Grid} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const styles = (theme) => ({
  page: {
    maxWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    margin: 0,
    padding: 0,
  },
  pageFill: {
    height: 'calc(100vh - 64px - 16px - 5px)', // header + dashboard padding + extra room
    maxHeight: 'calc(100vh - 64px - 16px - 5px)',
    display: 'flex',
    flexDirection: 'column',
  },
  pageScroll: {},
});

/**
 * Page component
 * Dashboard > Page
 * https://github.com/danielfrg/jupyter-flex/blob/main/js/src/Section/index.js
 */
class Page extends Component {
  render() {
    const {classes, children, orientation, verticalLayout} = this.props;

    // Variables
    const pageClasses = verticalLayout == 'fill' ? classes.pageFill : classes.pageScroll;
    const pageDirection = orientation == 'columns' ? 'row' : 'column';

    return (
      <Box className={`${pageClasses}`}>
        <Grid container spacing={2} direction={pageDirection} className={classes.page}>
          {children}
        </Grid>
      </Box>
    );
  }
}

Page.defaultProps = {
  children: null,
  orientation: 'columns',
  verticalLayout: 'fill',
};

Page.propTypes = {
  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** Dashboard general orientation (rows or columns) */
  orientation: PropTypes.string,

  /** Dashboard general layout (fill or scroll) */
  verticalLayout: PropTypes.string,
};

export default withStyles(styles, {withTheme: true})(Page);
