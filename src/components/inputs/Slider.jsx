import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Box, FormControl, FormLabel, Slider as MuiSlider, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
  // remove updown arrow buttons from TextField
  input: {
    '& input': {
      marginTop: '-5px',
      textAlign: 'center',
      padding: "0 0 2px 0",
    }
  }
});

const inputIsValid = (value, minValue, maxValue) => {
  // not numeric or '-' sign
  if (!/^[-]?[0-9]+$/i.test(value)) return false;

  // check if within range
  value = Number(value);
  if (value < minValue || value > maxValue) return false;

  return true;
};

/**
 * Slider component
 */
const Slider = (props) => {
  const {
    id,
    labelText,
    width,
    minValue,
    maxValue,
    stepValue,
    marks,
    selected,
    setProps,
    showInputText
  } = props;

  const classes = useStyles();
  const [inputValue, setInputValue] = useState(String(selected));
  const [prevInputValue, setPrevInputValue] = useState(inputValue);

  const handleSliderChange = (event, value) => {
    setInputValue(String(value));
    setPrevInputValue(String(value));
    // Fire Dash-assigned callback
    setProps({selected: value});
  };

  const handleInputChange = (event) => {
    let value = event.target.value;
    const isValid = inputIsValid(value, minValue, maxValue);

    if (isValid) {
      setPrevInputValue(value);
      setInputValue(value);
      // Fire Dash-assigned callback
      setProps({selected: Number(value)});
    }
    // check if incomplete number
    else if (value === '' || value === '-') {
      setInputValue(value);
    }
    // else leave input value as is
  };

  // Fetch slider header
  const sliderLabel = labelText ? <FormLabel>{labelText}</FormLabel> : null;

  const numOfDigits = Math.max(maxValue.toString().length, minValue.toString().length);
  const inputText = showInputText ? (
    <Box ml={1.5} width={`${numOfDigits + 3}ch`}>
      <TextField
        value={inputValue}
        onChange={handleInputChange}
        variant="standard"
        className={classes.input}
        size="small"
      />
    </Box>
  ) : null;

  // Configure slider controls
  const sliderControls = {
    value: selected,
    onChange: handleSliderChange,
    min: minValue,
    max: maxValue,
    step: stepValue,
    marks: marks || true
  };

  // Render slider form
  return (
    <Box id={id} m={2} width={width}>
      <FormControl variant="standard" fullWidth>
        {sliderLabel}
        <Box display="flex">
          <MuiSlider
            size="small"
            aria-labelledby="slider"
            valueLabelDisplay="auto"
            {...sliderControls}
          />
          {inputText}
        </Box>
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
  selected: 50,
  showInputText: false
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
  selected: PropTypes.number,

  /** Enable input text */
  showInputText: PropTypes.bool
};

export default Slider;
