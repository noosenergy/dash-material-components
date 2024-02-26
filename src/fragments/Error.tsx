import React from 'react';
import {Box, Grid, Hidden, Typography} from '@mui/material';
import {DashComponentProps} from 'props';
import {css} from '@emotion/react';
import Page from '../components/layout/Page';

const globalStyle = css({
  background: 'linear-gradient(180deg, #fac505 30%, #fac505 50%, #e9e9e9 70%, #e9e9e9 100%)',
  height: '100%',
  marginTop: '16px',
  marginRight: '-16px'
});

const errorLayoutStyle = css({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  width: '100%'
});

const errorStatusLayoutStyle = css({
  justifyContent: 'right'
});

const errorMessageLayoutStyle = css({
  justifyContent: 'left'
});

const Error = ({id = 'error', status, message}: ErrorProps) => {
  const errorStatus = (
    <Hidden mdDown>
      <Grid item sm={4} css={[errorLayoutStyle, errorStatusLayoutStyle]}>
        <Typography component="h1" style={{fontWeight: 900, fontSize: '10rem'}}>
          {status}
        </Typography>
      </Grid>
    </Hidden>
  );

  const errorMessage = (
    <Grid item xs={12} sm={8} css={[errorLayoutStyle, errorMessageLayoutStyle]}>
      <Typography component="h1" variant="h1">
        {message}
      </Typography>
    </Grid>
  );

  return (
    <Box id={id} sx={{flexGrow: 1}} css={globalStyle}>
      <Page orientation="columns">
        <Grid container spacing={2} direction="row">
          {errorStatus}
          {errorMessage}
        </Grid>
      </Page>
    </Box>
  );
};

type ErrorProps = {
  /** Used to identify dash components in callbacks */
  id?: string;

  /** Error status code */
  status: number;

  /** Error message */
  message: string;
} & Partial<DashComponentProps>;

export default Error;
