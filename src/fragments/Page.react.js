import React, {Component} from 'react';

import { Box, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  page: {
    maxWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    margin: 0,
    padding: 0,
  },
  pageFill: {
    height: "calc(100vh - 64px - 16px - 5px)", // header + dashboard padding + extra room
    maxHeight: "calc(100vh - 64px - 16px - 5px)",
    display: 'flex',
    flexDirection: 'column',
  },
  pageScroll: {},
});

export default class Page extends Component {
  render() {
    const classes = useStyles();
    const {orientation, verticalLayout} = this.props;

    // Variables
    const pageClasses = verticalLayout == "fill" ? classes.pageFill : classes.pageScroll;
    const pageDirection = orientation == "columns" ? "row" : "column";

    return (
      <Box className={`page ${pageClasses}`}>
        <Grid
          container
          spacing={2}
          direction={pageDirection}
          className={classes.page}
        >
          {this.props.children}
        </Grid>
      </Box>
    );
  }
}
