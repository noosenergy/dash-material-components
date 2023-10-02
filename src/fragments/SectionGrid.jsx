import React from 'react';
import PropTypes from 'prop-types';
import {Grid, withStyles} from '@material-ui/core';

const styles = (theme) => ({
  sectionInColumn: {
    // Contain at max entire page length
    maxHeight: '100%',
    // Reset section element negative margins
    margin: 0
  },
  sectionInRow: {
    // Contain at max entire page width
    maxWidth: '100%',
    // Reset section element negative margins
    margin: 0
  }
});

const SectionGrid = (props) => {
  // props & state
  const {classes, id, children, size, orientation} = props;

  // Fetch section content
  const sectionSize = size == undefined ? true : size;
  const sectionDirection = orientation == 'columns' ? 'row' : 'column';
  const sectionLayout = orientation == 'columns' ? classes.sectionInColumn : classes.sectionInRow;

  return (
    <Grid
      id={id}
      item
      xs={sectionSize}
      container
      spacing={2}
      direction={sectionDirection}
      className={`${sectionLayout}`}
    >
      {children}
    </Grid>
  );
};

SectionGrid.defaultProps = {
  id: 'section',
  orientation: 'rows'
};

SectionGrid.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.number,
  orientation: PropTypes.oneOf(['columns', 'rows'])
};

export default withStyles(styles, {withTheme: true})(SectionGrid);
