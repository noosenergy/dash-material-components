import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  section: {
    maxHeight: "100%",
    margin: 0,
  },
  sectionInColumn: {
    paddingTop: "0px !important",
  },
  sectionInRow: {
    paddingTop: "0px !important",
    width: "100%",
    maxWidth: "100%",
  },
});

/**
 * Section component
 * Dashboard > Section
 * https://github.com/danielfrg/jupyter-flex/blob/main/js/src/Section/index.js
 */
 export default class Section extends Component {
  render() {
    const classes = useStyles();
    const {size, orientation} = this.props;

    // Variables
    const sectionSize = size == 0 ? true : size;
    const sectionDirection = orientation == "columns" ? "row" : "column";
    const sectionClasses =
      pageOrientation == "columns"
        ? classes.sectionInColumn
        : classes.sectionInRow;

    return (
      <Grid
        item
        container
        xs={sectionSize}
        spacing={2}
        alignItems="stretch"
        direction={sectionDirection}
        className={`section ${classes.section} ${sectionClasses}`}
      >
        {this.props.children}
      </Grid>
    );
  }

}

Section.defaultProps = {
  children: null,
  size: 0,
  orientation: 'rows',
};

Section.propTypes = {
  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** Section container size (0 < grid size <= 12) */
  size: PropTypes.number,

  /** Section general orientation (rows or columns) */
  orientation: PropTypes.string,
};
