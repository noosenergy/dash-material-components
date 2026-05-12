import React from 'react';
import {Box} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {parseISO, format, isValid} from 'date-fns';
import {CalendarPropsType} from '../components/inputs/Calendar';

const DATE_FORMAT = 'yyyy-MM-dd';

/**
 * Calendar component
 */
const Calendar = ({
  id = 'calendar',
  labelText,
  helperText,
  width = '100%',
  margin = 2,
  maxDate = '2100-01-01',
  minDate = '1900-01-01',
  disableFuture = true,
  disablePast = false,
  selected = null,
  disableToolbar = true,
  disabled = false,
  setProps
}: CalendarPropsType) => {
  const handleChange = (value: Date | null) => {
    if (value && isValid(value)) {
      setProps({selected: format(value, DATE_FORMAT)});
    }
  };

  return (
    <Box id={id} m={margin} width={width}>
      <DatePicker
        label={labelText}
        value={selected ? parseISO(selected) : null}
        onChange={handleChange}
        format={DATE_FORMAT}
        disabled={disabled}
        disableFuture={disableFuture}
        disablePast={disablePast}
        maxDate={maxDate ? parseISO(maxDate) : undefined}
        minDate={minDate ? parseISO(minDate) : undefined}
        slotProps={{
          textField: {
            helperText,
            id: `${id}-input`,
            variant: 'outlined',
            fullWidth: true
          },
          toolbar: {hidden: disableToolbar}
        }}
      />
    </Box>
  );
};

export default Calendar;
export type {CalendarPropsType};
