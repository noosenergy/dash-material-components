import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { ThemeProvider } from '@mui/material/styles';
import { Container as MuiContainer } from '@mui/material';

import theme from '../utils/theme';

/**
 * Container component from Material UI
 * https://mui.com/components/container/
 */
export default class Container extends Component {

  render() {
    const {id, maxWidth, fixed} = this.props;

    return (
      <div id={id}>
        <ThemeProvider theme={theme}>
          <MuiContainer maxWidth={maxWidth} fixed={fixed}>
            {this.props.children}
          </MuiContainer>
        </ThemeProvider>
      </div>
    )
  }

}

Container.defaultProps = {
  id: null,
  children: null,
  maxWidth: 'sm',
  fixed: false,
};

Container.propTypes = {
  /** The ID used to identify this component in Dash callbacks */
  id: PropTypes.string,

  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** Maximum width boundary for the container */
  maxWidth: PropTypes.string,

  /** If true, the container max-width will be fixed */
  fixed: PropTypes.bool
};
