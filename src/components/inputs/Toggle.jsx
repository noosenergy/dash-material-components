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
    // First option selected by default if no default provided
    const {options, selected} = this.props;
    this.props.selected = selected === undefined ? options[0] : selected;
  }

  handleToggleChange = (event, value) => {
    // Enforce at least one active selection
    if (value !== null) {
      // Fire Dash-assigned callback
      this.props.setProps({selected: value});
    }
  };

  render() {
    // props & state
    const {id, options, orientation, selected} = this.props;

    // locals
    let toggleElements = [];
    const toggleControls = {
      value: selected,
      exclusive: true,
      onChange: this.handleToggleChange
    };

    // Fetch toggle buttons
    options.forEach((option, i) => {
      toggleElements.push(
        <ToggleButton key={i} value={option}>
          {option}
        </ToggleButton>
      );
    });

    // Render toggle group
    return (
      <Box id={id} m={2}>
        <ToggleButtonGroup size="small" orientation={orientation} {...toggleControls}>
          {toggleElements}
        </ToggleButtonGroup>
      </Box>
    );
  }
}

Toggle.defaultProps = {
  id: 'toggle',
  orientation: 'horizontal'
};

Toggle.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Toggle orientation (horizontal or vertical) */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),

  /** Array of options to select through the toggle */
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,

  /** Selected toggle index */
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
