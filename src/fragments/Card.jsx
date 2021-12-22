import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Card as MuiCard, CardContent, CardHeader, Grid} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const styles = (theme) => ({
  cardInColumn: {
    // Contain at max entire section length
    maxHeight: '100%',
  },
  cardInRow: {
    // Contain at max entire section width
    maxWidth: '100%',
  },
  cardContentLayout: {
    height: '100%',
    // If inner container overflows
    overflow: 'auto',
  },
});

class Card extends Component {
  render() {
    const {classes, id, children, title, size, orientation} = this.props;

    // Card header
    let header;
    if (title) {
      header = <CardHeader title={title} titleTypographyProps={{variant: 'h2'}} />;
    }

    // Fetch card content
    const cardSize = size == undefined ? true : size;
    const cardLayout = orientation == 'columns' ? classes.cardInColumn : classes.cardInRow;

    return (
      <Grid id={id} item xs={cardSize} container direction="column" className={`${cardLayout}`}>
        <Grid item xs container direction="column" component={MuiCard} elevation={4}>
          {header ? <Grid item>{header}</Grid> : null}
          <Grid item xs component={CardContent} className={classes.cardContentLayout}>
            {children}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Card.defaultProps = {
  id: 'card',
  sectionOrientation: 'columns',
};

Card.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  size: PropTypes.number,
  orientation: PropTypes.oneOf(['columns', 'rows']),
};

export default withStyles(styles, {withTheme: true})(Card);
