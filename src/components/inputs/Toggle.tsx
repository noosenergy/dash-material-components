import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import {ToggleButton, ToggleButtonGroup} from '@mui/material';
import {DashComponentProps} from 'props';

/**
 * Toggle component
 */
const Toggle = ({
  id = 'toggle',
  options,
  selected,
  orientation = 'horizontal',
  margin = 2,
  disabled = false,
  setProps
}: ToggleProps) => {
  useEffect(() => {
    // First option selected by default if no default provided
    if (!selected) {
      setProps({selected: options[0]});
    }
  }, [selected]);

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

// TypeScript props type
type ToggleProps = {
  /** Toggle orientation (horizontal or vertical) */
  orientation?: 'horizontal' | 'vertical';
  /** Array of options to select through the toggle */
  options: Array<string | number>;
  /** Selected toggle index */
  selected?: string | number;
  /** Margin of the component */
  margin?: string | number;
  /** Disable component */
  disabled?: boolean;
} & DashComponentProps;

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

Toggle.defaultProps = {};

export default Toggle;
