import React, {ReactNode} from 'react';
import PropTypes from 'prop-types';
import {Box as MuiBox} from '@mui/material';
import {DashComponentProps} from 'props';

/**
 * Box component from Material UI
 * https://mui.com/components/box/
 */
const Box = ({sx = {}, children}: BoxProps) => {
  return <MuiBox sx={sx}>{children}</MuiBox>;
};

type BoxProps = {
  children?: ReactNode;
  sx?: object;
} & DashComponentProps;

Box.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object
};

Box.defaultProps = {};

export default Box;
