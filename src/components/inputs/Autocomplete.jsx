import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
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
    setProps
  } = props;

  const handleChange = (event, value) => {
    // Fire Dash-assigned callback
    setProps({selected: multiple ? value : [value]});
  };

  return (
    <MuiAutocomplete
      id={id}
      size={size}
      value={multiple ? selected : selected[0] || null}
      options={options}
      getOptionLabel={(option) => option.label}
      freeSolo={freeSolo}
      groupBy={groupByField ? (option) => option[groupByField] : undefined}
      multiple={multiple}
      limitTags={limitTags}
      onChange={handleChange}
      style={{width: width}}
      renderInput={(params) => <TextField {...params} label={labelText} variant={variant} />}
    />
  );
};

Autocomplete.defaultProps = {
  id: 'autocomplete',
  selected: [],
  variant: 'outlined',
  size: 'small',
  multiple: false,
  width: '100%'
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
  width: PropTypes.string
};

export default Autocomplete;
