import React from 'react';
import {Card as MuiCard, CardContent, CardHeader, Grid, IconButton, Tooltip} from '@mui/material';
import {GetApp} from '@mui/icons-material';
import {DashComponentProps} from 'props';

const cardInColumnStyle = {maxHeight: '100%'};
const cardInRowStyle = {maxWidth: '100%'};
const cardContentLayoutStyle = {height: '100%', overflow: 'auto'};
const cardContainerLayoutStyle = {overflow: 'auto'};

const Card = ({
  id = 'card',
  children,
  title,
  size,
  orientation = 'columns',
  downloadable = false,
  handleDownload
}: CardProps) => {
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
  const cardLayoutStyle = orientation == 'columns' ? cardInColumnStyle : cardInRowStyle;

  return (
    <Grid id={id} item xs={cardSize} container direction="column" sx={cardLayoutStyle}>
      <Grid item xs container direction="column" component={MuiCard} sx={cardContainerLayoutStyle}>
        {header ? <Grid item>{header}</Grid> : null}
        <Grid item xs component={CardContent} sx={cardContentLayoutStyle}>
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
