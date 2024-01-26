import React, {useState} from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Slider as MuiSlider,
  TextField,
  InputAdornment
} from '@mui/material';
import {DashComponentProps} from 'props';
import {css} from '@emotion/react';

const inputStyle = css`
  & input {
    margintop: -5px;
    textalign: center;
    padding: 0 0 2px 0;
  }
`;

const adornmentStyle = css`
  margin: 0 0 7px 0;
  & p {
    fontsize: smaller;
  }
`;

const validInput = (
  value: string,
  inputType: 'integer' | 'float',
  minValue: number,
  maxValue: number,
  precision: number
): boolean => {
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
  const valueNumber = Number(value);
  if (valueNumber < minValue || valueNumber > maxValue) return false;

  return true;
};

const countUppercase = (str: string): number => {
  return (str.match(/[A-Z]/g) || []).length;
};

/**
 * Slider component
 */
const Slider = ({
  id = 'slider',
  labelText,
  width = '100%',
  margin = 2,
  minValue = 0,
  maxValue = 100,
  stepValue = 10,
  marks,
  selected = 50,
  inputType = null,
  precision = 2,
  inputLeftAdornment = null,
  inputRightAdornment = null,
  disabled = false,
  setProps
}: SliderProps) => {
  // Initialize input value with correct precision
  const [inputValue, setInputValue] = useState<string>(
    String(selected.toFixed(inputType === 'float' ? precision : 0))
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prevInputValue, setPrevInputValue] = useState(inputValue);

  const handleSliderChange = (event, value) => {
    setInputValue(String(value));
    setPrevInputValue(String(value));
    // Fire Dash-assigned callback
    setProps({selected: value});
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

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
        css={inputStyle}
        size="small"
        disabled={disabled}
        InputProps={{
          startAdornment: inputLeftAdornment ? (
            <InputAdornment position="start" css={adornmentStyle}>
              {inputLeftAdornment}
            </InputAdornment>
          ) : null,
          endAdornment: inputRightAdornment ? (
            <InputAdornment position="end" css={adornmentStyle}>
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
            valueLabelDisplay={inputType ? 'auto' : 'on'}
            {...sliderControls}
          />
          {inputText}
        </Box>
      </FormControl>
    </Box>
  );
};

// TypeScript props type
type SliderProps = {
  /** Text to display above the slider form */
  labelText?: string;
  /** Width of slider form */
  width?: string | number;
  /** Margin of the component */
  margin?: string | number;
  /** Maximum selection allowed in the slider */
  maxValue?: number;
  /** Minimum selection allowed in the slider */
  minValue?: number;
  /** Slider selection increment */
  stepValue?: number;
  /** Array of selection marks to display below the slider form */
  marks?: {value: number; label: string}[];
  /** Active slider selection */
  selected?: number;
  /** Input type, if set an input text is displayed alongside the slider */
  inputType?: 'integer' | 'float' | null;
  /** Number of decimal places */
  precision?: number;
  /** InputText LEFT adornment */
  inputLeftAdornment?: string;
  /** InputText RIGHT adornment */
  inputRightAdornment?: string;
  /** Disable the component */
  disabled?: boolean;
} & DashComponentProps;

export default Slider;
