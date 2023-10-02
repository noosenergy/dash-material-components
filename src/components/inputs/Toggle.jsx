import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Box} from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';

/**
 * Toggle component
 */
const Toggle = (props) => {
  // First option selected by default if no default provided
  const {options, selected} = props;
  if (selected === undefined) {
    props.setProps({selected: options[0]});
  }

  const handleToggleChange = (event, value) => {
    // Enforce at least one active selection
    if (value !== null) {
      // Fire Dash-assigned callback
      props.setProps({selected: value});
    }
  };

  // Fetch toggle buttons
  const toggleElements = options.map((option, i) => (
    <ToggleButton key={i} value={option}>
      {option}
    </ToggleButton>
  ));

  // Render toggle group
  return (
    <Box id={props.id} m={2}>
      <ToggleButtonGroup
        size="small"
        orientation={props.orientation}
        value={selected}
        exclusive
        onChange={handleToggleChange}
      >
        {toggleElements}
      </ToggleButtonGroup>
    </Box>
  );
};

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

export default Toggle;
