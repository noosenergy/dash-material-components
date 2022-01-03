import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  FormControl,
  FormHelperText,
  Chip,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';

import Input from '../../fragments/Input.jsx';

/**
 * DropDown component
 */
export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.buildDropdownSelect = this.buildDropdownSelect.bind(this);
  }

  handleDropdownChange = (event) => {
    // Fire Dash-assigned callback
    this.props.setProps({selected: event.target.value});
  };

  buildDropdownSelect = (selected) => {
    return (
      <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
        {selected.map((i) => (
          <Chip key={i} label={this.props.options[i]} />
        ))}
      </Box>
    );
  };

  render() {
    // props & state
    const {id, labelText, helperText, options, selected} = this.props;

    // locals
    let menuLabel;
    let menuHelper;
    let menuElements = [];

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
        <MenuItem key={i} value={i}>
          {option}
        </MenuItem>
      );
    });

    // Render form control
    return (
      <Box id={id} m={2} maxWidth={200}>
        <FormControl variant="outlined" fullWidth>
          {menuLabel ? menuLabel : null}
          <Select
            labelId={`${id}-label`}
            label={labelText}
            multiple
            value={selected}
            onChange={this.handleDropdownChange}
            // input={<Input />}
            renderValue={this.buildDropdownSelect}
          >
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
  // No option selected by default
  selected: [],
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

  /** Array of options to select in the dropdown form */
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,

  /** Active selection indices */
  selected: PropTypes.arrayOf(PropTypes.number),
};
