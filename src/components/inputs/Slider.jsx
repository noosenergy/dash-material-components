import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  FormControl,
  FormLabel,
  Slider as MuiSlider,
  TextField,
  InputAdornment
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
  // remove updown arrow buttons from TextField
  input: {
    '& input': {
      marginTop: '-5px',
      textAlign: 'center',
      padding: '0 0 2px 0'
    }
  },

  // style adornments
  adornment: {
    margin: '0 0 7px 0',
    '& p': {
      fontSize: 'smaller'
    }
  }
});

const validInput = (value, inputType, minValue, maxValue, precision) => {
  if (inputType === 'integer') {
    // not numeric or '-' sign
    if (!/^[-]?[0-9]+$/i.test(value)) return false;
  } else if (inputType === 'float') {
    // not numeric or ['-', '.'] signs
    if (!/^[-]?[0-9]+[.]?[0-9]*$/i.test(value)) return false;
    // too many decimal places
    const numParts = value.split('.');
    if (precision && numParts.length > 1 && numParts[1].length > precision) return false;
  }

  // Any number checks
  // check for misplaced '-' sign
  if (value.split('-').length > 2) return false;
  // check if within range
  value = Number(value);
  if (value < minValue || value > maxValue) return false;

  return true;
};

const countUppercase = (str) => {
  return (str.match(/[A-Z]/g) || []).length;
};

/**
 * Slider component
 */
const Slider = (props) => {
  const {
    id,
    labelText,
    width,
    margin,
    minValue,
    maxValue,
    stepValue,
    marks,
    selected,
    inputType,
    precision,
    inputLeftAdornment,
    inputRightAdornment,
    disabled,
    setProps
  } = props;

  const classes = useStyles();
  // Initialize input value with correct precision
  const [inputValue, setInputValue] = useState(
    String(selected.toFixed(inputType === 'float' ? precision : 0))
  );
  const [prevInputValue, setPrevInputValue] = useState(inputValue);

  const handleSliderChange = (event, value) => {
    setInputValue(String(value));
    setPrevInputValue(String(value));
    // Fire Dash-assigned callback
    setProps({selected: value});
  };

  const handleInputChange = (event) => {
    let value = event.target.value;

    if (validInput(value, inputType, minValue, maxValue, precision)) {
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

  // Calculate width of input text in characters
  let numOfDigits = Math.max(
    maxValue.toString().split('.')[0].length,
    minValue.toString().split('.')[0].length
  );
  // account for space taken by decimals
  if (inputType === 'float') numOfDigits += precision + 1;
  // account for space taken by '-'
  numOfDigits += 3;
  // account for space taken by adornments, take extra space for uppercase letters
  if (inputLeftAdornment)
    numOfDigits += inputLeftAdornment.length + countUppercase(inputLeftAdornment) * 1.8;
  if (inputRightAdornment)
    numOfDigits += inputRightAdornment.length + countUppercase(inputRightAdornment) * 1.8;

  const inputText = inputType ? (
    <Box ml={1.5} width={`${numOfDigits}ch`}>
      <TextField
        value={inputValue}
        onChange={handleInputChange}
        variant="standard"
        className={classes.input}
        size="small"
        disabled={disabled}
        InputProps={{
          startAdornment: inputLeftAdornment ? (
            <InputAdornment position="start" className={classes.adornment}>
              {inputLeftAdornment}
            </InputAdornment>
          ) : null,
          endAdornment: inputRightAdornment ? (
            <InputAdornment position="end" className={classes.adornment}>
              {inputRightAdornment}
            </InputAdornment>
          ) : null
        }}
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
    marks: marks || true,
    disabled: disabled
  };

  // Render slider form
  return (
    <Box id={id} m={margin} width={width}>
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
  margin: 2,
  maxValue: 100,
  minValue: 0,
  stepValue: 10,
  selected: 50,
  inputType: null,
  precision: 2,
  inputLeftAdornment: null,
  inputRightAdornment: null,
  disabled: false
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

  /** Margin of the component */
  margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

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

  /** Input type, if set an input text is displayed alongside the slider */
  inputType: PropTypes.oneOf(['integer', 'float', null]),

  /** Number of decimal places */
  precision: PropTypes.number,

  /** InputText LEFT adornment */
  inputLeftAdornment: PropTypes.string,

  /** InputText RIGHT adornment */
  inputRightAdornment: PropTypes.string,

  /** Disable the component */
  disabled: PropTypes.bool
};

export default Slider;
