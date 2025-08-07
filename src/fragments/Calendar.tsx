import React from 'react';
import {Box} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {CalendarPropsType} from '../components/inputs/Calendar';

// Accepted format for parsing calendar dates
const dateFormat = 'yyyy-MM-dd';

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
  disableToolbar = false,
  disabled = false,
  setProps
}: CalendarPropsType) => {
  const handleCalendarChange = (value: Date) => {
    // Fire Dash-assigned callback
    if (value) {
      console.log(value);
      console.log(typeof value);
      const selected = value.toISOString().split('T')[0];
      setProps({selected});
    }
  };

  const calendarControls = {
    autoOk: true,
    disableToolbar: disableToolbar,
    value: new Date(selected),
    onChange: handleCalendarChange,
    format: dateFormat,
    maxDate: maxDate ? new Date(maxDate) : undefined,
    minDate: minDate ? new Date(minDate) : undefined,
    disableFuture: disableFuture,
    disablePast: disablePast
  };

  return (
    <Box id={id} m={margin} width={width}>
      <DatePicker
        label={labelText}
        slotProps={{
          textField: {
            helperText,
            id: `${id}-input`,
            variant: 'outlined',
            fullWidth: true
          }
        }}
        disabled={disabled}
        {...calendarControls}
      />
    </Box>
  );
};

export default Calendar;
export type {CalendarPropsType};
