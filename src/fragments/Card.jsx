import React from 'react';
import PropTypes from 'prop-types';
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
  withStyles
} from '@material-ui/core';
import {GetApp} from '@material-ui/icons';

const styles = (theme) => ({
  cardInColumn: {
    maxHeight: '100%'
  },
  cardInRow: {
    maxWidth: '100%'
  },
  cardContentLayout: {
    height: '100%',
    overflow: 'auto'
  }
});

const Card = (props) => {
  const {classes, id, children, title, size, orientation, downloadable, handleDownload} = props;

  const header = title ? (
    <CardHeader
      action={
        downloadable ? (
          <Tooltip title="Download card">
            <IconButton aria-label="download-card" onClick={handleDownload}>
              <GetApp />
            </IconButton>
          </Tooltip>
        ) : null
      }
      title={title}
      titleTypographyProps={{variant: 'h2'}}
    />
  ) : null;

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
};

Card.defaultProps = {
  id: 'card',
  orientation: 'columns',
  downloadable: false
};

Card.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  size: PropTypes.number,
  orientation: PropTypes.oneOf(['columns', 'rows']),
  downloadable: PropTypes.bool,
  handleDownload: PropTypes.func
};

export default withStyles(styles, {withTheme: true})(Card);
