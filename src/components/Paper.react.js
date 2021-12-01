import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Paper as MuiPaper } from '@mui/material';

/**
 * Paper component from Material UI
 * https://mui.com/components/paper/
 */
 export default class Paper extends Component {

  render() {
    const {elevation, square} = this.props;

    return (
      <MuiPaper elevation={elevation} square={square}>
        {this.props.children}
      </MuiPaper>
    )
  }

}

Paper.defaultProps = {
  children: null,
  elevation: 1,
  square: false,
};

Paper.propTypes = {
  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** This number represents the elevation of the paper shadow */
  elevation: PropTypes.number,

  /** By default, the paper will have a border radius.
   * Set this to true to generate a paper with sharp corners.
   */
  square: PropTypes.bool
};
