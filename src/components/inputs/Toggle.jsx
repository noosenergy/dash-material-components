import React from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import {ToggleButton, ToggleButtonGroup} from '@mui/material';

/**
 * Toggle component
 */
const Toggle = (props) => {
  // First option selected by default if no default provided
  const {id, options, selected, orientation, margin, disabled, setProps} = props;
  if (selected === undefined) {
    setProps({selected: options[0]});
  }

  const handleToggleChange = (event, value) => {
    // Enforce at least one active selection
    if (value !== null) {
      // Fire Dash-assigned callback
      setProps({selected: value});
    }
  };

  // Fetch toggle buttons
  const toggleElements = options.map((option, i) => (
    <ToggleButton key={i} value={option} disabled={disabled}>
      {option}
    </ToggleButton>
  ));

  // Render toggle group
  return (
    <Box id={id} m={margin}>
      <ToggleButtonGroup
        size="small"
        orientation={orientation}
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
  orientation: 'horizontal',
  margin: 2
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
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Margin of the component */
  margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Disable component */
  disabled: PropTypes.bool
};

export default Toggle;
