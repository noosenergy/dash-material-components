import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Grid} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

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

class SectionGrid extends Component {
  render() {
    // props & state
    const {classes, id, children, size, orientation} = this.props;

    // Fetch section content
    const sectionSize = size == undefined ? true : size;
    const sectionDirection = orientation == 'columns' ? 'row' : 'column';
    const sectionLayout =
      orientation == 'columns' ? classes.sectionInColumn : classes.sectionInRow;

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
  }
}

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
