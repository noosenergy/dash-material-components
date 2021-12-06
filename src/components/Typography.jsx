import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Typography as MuiTypography} from '@material-ui/core';

/**
 * Typography component from Material UI
 * https://mui.com/components/typography/
 */
export default class Typography extends Component {
  render() {
    const {component, variant, text} = this.props;

    return (
      <MuiTypography component={component} variant={variant}>
        {text}
      </MuiTypography>
    );
  }
}

Typography.defaultProps = {
  component: 'h6',
  variant: 'h6',
  text: 'Neptune text',
};

Typography.propTypes = {
  /** Typography HTML node type */
  component: PropTypes.string,

  /** Typography MUI style type */
  variant: PropTypes.string,

  /** Typography text content */
  text: PropTypes.string,
};
