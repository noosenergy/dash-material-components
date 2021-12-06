import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Card as MuiCard, CardContent, Grid, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const styles = (theme) => ({
  cardHeader: {
    padding: '6px 8px',
  },
  cardTitle: {
    padding: '5px 0',
  },
  cardContent: {
    maxWidth: '100%',
    minHeight: '100%',
    height: '100%',
    overflow: 'auto',
  },
});

/**
 * Card component
 * Dashboard > Page > Section > Card
 * https://github.com/danielfrg/jupyter-flex/blob/main/js/src/Card/index.js
 */
class Card extends Component {
  render() {
    const {classes, children, title, size} = this.props;

    // Card header
    let header;
    if (title) {
      header = (
        <Grid container className={classes.cardHeader}>
          <Grid item>
            <Typography component="h2" variant="h2" className={classes.cardTitle}>
              {title}
            </Typography>
          </Grid>
        </Grid>
      );
    }

    // Variables
    const cardSize = size == 0 ? true : size;

    return (
      <Grid item container xs={cardSize} alignItems="stretch" direction="column">
        {header ? <Grid item>{header}</Grid> : null}
        <Grid item component={MuiCard} variant="outlined" xs>
          <Grid
            item
            container
            direction="column"
            component={CardContent}
            className={classes.cardContent}
            xs
          >
            {children}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Card.defaultProps = {
  children: null,
  title: '',
  size: 0,
};

Card.propTypes = {
  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** Card overall title */
  title: PropTypes.string,

  /** Card container size (0 < grid size <= 12) */
  size: PropTypes.number,
};

export default withStyles(styles, {withTheme: true})(Card);
