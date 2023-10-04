import React from 'react';
import PropTypes from 'prop-types';
import {Box, FormControl, FormLabel, Slider as MuiSlider} from '@material-ui/core';

/**
 * Slider component
 */
const Slider = (props) => {
  const {id, labelText, width, minValue, maxValue, stepValue, marks, selected, setProps} = props;

  const handleSliderChange = (event, value) => {
    // Fire Dash-assigned callback
    setProps({selected: value});
  };

  // Fetch slider header
  const sliderLabel = labelText ? <FormLabel>{labelText}</FormLabel> : null;

  // Configure slider controls
  const sliderControls = {
    value: selected,
    onChange: handleSliderChange,
    min: minValue,
    max: maxValue,
    step: stepValue,
    marks: marks ? marks : true
  };

  // Render slider form
  return (
    <Box id={id} m={2} width={width}>
      <FormControl variant="standard" fullWidth>
        {sliderLabel}
        <MuiSlider
          size="small"
          aria-labelledby="slider"
          valueLabelDisplay="auto"
          {...sliderControls}
        />
      </FormControl>
    </Box>
  );
};

Slider.defaultProps = {
  id: 'slider',
  width: '100%',
  maxValue: 100,
  minValue: 0,
  stepValue: 10,
  selected: 50
};

Slider.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Text to display above the slider form */
  labelText: PropTypes.string,

  /** Width of slider form */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Maximum selection allowed in the slider */
  maxValue: PropTypes.number,

  /** Minimum selection allowed in the slider */
  minValue: PropTypes.number,

  /** Slider selection increment */
  stepValue: PropTypes.number,

  /** Array of selection marks to display below the slider form */
  marks: PropTypes.arrayOf(
    PropTypes.exact({
      /** Mark value */
      value: PropTypes.number,
      /** Mark label */
      label: PropTypes.string
    })
  ),

  /** Active slider selection */
  selected: PropTypes.number
};

export default Slider;
