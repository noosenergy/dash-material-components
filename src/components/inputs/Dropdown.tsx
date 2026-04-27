import React from 'react';
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select
} from '@mui/material';
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
  const handleChange = (event) => {
    const value = event.target.value;
    setProps({selected: multiple ? value : [value]});
  };

  return (
    <Box id={id} m={margin} width={width}>
      <FormControl variant="outlined" fullWidth disabled={disabled}>
        {labelText && (
          <InputLabel id={`${id}-label`} shrink>
            {labelText}
          </InputLabel>
        )}
        <Select
          labelId={`${id}-label`}
          label={labelText}
          id={`${id}-select`}
          value={selected}
          multiple={multiple}
          displayEmpty
          onChange={handleChange}
          renderValue={(selected: Array<string | number>) => (
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
              {selected.map((option) => (
                <Chip key={option} label={option} />
              ))}
            </Box>
          )}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {multiple && (
                <Checkbox
                  size="small"
                  checked={selected.includes(option)}
                  color="secondary"
                  sx={{p: 0.5, mr: 0.5}}
                />
              )}
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

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
