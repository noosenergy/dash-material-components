import React from 'react';
import PropTypes from 'prop-types';
import {TextField, Box} from '@material-ui/core';
import {Autocomplete as MuiAutocomplete} from '@material-ui/lab';

/**
 * Autocomplete component
 */
const Autocomplete = (props) => {
  const {
    id,
    labelText,
    selected,
    options,
    freeSolo,
    groupByField,
    multiple,
    variant,
    size,
    limitTags,
    width,
    margin,
    setProps
  } = props;

  const handleChange = (event, value) => {
    // In case of freeSolo, the new value can be a string
    if (freeSolo) {
      if (typeof value === 'string') {
        value = {label: value, value: value};
      }

      // if multiple and last array element is string
      else if (multiple && value.length && typeof value[value.length - 1] === 'string') {
        // pop last element
        const newValue = value.pop();
        // append new element
        value.push({label: newValue, value: newValue});
      }
    }

    // Fire Dash-assigned callback
    setProps({selected: multiple ? value : [value]});
  };

  return (
    <Box id={id} m={margin} width={width}>
      <MuiAutocomplete
        id={`${id}-input`}
        size={size}
        value={multiple ? selected : selected[0]}
        options={options}
        getOptionLabel={(option) => option.label}
        freeSolo={freeSolo}
        groupBy={groupByField ? (option) => option[groupByField] : undefined}
        multiple={multiple}
        limitTags={limitTags}
        onChange={handleChange}
        fullWidth
        renderInput={(params) => <TextField {...params} label={labelText} variant={variant} />}
      />
    </Box>
  );
};

Autocomplete.defaultProps = {
  id: 'autocomplete',
  selected: [],
  variant: 'outlined',
  size: 'small',
  multiple: false,
  width: '100%',
  margin: 2
};

const optionsType = PropTypes.arrayOf(
  PropTypes.shape({
    /** Option label */
    label: PropTypes.string.isRequired,
    /** Option value */
    value: PropTypes.string.isRequired
  })
);

Autocomplete.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Text to display above the slider form */
  labelText: PropTypes.string,

  /** Mui TextField size parameter */
  size: PropTypes.oneOf(['small', 'medium']),

  /** Variant of mui input style */
  variant: PropTypes.oneOf(['filled', 'outlined', 'standard']),

  /** Current value */
  selected: optionsType,

  /** Options to display */
  options: optionsType,

  /** Limit number of selected values */
  limitTags: PropTypes.number,

  /** Enable free solo */
  freeSolo: PropTypes.bool,

  /** Group options */
  groupByField: PropTypes.string,

  /** Enable multiple selection */
  multiple: PropTypes.bool,

  /** Component width */
  width: PropTypes.string,

  /** Component margin */
  margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Autocomplete;
