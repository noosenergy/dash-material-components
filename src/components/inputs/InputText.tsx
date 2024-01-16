import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {TextField, InputAdornment, Box} from '@mui/material';
import {DashComponentProps} from 'props';

const validInput = (value, inputType, minValue, maxValue, precision, length) => {
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

  // any number
  if (inputType === 'integer' || inputType === 'float') {
    // misplaced '-' sign
    if (value.split('-').length > 2) return false;
    // check if within range
    value = Number(value);
    if ((minValue != null && value < minValue) || (maxValue != null && value > maxValue))
      return false;
  }

  // text - enforce length limit
  else if (length && value.length > length) return false;

  return true;
};

/**
 * InputText component
 */
const InputText = ({
  id = 'input-text',
  minValue = null,
  maxValue = null,
  labelText,
  inputType = 'text',
  multiline = false,
  variant = 'outlined',
  maxLength,
  autoFocus = false,
  size = 'small',
  width = null,
  margin = 2,
  value = '',
  precision = 2,
  adornmentLeft = null,
  adornmentRight = null,
  disabled = false,
  error = false,
  setProps
}: InputTextProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (event) => {
    let nextValue = event.target.value;
    // DEBUG PRINT: console.log(`nextValue: ${nextValue}, inputValue: ${inputValue}`);
    const isValid = validInput(nextValue, inputType, minValue, maxValue, precision, maxLength);

    if (isValid) {
      setInputValue(nextValue);
      // Fire Dash-assigned callback
      setProps({value: nextValue});
    }
    // Check if incomplete number
    else if (nextValue == '' || nextValue == '-') {
      setInputValue(nextValue);
    }
    // ELSE DO NOTHING, leave input value as is
  };

  return (
    <Box id={id} m={margin} width={width}>
      <TextField
        value={inputValue}
        type={inputType}
        size={size}
        label={labelText}
        InputLabelProps={{
          shrink: true
        }}
        multiline={multiline}
        variant={variant}
        onChange={handleChange}
        autoFocus={autoFocus}
        InputProps={{
          startAdornment: adornmentLeft ? (
            <InputAdornment position="start">{adornmentLeft}</InputAdornment>
          ) : null,
          endAdornment: adornmentRight ? (
            <InputAdornment position="end">{adornmentRight}</InputAdornment>
          ) : null
        }}
        fullWidth={width !== null}
        disabled={disabled}
        error={error}
      />
    </Box>
  );
};

// TypeScript props type
type InputTextProps = {
  labelText?: string;
  value?: string | number;
  maxValue?: number | null;
  minValue?: number | null;
  precision?: number;
  inputType?: 'text' | 'integer' | 'float';
  multiline?: boolean;
  variant?: 'filled' | 'outlined' | 'standard';
  maxLength?: number;
  autoFocus?: boolean;
  size?: 'small' | 'medium';
  width?: string | null;
  margin?: string | number;
  adornmentLeft?: string;
  adornmentRight?: string;
  disabled?: boolean;
  error?: boolean;
} & DashComponentProps;

InputText.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Text to display above the slider form */
  labelText: PropTypes.string,

  /** Current value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Maximum selection allowed in the slider */
  maxValue: PropTypes.number,

  /** Minimum selection allowed in the slider */
  minValue: PropTypes.number,

  /** Number of decimal places */
  precision: PropTypes.number,

  /** Input type */
  inputType: PropTypes.oneOf(['text', 'integer', 'float']),

  /** Multiline input */
  multiline: PropTypes.bool,

  /** Variant of mui input style */
  variant: PropTypes.oneOf(['filled', 'outlined', 'standard']),

  /** Text length */
  maxLength: PropTypes.number,

  /** autoFocus */
  autoFocus: PropTypes.bool,

  /** Mui TextField size parameter */
  size: PropTypes.oneOf(['small', 'medium']),

  /** Component width */
  width: PropTypes.string,

  /** Component margin */
  margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Adornment on the left of the input */
  adornmentLeft: PropTypes.string,

  /** Adornment on the right of the input */
  adornmentRight: PropTypes.string,

  /** Input disabled */
  disabled: PropTypes.bool,

  /** Input error */
  error: PropTypes.bool
};

InputText.defaultProps = {};

export default InputText;
