import React, {useMemo, useEffect, useState} from 'react';
import {TextField, Box, Autocomplete as MuiAutocomplete} from '@mui/material';
import {createFilterOptions} from '@mui/material/Autocomplete';
import {debounce} from '@mui/material/utils';
import {DashComponentProps} from 'props';

const filter = createFilterOptions();

/**
 * Autocomplete component
 */
const Autocomplete = ({
  id = 'autocomplete',
  labelText,
  selected = [],
  options,
  freeSolo = false,
  groupByField,
  multiple = false,
  variant = 'outlined',
  size = 'small',
  limitTags,
  width = '100%',
  margin = 2,
  debounceSeconds = null,
  disabled = false,
  setProps
}: AutocompleteProps) => {
  // If debounceSeconds is not provided, default to 1 second for multiple selections
  if (debounceSeconds === null) debounceSeconds = multiple ? 1 : 0;

  // Local state to manage immediate UI updates
  const [localSelection, setLocalSelection] = useState<OptionType[]>(
    Array.isArray(selected) ? selected : [selected]
  );

  // Create a debounced version of setProps
  const debouncedSetProps = useMemo(
    () =>
      debounce((newSelection: OptionType[]) => {
        setProps({selected: newSelection});
      }, debounceSeconds * 1000), // Convert to milliseconds
    [setProps]
  );

  // Clear debounced calls on component unmount
  useEffect(() => {
    return () => {
      debouncedSetProps.clear();
    };
  }, [debouncedSetProps]);

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
    // Update local state for immediate UI update
    setLocalSelection(selection);

    // Fire Dash-assigned callback
    debouncedSetProps(selection);
  };

  return (
    <Box id={id} m={margin} width={width}>
      <MuiAutocomplete
        id={`${id}-input`}
        size={size}
        value={multiple ? localSelection : localSelection[0] || null}
        options={options}
        getOptionLabel={(option) => option.label || option}
        freeSolo={freeSolo}
        groupBy={groupByField ? (option) => option[groupByField] : undefined}
        multiple={multiple}
        limitTags={limitTags}
        onChange={handleChange}
        disableCloseOnSelect={multiple}
        disabled={disabled}
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

type AutocompleteProps = {
  /** The label text displayed for the autocomplete input */
  labelText?: string;
  /** The size of the autocomplete input, can be 'small' or 'medium' */
  size?: 'small' | 'medium';
  /** The variant of the autocomplete input, can be 'filled', 'outlined', or 'standard' */
  variant?: 'filled' | 'outlined' | 'standard';
  /** Currently selected option(s), can be a single option or an array of options */
  selected?: OptionType[] | OptionType;
  /** Options available for selection in the autocomplete */
  options: OptionType[];
  /** Limit the number of tags displayed when `multiple` is enabled */
  limitTags?: number;
  /** Allow the user to enter a value not included in the options */
  freeSolo?: boolean;
  /** Field in the option object to group options by in the list */
  groupByField?: string;
  /** Allow multiple selections */
  multiple?: boolean;
  /** Width of the autocomplete box (CSS value as string) */
  width?: string;
  /** Margin around the autocomplete box (CSS value as string or number) */
  margin?: string | number;
  /** If true, the autocomplete input will be disabled */
  disabled?: boolean;
  /** Seconds to wait to fire Dash callback */
  debounceSeconds?: number;
} & DashComponentProps;

type OptionType = {
  label: string;
  value: string;
};

export default Autocomplete;
