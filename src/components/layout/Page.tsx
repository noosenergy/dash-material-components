import React from 'react';
import {Box, Grid} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Error from '../../fragments/Error';
import {DashComponentProps} from 'props';

const useStyles = makeStyles(() => ({
  pageLayout: {
    // Contain the entire page
    width: '100%',
    height: '100%'
  }
}));

/**
 * Page component, used to wrap section and card components
 * Dashboard > Page
 */
const Page = ({
  id = 'page',
  children,
  orientation = 'columns',
  errorStatus = null,
  errorMessage = ''
}: PageProps) => {
  const classes = useStyles();

  // Variables
  const pageDirection = orientation === 'columns' ? 'row' : 'column';

  // Configure flex versus parent container
  const elements =
    errorStatus != null ? <Error status={errorStatus} message={errorMessage} /> : children;

  return (
    <Box id={id} sx={{flexGrow: 1}}>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={2}
        direction={pageDirection}
        className={classes.pageLayout}
      >
        {elements}
      </Grid>
    </Box>
  );
};

// TypeScript props type
type PageProps = {
  /** Page general orientation (rows or columns) */
  orientation?: 'columns' | 'rows';

  /** Error status code */
  errorStatus?: number;

  /** Error message */
  errorMessage?: string;
} & Partial<DashComponentProps>;

export default Page;
