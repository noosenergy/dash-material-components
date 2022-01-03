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
    this.handleToggleChange = this.handleToggleChange.bind(this);
  }

  handleToggleChange = (event, value) => {
    // Fire Dash-assigned callback
    this.props.setProps({selected: value});
  };

  render() {
    // props & state
    const {id, options, orientation, selected} = this.props;

    // locals
    let toggleElements = [];

    // Fetch toggle buttons
    options.forEach((option, i) => {
      toggleElements.push(
        <ToggleButton key={i} value={i}>
          {option}
        </ToggleButton>
      );
    });

    // Render toggle group
    return (
      <Box id={id} m={2}>
        <ToggleButtonGroup
          size="small"
          orientation={orientation}
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
  id: 'toggle',
  orientation: 'horizontal',
  // First option selected by default
  selected: 0,
};

Toggle.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Array of options to select through the toggle */
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,

  /** Toggle orientation (horizontal or vertical) */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),

  /** Selected toggle index */
  selected: PropTypes.number,
};
