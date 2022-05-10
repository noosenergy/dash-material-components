import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';

/**
 * Dropdown component
 */
export default class Dropdown extends Component {
  handleDropdownChange = (event) => {
    // Fire Dash-assigned callback
    this.props.setProps({selected: event.target.value});
  };

  buildDropdownSelect = (selected) => {
    return (
      <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
        {selected.map((option, i) => (
          <Chip key={i} label={option} />
        ))}
      </Box>
    );
  };

  render() {
    // props & state
    const {id, labelText, helperText, width, options, selected} = this.props;

    // locals
    let menuLabel;
    let menuHelper;
    let menuElements = [];
    const menuControls = {
      value: selected,
      multiple: true,
      onChange: this.handleDropdownChange,
      renderValue: this.buildDropdownSelect
    };

    // Fetch menu header
    if (labelText) {
      menuLabel = <InputLabel id={`${id}-label`}>{labelText}</InputLabel>;
    }

    // Fetch menu footer
    if (helperText) {
      menuHelper = <FormHelperText>{helperText}</FormHelperText>;
    }

    // Fetch menu items
    options.forEach((option, i) => {
      menuElements.push(
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      );
    });

    // Render form control
    return (
      <Box id={id} m={2} width={width}>
        <FormControl variant="outlined" fullWidth>
          {menuLabel ? menuLabel : null}
          <Select labelId={`${id}-label`} label={labelText} id={`${id}-select`} {...menuControls}>
            {menuElements}
          </Select>
          {menuHelper ? menuHelper : null}
        </FormControl>
      </Box>
    );
  }
}

Dropdown.defaultProps = {
  id: 'select',
  width: '100%',
  // No option selected by default
  selected: []
};

Dropdown.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Text to display in the dropdown form, when no items are selected */
  labelText: PropTypes.string,

  /** Text to display under the dropdown form */
  helperText: PropTypes.string,

  /** Width of dropdown form */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Array of options to select in the dropdown form */
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,

  /** Active option selection */
  selected: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};
