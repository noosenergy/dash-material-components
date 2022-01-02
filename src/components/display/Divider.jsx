import React, {Component} from 'react';

import {Divider as MuiDivider} from '@material-ui/core';

/**
 * Divider component from Material UI
 * https://mui.com/components/divider/
 */
export default class Divider extends Component {
  render() {
    return <MuiDivider m={2} />;
  }
}

Divider.propTypes = {
  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,
};
