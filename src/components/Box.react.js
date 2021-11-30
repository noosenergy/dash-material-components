import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { ThemeProvider } from '@mui/material/styles';
import { Box as MuiBox } from '@mui/material';

import theme from '../utils/theme';

/**
 * Box component from Material UI
 * https://mui.com/components/box/
 */
export default class Box extends Component {

    render() {
      const {id, sx} = this.props;

      return (
        <div id={id}>
          <ThemeProvider theme={theme}>
            <MuiBox sx={sx}>
              {this.props.children}
            </MuiBox>
          </ThemeProvider>
        </div>
      )
    }

}

Box.defaultProps = {
  id: null,
  children: null,
  sx: {},
};

Box.propTypes = {
  /** The ID used to identify this component in Dash callbacks */
  id: PropTypes.string,

  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** All Material system properties are available via the `sx prop`
   * Allow additional css styles to be applied to the component
  */
  sx: PropTypes.object
};
