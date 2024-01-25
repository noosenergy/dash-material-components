import React from 'react';
import {Box, Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select} from '@mui/material';
import {DashComponentProps} from 'props';

/**
 * Dropdown component
 */
const Dropdown = ({
  id = 'select',
  labelText,
  helperText,
  width = '100%',
  margin = 2,
  options,
  multiple = true,
  selected = [],
  setProps,
  disabled = false
}: DropdownProps) => {
  const handleDropdownChange = (event) => {
    // Enforce selection to be an array in all cases
    const selected = event.target.value;
    // Fire Dash-assigned callback
    setProps({selected: multiple ? selected : [selected]});
  };

  const buildDropdownSelect = (selected) => {
    return (
      <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
        {selected.map((option, i) => (
          <Chip key={i} label={option} />
        ))}
      </Box>
    );
  };

  // locals
  let menuLabel;
  let menuHelper;
  const menuElements: JSX.Element[] = [];

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

  // Configure menu controls
  const menuControls = {
    value: selected,
    multiple: multiple,
    onChange: handleDropdownChange,
    renderValue: buildDropdownSelect
  };

  // Render form control
  return (
    <Box id={id} m={margin} width={width}>
      <FormControl variant="outlined" fullWidth disabled={disabled}>
        {menuLabel ? menuLabel : null}
        <Select labelId={`${id}-label`} label={labelText} id={`${id}-select`} {...menuControls}>
          {menuElements}
        </Select>
        {menuHelper ? menuHelper : null}
      </FormControl>
    </Box>
  );
};

// TypeScript props type
type DropdownProps = {
  /** Text to display in the dropdown form, when no items are selected */
  labelText?: string;
  /** Text to display under the dropdown form */
  helperText?: string;
  /** Width of dropdown form */
  width?: string | number;
  /** Margin of the component */
  margin?: string | number;
  /** Array of options to select in the dropdown form */
  options: Array<string | number>;
  /** Allow multiple selections */
  multiple?: boolean;
  /** Active option selection */
  selected?: Array<string | number>;
  /** Disabled the component */
  disabled?: boolean;
} & DashComponentProps;

export default Dropdown;
