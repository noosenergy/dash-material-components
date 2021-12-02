import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Box as MuiBox } from '@material-ui/core';

/**
 * Box component from Material UI
 * https://mui.com/components/box/
 */
export default class Box extends Component {

    render() {
      const {sx} = this.props;

      return (
        <MuiBox sx={sx}>
          {this.props.children}
        </MuiBox>
      )
    }

}

Box.defaultProps = {
  children: null,
  sx: {},
};

Box.propTypes = {
  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** All Material system properties are available via the `sx prop`
   * Allow additional css styles to be applied to the component
  */
  sx: PropTypes.object
};
