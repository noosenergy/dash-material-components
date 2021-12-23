import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Grid} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

import Card from '../../fragments/Card.jsx';

const styles = (theme) => ({
  sectionInColumn: {
    // Contain at max entire page length
    maxHeight: '100%',
    // Reset section element negative margins
    margin: 0,
  },
  sectionInRow: {
    // Contain at max entire page width
    maxWidth: '100%',
    // Reset section element negative margins
    margin: 0,
  },
});

/**
 * Section component
 * Dashboard > Page > Section
 */
class Section extends Component {
  render() {
    // props & state
    const {classes, id, children, cards, size, orientation} = this.props;

    // locals
    let cardElement;
    let sectionElements = [];

    // Fetch cards
    if (children) {
      React.Children.forEach(children, (child, i) => {
        cardElement = (
          <Card
            key={i}
            id={`card-${i + 1}`}
            title={cards[i].title}
            size={cards[i].size}
            orientation={orientation}
          >
            {child}
          </Card>
        );

        sectionElements.push(cardElement);
      });
    }

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
        {sectionElements}
      </Grid>
    );
  }
}

Section.defaultProps = {
  id: 'section',
  orientation: 'rows',
};

Section.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to render elements inside the component */
  children: PropTypes.node,

  /** Array of cards to render as component children */
  cards: PropTypes.arrayOf(
    PropTypes.exact({
      /** Card title */
      title: PropTypes.string,

      /** Card size (0 < size <= 12) */
      size: PropTypes.number,
    })
  ),

  /** Section general orientation (rows or columns) */
  orientation: PropTypes.oneOf(['columns', 'rows']),

  /** Section container size (0 < size <= 12) */
  size: PropTypes.number,
};

export default withStyles(styles, {withTheme: true})(Section);
