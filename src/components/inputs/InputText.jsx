import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {TextField} from '@material-ui/core';

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
    if ((minValue && value < minValue) || (maxValue && value > maxValue)) return false;
  }

  // text - enforce length limit
  else if (length && value.length > length) return false;

  return true;
};

/**
 * InputText component
 */
const InputText = (props) => {
  const {
    id,
    minValue,
    maxValue,
    labelText,
    inputType,
    multiline,
    variant,
    maxLength,
    autoFocus,
    size,
    setProps,
    value,
    precision
  } = props;

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
    <TextField
      id={id}
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
    />
  );
};

InputText.defaultProps = {
  inputType: 'text',
  value: '',
  maxValue: null,
  minValue: null,
  precision: 2,
  multiline: false,
  variant: 'outlined',
  autoFocus: false,
  size: 'small'
};

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
  size: PropTypes.oneOf(['small', 'medium'])
};

export default InputText;
