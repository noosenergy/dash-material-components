import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { ThemeProvider } from '@mui/material/styles';
import { Paper as MuiPaper } from '@mui/material';

import theme from '../utils/theme';

/**
 * Paper component from Material UI
 * https://mui.com/components/paper/
 */
 export default class Paper extends Component {

  render() {
    const {id, elevation, square} = this.props;

    return (
      <div id={id}>
        <ThemeProvider theme={theme}>
          <MuiPaper elevation={elevation} square={square}>
            {this.props.children}
          </MuiPaper>
        </ThemeProvider>
      </div>
    )
  }

}

Paper.defaultProps = {
  id: null,
  children: null,
  elevation: 1,
  square: false,
};

Paper.propTypes = {
  /** The ID used to identify this component in Dash callbacks */
  id: PropTypes.string,

  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** This number represents the elevation of the paper shadow */
  elevation: PropTypes.number,

  /** By default, the paper will have a border radius.
   * Set this to true to generate a paper with sharp corners.
   */
  square: PropTypes.bool
};
