import React from 'react';
import PropTypes from 'prop-types';
import {TextField, Box} from '@material-ui/core';
import {Autocomplete as MuiAutocomplete} from '@material-ui/lab';
import {createFilterOptions} from '@material-ui/lab/Autocomplete';

const filter = createFilterOptions();

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

  const handleChange = (event, selection) => {
    // Always treat input as an array
    if (!multiple) selection = selection ? [selection] : [];

    // In case of freeSolo
    if (freeSolo && selection.length) {
      const newOption = selection.pop();
      // User pressed enter and new value is as string
      if (typeof newOption === 'string') {
        selection.push({label: newOption, value: newOption});
      }
      // User has clicked "Add option"
      else if (newOption.inputValue) {
        selection.push({label: newOption.inputValue, value: newOption.inputValue});
      }
      // User has selected an existing option
      else selection.push(newOption);
    }

    // Fire Dash-assigned callback
    setProps({selected: selection});
  };

  return (
    <Box id={id} m={margin} width={width}>
      <MuiAutocomplete
        id={`${id}-input`}
        size={size}
        value={multiple ? selected : selected[0] || null}
        options={options}
        getOptionLabel={(option) => option.label || option}
        renderOption={(option) => option.label}
        freeSolo={freeSolo}
        groupBy={groupByField ? (option) => option[groupByField] : undefined}
        multiple={multiple}
        limitTags={limitTags}
        onChange={handleChange}
        disableCloseOnSelect={multiple}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          // Suggest the creation of a new value
          if (params.inputValue !== '' && freeSolo) {
            filtered.push({
              value: params.inputValue,
              inputValue: params.inputValue,
              label: `Add "${params.inputValue}"`
            });
          }

          return filtered;
        }}
        fullWidth
        clearOnBlur
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
