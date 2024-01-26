/** @jsxImportSource @emotion/react */
import React from 'react';
import {Box, Grid, Hidden, Typography} from '@mui/material';
import {DashComponentProps} from 'props';
import {css} from '@emotion/react';

// NOTE is this global style correctly applied ?
const globalStyle = css`
  background: linear-gradient(180deg, #fac505 30%, #fac505 50%, #e9e9e9 70%, #e9e9e9 100%);
`;

const errorLayoutStyle = css`
  display: flex;
  alignitems: center;
  height: 100%;
  width: 100%;
`;

const errorStatusLayoutStyle = css`
  justifycontent: right;
`;

const errorMessageLayoutStyle = css`
  justifycontent: left;
`;

const pageLayoutStyle = css`
  width: 100%;
  height: 100%;
  margin: 0;
`;

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
      <Grid container spacing={2} direction="row" css={pageLayoutStyle}>
        {errorStatus}
        {errorMessage}
      </Grid>
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
