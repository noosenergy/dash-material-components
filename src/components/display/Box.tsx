import React, {ReactNode} from 'react';
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
  /** All Material system properties are available via the `sx prop`
   * Allow additional css styles to be applied to the component
   */
  sx?: object;
} & DashComponentProps;

export default Box;
