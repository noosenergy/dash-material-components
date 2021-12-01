import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { makeStyles } from '@mui/styles';

import theme from '../utils/theme';
import Page from '../fragments/Page.react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
});

/**
 * Main dasboard component, initializing a Material UI theme
 * https://mui.com/customization/theming/
 */
export default class Dashboard extends Component {

  render() {
    const classes = useStyles();
    const {orientation, verticalLayout} = this.props;

    return (
      // Enforce a theme on the entire page
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box className={`dashboard ${classes.root}`}>
          <Page
            orientation={orientation}
            verticalLayout={verticalLayout}
            children={this.props.children}
          />
        </Box>
      </ThemeProvider>
    );
  }

}

Dashboard.defaultProps = {
  children: null,
  orientation: 'columns',
  verticalLayout: 'fill',
};

Dashboard.propTypes = {
  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** Dashboard general orientation (rows or columns) */
  orientation: PropTypes.string,

  /** Dashboard general layout (fill or scroll) */
  verticalLayout: PropTypes.string,
};
