import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Container as MuiContainer } from '@mui/material';

/**
 * Container component from Material UI
 * https://mui.com/components/container/
 */
export default class Container extends Component {

  render() {
    const {maxWidth, fixed} = this.props;

    return (
      <MuiContainer maxWidth={maxWidth} fixed={fixed}>
        {this.props.children}
      </MuiContainer>
    )
  }

}

Container.defaultProps = {
  children: null,
  maxWidth: 'sm',
  fixed: false,
};

Container.propTypes = {
  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** Maximum width boundary for the container */
  maxWidth: PropTypes.string,

  /** If true, the container max-width will be fixed */
  fixed: PropTypes.bool
};
