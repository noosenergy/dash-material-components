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
    this.state = {selected: props.selected};
  }

  handleDropdownChange = (event) => {
    this.setState({selected: event.target.value});

    if (typeof this.props.setProps === 'function') {
      this.props.setProps({selected: event.target.value});
    }
  };

  UNSAFE_componentWillReceiveProps = (nextProps, nextContent) => {
    if (nextProps.selected !== this.state.selected) this.setState({selected: nextProps.selected});
  };

  buildDropdownSelect = (selected) => {
    const {options} = this.props;
    return (
      <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
        {selected.map((i) => (
          <Chip key={i} label={options[i].label} />
        ))}
      </Box>
    );
  };

  render() {
    // props & state
    const {id, labelText, helperText, options} = this.props;
    let {selected} = this.state;

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
          {option.label}
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
  options: PropTypes.arrayOf(
    PropTypes.exact({
      /** Option label */
      label: PropTypes.string,
    })
  ),

  /** Active selections in the dropdown form */
  selected: PropTypes.arrayOf(PropTypes.number),
};
