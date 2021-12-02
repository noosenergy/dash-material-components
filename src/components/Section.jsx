import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) =>({
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
 * Dashboard > Page > Section
 * https://github.com/danielfrg/jupyter-flex/blob/main/js/src/Section/index.js
 */
class Section extends Component {
  render() {
    const {classes, children, size, orientation} = this.props;

    // Variables
    const sectionSize = size == 0 ? true : size;
    const sectionDirection = orientation == "columns" ? "row" : "column";
    const sectionClasses =
      orientation == "columns"
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
        className={`${classes.section} ${sectionClasses}`}
      >
        {children}
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

export default withStyles(styles, { withTheme: true })(Section);
