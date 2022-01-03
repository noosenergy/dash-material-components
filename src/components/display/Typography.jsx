import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Box, Typography as MuiTypography} from '@material-ui/core';

/**
 * Typography component from Material UI
 * https://mui.com/components/typography/
 */
export default class Typography extends Component {
  constructor(props) {
    super(props);
    this.state = {text: props.text};
  }

  UNSAFE_componentWillReceiveProps = (nextProps, nextContent) => {
    // Make sure state remain in sync with received props
    if (nextProps.text !== this.state.text) this.setState({text: nextProps.text});
  };

  render() {
    // Props & state
    const {id, component, variant} = this.props;
    let {text} = this.state;

    // Render text
    return (
      <Box id={id}>
        <MuiTypography component={component} variant={variant} gutterBottom>
          {text}
        </MuiTypography>
      </Box>
    );
  }
}

Typography.defaultProps = {
  id: 'text',
  component: 'h6',
  variant: 'h6',
};

Typography.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Typography HTML node type */
  component: PropTypes.string,

  /** Typography MUI style type */
  variant: PropTypes.string,

  /** Typography text content */
  text: PropTypes.string,
};
