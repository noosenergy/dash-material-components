import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Box} from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';

/**
 * Toggle component
 */
export default class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = {selected: this.props.selected};
  }

  handleToggleChange = (event, value) => {
    this.setState({selected: value});

    if (typeof this.props.setProps === 'function') {
      this.props.setProps({selected: value});
    }
  };

  UNSAFE_componentWillReceiveProps = (nextProps, nextContent) => {
    if (nextProps.selected !== this.state.selected) this.setState({selected: nextProps.selected});
  };

  render() {
    // props & state
    const {id, options} = this.props;
    let {selected} = this.state;

    // locals
    let toggleElements = [];

    // Fetch toggle buttons
    options.forEach((option, i) => {
      const label = option.label;
      toggleElements.push(
        <ToggleButton key={i} value={label.toLowerCase()}>
          {label}
        </ToggleButton>
      );
    });

    // Render toggle group
    return (
      <Box id={id} m={2}>
        <ToggleButtonGroup
          size="small"
          value={selected}
          onChange={this.handleToggleChange}
          exclusive
        >
          {toggleElements}
        </ToggleButtonGroup>
      </Box>
    );
  }
}

Toggle.defaultProps = {
  id: 'table',
};

Toggle.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Array of toggle options to render */
  options: PropTypes.arrayOf(
    PropTypes.exact({
      /** Toggle label */
      label: PropTypes.string,
    })
  ),

  /** Selected toggle label */
  selected: PropTypes.string,
};
