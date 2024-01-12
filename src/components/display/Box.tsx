import React from 'react';
import PropTypes from 'prop-types';
import {Box as MuiBox} from '@mui/material';

/**
 * Box component from Material UI
 * https://mui.com/components/box/
 */
const Box = (props) => {
  const {sx, children} = props;
  return <MuiBox sx={sx}>{children}</MuiBox>;
};

Box.defaultProps = {
  sx: {}
};

Box.propTypes = {
  /** Can be used to render elements inside the component */
  children: PropTypes.node,

  /** All Material system properties are available via the `sx prop`
   * Allow additional css styles to be applied to the component
   */
  sx: PropTypes.object
};

export default Box;
