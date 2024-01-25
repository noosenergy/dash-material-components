import React from 'react';
import {Card as MuiCard, CardContent, CardHeader, Grid, IconButton, Tooltip} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {GetApp} from '@mui/icons-material';
import {DashComponentProps} from 'props';

const useStyles = makeStyles(() => ({
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
}));

const Card = ({
  id = 'card',
  children,
  title,
  size,
  orientation = 'columns',
  downloadable = false,
  handleDownload
}: CardProps) => {
  const classes = useStyles();

  const header = title ? (
    <CardHeader
      action={
        downloadable ? (
          <Tooltip title="Download card">
            <IconButton aria-label="download-card" onClick={handleDownload} size="large">
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

type CardProps = {
  // Title of the card
  title?: string;
  // Size of the card
  size?: number;
  // Orientation of the card (columns or rows)
  orientation?: 'columns' | 'rows';
  // Flag indicating if the card is downloadable
  downloadable?: boolean;
  // Function to handle card download
  handleDownload?: () => void;
} & Partial<DashComponentProps>;

export default Card;
